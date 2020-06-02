require = require("esm")(module);

const sal = require("../lib/salarium/index").default;

module.exports = {
  name: "salarium",
  alias: ["sal"],
  run: async ({ print, parameters }) => {
    sal(parameters.first);
  },
};
