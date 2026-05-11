import { yellow, cyan } from "ansis";
import { LogLevel, LoggerOptions } from "./types.js";
import { formatMessage, getLevelString } from "./formatter.js";
import { buildOutput, WriteFn } from "./output.js";

export class MimeLogger {
  name?: string;
  options: LoggerOptions;
  private _write: WriteFn;

  constructor(name?: string, opts?: LoggerOptions) {
    this.name = name;
    this.options = opts ?? {};
    this._write = buildOutput(opts?.output ?? "console");
  }

  log(level: LogLevel = LogLevel.INFO, message: string, args: any[]): void {
    if (!message) return;
    const obj = {
      message,
      level,
      name: this.name,
      timestamp: new Date(),
      args,
    };
    this._write(formatMessage(obj, this.options.format), obj);
  }

  info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, args);
  }

  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, args);
  }

  error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, args);
  }

  child(name: string): MimeLogger {
    const childName = this.name == null ? name : `${this.name}/${name}`;
    return new MimeLogger(childName, this.options);
  }

  write(message: string, ...args: any[]): void {
    process.stdout.write(
      formatMessage(
        {
          message,
          level: LogLevel.INFO,
          name: this.name,
          timestamp: new Date(),
          args,
        },
        this.options.format,
      ),
    );
  }

  async promisesWrite(
    message: string,
    level: LogLevel = LogLevel.INFO,
    ...promises: Promise<any>[]
  ): Promise<void> {
    if (message.indexOf("%p") === -1) {
      throw new Error("No %p in message");
    }

    const now = new Date();
    const levelString = getLevelString(level);
    const nameSection = this.name ? yellow(` (${this.name})`) : "";
    const start = `[${now.toLocaleTimeString()}.${now.getMilliseconds()}] ${levelString}${nameSection}: `;
    const parts = message.split("%p");

    process.stdout.write(start);
    let i = 0;
    for (const part of parts) {
      process.stdout.write(cyan(part));
      if (i < promises.length) {
        process.stdout.write(cyan(String(await promises[i])));
      }
      i++;
    }
    process.stdout.write("\n");
  }
}

export default MimeLogger;
