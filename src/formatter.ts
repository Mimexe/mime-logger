import { green, yellow, red, bgRed, cyan } from "ansis";
import { LogLevel, FormatObject } from "./types.js";

const messageColorMap = { yellow, red, cyan } as const;

export function getLevelString(level: LogLevel): string {
  switch (level) {
    case LogLevel.INFO:
      return green("INFO");
    case LogLevel.WARN:
      return yellow("WARN");
    case LogLevel.ERROR:
      return red("ERROR");
    default:
      return bgRed("???");
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
    ? yellow(` (${loggerName})`)
    : "";

  const timestamp = `[${obj.timestamp.toLocaleTimeString()}.${obj.timestamp.getMilliseconds()}]`;
  const coloredMessage = messageColorMap[getMessageColor(obj.level)](obj.message);

  let message = `${timestamp} ${levelString}${nameSection}: ${coloredMessage}`;

  // Replace %s placeholders with arguments
  for (const arg of obj.args) {
    message = message.replace("%s", arg);
  }

  return message;
}
