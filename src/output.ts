import { createWriteStream, existsSync, mkdirSync, WriteStream } from "fs";
import { dirname } from "path";
import ansis from "ansis";
import type { FormatObject, OutputTarget } from "./types.js";

export type WriteFn = (message: string, obj: FormatObject) => void;

const streams = new Map<string, WriteStream>();

export function _clearCaches() {
  for (const s of streams.values()) s.end();
  streams.clear();
}

function getStream(filePath: string): WriteStream {
  let stream = streams.get(filePath);
  if (!stream) {
    const dir = dirname(filePath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    stream = createWriteStream(filePath, { flags: "a", encoding: "utf8" });
    streams.set(filePath, stream);
  }
  return stream;
}

function resolveFilePath(template: string): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return template
    .replace("{year}", year)
    .replace("{month}", month)
    .replace("{day}", day)
    .replace("{date}", `${year}-${month}-${day}`)
    .replace("{hour}", String(now.getHours()).padStart(2, "0"))
    .replace("{minutes}", String(now.getMinutes()).padStart(2, "0"))
    .replace("{seconds}", String(now.getSeconds()).padStart(2, "0"))
    .replace("{ms}", String(now.getMilliseconds()).padStart(3, "0"));
}

export function buildOutput(targets: OutputTarget | OutputTarget[]): WriteFn {
  const list = Array.isArray(targets) ? targets : [targets];
  const fns: WriteFn[] = list.map((target) => {
    if (target === "console") {
      return (message) => console.log(message);
    }
    if (typeof target === "function") {
      return target;
    }
    return (message) => {
      const filePath = resolveFilePath(target.path);
      getStream(filePath).write(ansis.strip(message) + "\n");
    };
  });
  return (message, obj) => {
    for (const fn of fns) fn(message, obj);
  };
}
