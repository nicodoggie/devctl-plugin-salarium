import { salariumApi } from "./fn";
import chalk from "chalk";
import cheerio from "cheerio";

const { inverse, bgGreen, bgRed, underline, cyan, magenta } = chalk;

function parse(str) {
  const regex = /(Clocked In|Clocked Out) on ([\w\s\d,]*) at ([\d:]*)/gm;
  let m;

  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    const [full, action, date, time] = m;

    return {
      full,
      action,
      clockedIn: action === "Clocked In",
      date,
      time,
    };
  }
}

function colorize(status, raw, prefix = "Last Action: ") {
  let output = "";

  if (prefix) {
    output += underline(prefix);
  }

  if (status.clockedIn) {
    output += bgGreen(status.action);
  } else if (!status.clockedIn && status.action === "Clocked Out") {
    output += bgRed(status.action);
  } else {
    return `${inverse("INVALID PARSING (report to @maso):")} ${raw}`;
  }

  output += ` on ${magenta(status.date)} at ${cyan(status.time)}`;

  return output;
}

export default async function (Cookie) {
  const response = await salariumApi.get("/employees/page/dashboard", {
    headers: {
      Cookie,
    },
  });

  const $ = cheerio.load(response.data);
  const rawStatus = $(".last-user-action").text();
  const status = parse(rawStatus);

  const colorized = colorize(status, rawStatus);

  console.log(colorized);

  return status;
}
