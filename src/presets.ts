import { colors } from "./colors.js";
import { getLevelString, getMessageColor, messageColorMap } from "./formatter.js";
import type { FormatFn } from "./types.js";

function applyArgs(str: string, args: any[]): string {
  let result = str;
  for (const arg of args) result = result.replace("%s", String(arg));
  return result;
}

const pretty: FormatFn = (obj, c) => {
  const ts = c.dim(
    `[${obj.timestamp.toLocaleTimeString()}.${obj.timestamp.getMilliseconds()}]`,
  );
  const level = getLevelString(obj.level);
  const name = obj.name ? c.yellow(` (${obj.name})`) : "";
  const msg = messageColorMap[getMessageColor(obj.level)](
    applyArgs(obj.message, obj.args),
  );
  return `${ts} ${level}${name}: ${msg}`;
};

const minimalLevelColors: Record<string, (s: string) => string> = {
  info: colors.cyan,
  warn: colors.yellow,
  error: colors.red,
};

const minimal: FormatFn = (obj, c) => {
  const colorFn = minimalLevelColors[obj.level] ?? c.gray;
  const level = colorFn(obj.level.toUpperCase().padEnd(5));
  const name = obj.name ? c.dim(obj.name + " ") : "";
  return `${level} ${name}${applyArgs(obj.message, obj.args)}`;
};

const detailed: FormatFn = (obj, c) => {
  const ts = c.dim(obj.timestamp.toISOString());
  const level = getLevelString(obj.level);
  const name = obj.name ? c.yellow(` (${obj.name})`) : "";
  const msg = messageColorMap[getMessageColor(obj.level)](
    applyArgs(obj.message, obj.args),
  );
  return `${ts} ${level}${name}: ${msg}`;
};

const json: FormatFn = (obj) =>
  JSON.stringify({
    timestamp: obj.timestamp.toISOString(),
    level: obj.level,
    name: obj.name ?? null,
    message: applyArgs(obj.message, obj.args),
  });

export const Formats = { pretty, minimal, detailed, json } as const;
export { colors };
