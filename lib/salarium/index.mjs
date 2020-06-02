import { connect } from "./fn";
import inquirer from "inquirer";
import chalk from "chalk";

import statusAction from "./status";

import clockAction from "./clock-in-out";
const clockIn = (Cookie) => clockAction(Cookie, "TIME IN");
const clockOut = (Cookie) => clockAction(Cookie, "TIME OUT");

export default async function (command, { refresh } = {}) {
  const Cookie = await connect(refresh);

  switch (command) {
    case "approve":
      return require("./approve")(Cookie);
    case "in":
      return clockIn(Cookie);
    case "out":
      return clockOut(Cookie);
    case "status":
      return statusAction(Cookie);
    case "summary":
      return console.log((await require("./summary")(Cookie)).toString());
    case "edit":
      return await require("./edit-clock-in-out")(Cookie);
    default: {
      const status = await statusAction(Cookie);

      if (status.clockedIn) {
        const { confirm } = await inquirer.prompt({
          type: "confirm",
          name: "confirm",
          message: `Do you want to ${chalk.bgRed("Clock Out")}?`,
        });

        if (confirm) {
          return clockOut(Cookie);
        }
      } else {
        const { confirm } = await inquirer.prompt({
          type: "confirm",
          name: "confirm",
          message: `Do you want to ${chalk.bgGreen("Clock In")}?`,
        });

        if (confirm) {
          return clockIn(Cookie);
        }
      }
    }
  }
}
