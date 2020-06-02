import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import yaml from "js-yaml";

export function readYamlFile(path, defaultValue) {
  try {
    return yaml.safeLoad(readFileSync(resolve(path), "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") {
      return defaultValue;
    }

    throw e;
  }
}
export function saveYamlFile(path, data = {}, options = {}) {
  mkdirSync(dirname(path), { recursive: true });
  return writeFileSync(path, yaml.dump(data), options);
}
