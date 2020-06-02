import { salariumApi } from './fn';
import qs from 'qs';
import get from 'lodash/get';
import { getMonth, getDate, getYear } from 'date-fns';
import Table from 'cli-table2';

module.exports = async function(Cookie) {
  try {
    const now = new Date();
    const m = getMonth(now) + 1; // month is index 0
    const y = getYear(now);
    const dayInMonth = getDate(now);

    const firstHalf = dayInMonth <= 15;
    const ranges = [
      [{ start: 1, end: 10 }, { start: 11, end: 15 }],
      [{ start: 16, end: 25 }, { start: 26, end: 31 }],
    ];

    const table = new Table({
      head: ['Date', 'Label', 'Clock In', 'Clock Out', 'Status'],
    });

    const range = ranges[firstHalf ? 0 : 1];
    for (let i = 0; i < 2; i++) {
      const params = qs.stringify({
        daterange: `${m}/${range[i].start}/${y} - ${m}/${range[i].end}/${y}`,
      });

      const entries = await getEntries(Cookie, params);

      entries.forEach(entry => {
        table.push(formatEntry(entry));
      });
    }

    return table;
  } catch (err) {
    throw err;
  }
};

async function getEntries(Cookie, params) {
  const results = await salariumApi.get(
    `/employee/attendance/time_record/rest/search.json?${params}`,
    {
      headers: {
        Cookie,
      },
    }
  );

  return results.data.data.entries;
}

// order must be ['Date', 'Label', 'Clock In', 'Clock Out', 'Status'],
function formatEntry(entry) {
  return [
    `${entry.formatted_date} (${entry.day_of_the_week})`,
    entry.labels.join(','),
    get(entry, 'records.items[0].in.text', ''),
    get(entry, 'records.items[0].out.text', ''),
    entry.status_description,
  ];
}
