import { green, yellow, red, bgRed, cyan } from "ansis";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { colors } from "./colors.js";
import { LogLevel, FormatObject, FormatFn } from "./types.js";

const _libDir = dirname(fileURLToPath(import.meta.url)).replace(/\\/g, "/");

export const messageColorMap = { yellow, red, cyan } as const;

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

function parseStackLine(line: string) {
  const match = line.match(/at (?:(.+?) \()?(?:.+[/\\])?(.+?):(\d+):\d+\)?/);
  if (!match) return null;
  return { fn: match[1] ?? "", file: match[2] ?? "", line: match[3] ?? "" };
}

export interface CallerInfoOptions {
  skipFrames?: number;
  additionalSkip?: RegExp;
}

export function getCallerInfo(options: CallerInfoOptions = {}) {
  const obj: { stack?: string } = {};
  Error.captureStackTrace(obj, getCallerInfo);
  let userFrames = (obj.stack?.split("\n").slice(1) ?? []).filter((l) => {
    if (!l.includes("    at ")) return false;
    if (l.includes("    at node:")) return false;
    if (l.replace(/\\/g, "/").includes(_libDir)) return false;
    if (options.additionalSkip?.test(l)) return false;
    return true;
  });
  if (options.skipFrames) userFrames = userFrames.slice(options.skipFrames);
  const direct = parseStackLine(userFrames[0] ?? "");
  const above = parseStackLine(userFrames[1] ?? "");
  if (!direct) return { file: "", line: "", function: "", caller: "" };
  return {
    file: direct.file,
    line: direct.line,
    function: direct.fn,
    caller: above?.fn ?? "",
  };
}

export function formatMessage(
  obj: FormatObject,
  format?: string | FormatFn,
): string {
  if (typeof format === "function") {
    return format(obj, colors);
  }

  const timestamp = `[${obj.timestamp.toLocaleTimeString()}.${obj.timestamp.getMilliseconds()}]`;

  if (typeof format === "string") {
    const needsCaller = /\{(?:file|line|function|caller)\}/.test(format);
    const ci = needsCaller
      ? getCallerInfo()
      : { file: "", line: "", function: "", caller: "" };
    let result = format
      .replaceAll("{time}", timestamp)
      .replaceAll("{date}", obj.timestamp.toLocaleDateString())
      .replaceAll("{time_ms}", obj.timestamp.getMilliseconds().toString())
      .replaceAll("{iso}", obj.timestamp.toISOString())
      .replaceAll("{level}", obj.level)
      .replaceAll("{name}", obj.name ?? "")
      .replaceAll("{message}", obj.message)
      .replaceAll("{pid}", process.pid.toString())
      .replaceAll("{env}", process.env.NODE_ENV || "production")
      .replaceAll("{file}", ci.file)
      .replaceAll("{line}", ci.line)
      .replaceAll("{function}", ci.function)
      .replaceAll("{caller}", ci.caller);
    for (const arg of obj.args) {
      result = result.replace("%s", String(arg));
    }
    return result;
  }

  const levelString = getLevelString(obj.level);
  const nameSection = obj.name ? yellow(` (${obj.name})`) : "";
  const coloredMessage = messageColorMap[getMessageColor(obj.level)](
    obj.message,
  );
  let message = `${timestamp} ${levelString}${nameSection}: ${coloredMessage}`;
  for (const arg of obj.args) {
    message = message.replace("%s", String(arg));
  }
  return message;
}
