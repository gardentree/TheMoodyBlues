import logger from "electron-log";
import {environment} from "./tools";

if (environment.isTest()) {
  logger.transports.console.level = false;
  logger.transports.file.level = false;
}

export default logger;
