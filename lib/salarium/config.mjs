import dotenv from "dotenv";
import xdg from "@folder/xdg";

dotenv.config({ silent: true });
const dirs = xdg();

import { resolve, dirname } from "path";
import keyBy from "lodash/keyBy";
import { readYamlFile } from "../../lib/yaml";

export const userConfigPath = resolve(
  dirs.config,
  "devctl",
  "salarium",
  "config.yaml"
);

export const userConfig = (() => readYamlFile(userConfigPath))();
