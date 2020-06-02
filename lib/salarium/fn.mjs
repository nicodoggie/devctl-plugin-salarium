import { userConfig, userConfigPath } from "./config";
import qs from "qs";
import get from "lodash/get";
import inquirer from "inquirer";
import { encrypt, decrypt } from "./util";
import { saveYamlFile } from "../yaml";
import axios from "axios";

export const salariumApi = axios.create({
  baseURL: "https://app.salarium.com/",
  timeout: 1000 * 60 * 5,
});

async function getCookie({ username, password }) {
  const response = await salariumApi.post(
    "/users/login",
    qs.stringify({
      email: username,
      password: password,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const message = get(response, "data.message");

  if (message !== "Success. Please wait for redirection...") {
    throw new Error("Bad Password");
  }

  const setCookies = get(response, "headers.set-cookie");

  if (!setCookies) {
    throw new Error("No cookie returned");
  }

  return setCookies;
}

async function prompt() {
  const { username, password } = await inquirer.prompt([
    {
      type: "input",
      message: "Enter your username",
      name: "username",
    },
    {
      type: "password",
      message: "Enter your password",
      name: "password",
    },
  ]);

  // we're encrypting the password so that it's not "easy" to see when checking the config file
  const encrypted = encrypt(password);

  const newConfig = {
    ...userConfig,
    salarium: {
      username,
      password: encrypted,
    },
  };

  saveYamlFile(userConfigPath, newConfig);

  return { username, password };
}

export async function connect(refresh = false) {
  let credentials = get(userConfig, "salarium");
  if (credentials && !refresh) {
    return getCookie({
      username: credentials.username,
      password: decrypt(credentials.password),
    });
  }

  credentials = await prompt();
  return getCookie(credentials);
}
