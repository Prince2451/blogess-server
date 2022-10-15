import { config } from "dotenv";

function setConfig() {
  config({
    path: process.cwd() + "/.env." + (process.env.NODE_ENV || "development"),
  });
}

setConfig();
