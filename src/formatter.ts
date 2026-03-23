import chalk from "chalk";
import { LogLevel, FormatObject } from "./types.js";

export function getLevelString(level: LogLevel): string {
  switch (level) {
    case LogLevel.INFO:
      return chalk.green("INFO");
    case LogLevel.WARN:
      return chalk.yellow("WARN");
    case LogLevel.ERROR:
      return chalk.red("ERROR");
    default:
      return chalk.bgRed("???");
  }
}

export function getMessageColor(level: LogLevel): "yellow" | "red" | "cyan" {
  if (level === LogLevel.WARN) return "yellow";
  if (level === LogLevel.ERROR) return "red";
  return "cyan";
}

export function formatMessage(obj: FormatObject, loggerName?: string): string {
  const levelString = getLevelString(obj.level);

  const nameSection = loggerName
    ? chalk.yellow(` (${loggerName})`)
    : "";

  const timestamp = `[${obj.timestamp.toLocaleTimeString()}.${obj.timestamp.getMilliseconds()}]`;
  const coloredMessage = chalk[getMessageColor(obj.level)](obj.message);

  let message = `${timestamp} ${levelString}${nameSection}: ${coloredMessage}`;

  // Replace %s placeholders with arguments
  for (const arg of obj.args) {
    message = message.replace("%s", arg);
  }

  return message;
}
