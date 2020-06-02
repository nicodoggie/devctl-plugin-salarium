import { salariumApi } from "./fn";
import statusAction from "./status";
import qs from "qs";

export default async function (Cookie, log_type) {
  try {
    await salariumApi.post(
      "/employees/ebundy_clock",
      qs.stringify({
        log_type,
      }),
      {
        headers: {
          Cookie,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    statusAction(Cookie, "Succesfully ");
  } catch (err) {
    throw err;
  }
}
