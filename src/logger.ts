import chalk from "chalk";
import { LogLevel, MimeLoggerOptions, FormatObject, defaultOptions } from "./types.js";
import { formatMessage, getLevelString } from "./formatter.js";

export class MimeLogger {
  name?: string;
  options: MimeLoggerOptions;

  constructor(name?: string, opts?: MimeLoggerOptions) {
    this.name = name;
    this.options = opts || defaultOptions;
    this.options.debug = this.options.debug || false;
  }

  log(level: LogLevel = LogLevel.INFO, message: string, args: any[]): void {
    if (!message) return;
    console.log(
      formatMessage(
        {
          message,
          level,
          name: this.name,
          timestamp: new Date(),
          args,
        },
        this.name
      )
    );
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
    if (this.name == null) {
      return new MimeLogger(name, this.options);
    }
    return new MimeLogger(this.name + "/" + name, this.options);
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
        this.name
      )
    );
  }

  async promisesWrite(
    message: string,
    level: LogLevel = LogLevel.INFO,
    ...promises: Promise<any>[]
  ): Promise<void> {
    const now = new Date();
    const levelString = getLevelString(level);

    const nameSection = this.name
      ? chalk.yellow(` (${this.name}${level === LogLevel.DEBUG ? "/DEBUG" : ""})`)
      : "";

    const start = `[${now.toLocaleTimeString()}.${now.getMilliseconds()}] ${levelString}${nameSection}: `;

    process.stdout.write(start);

    if (message.indexOf("%p") === -1) {
      throw new Error("No %p in message");
    }

    const parts = message.split("%p");
    let i = 0;
    for (const part of parts) {
      process.stdout.write(chalk.cyan(part));
      if (i < promises.length) {
        process.stdout.write(chalk.cyan(await promises[i]));
      }
      i++;
    }
    process.stdout.write("\n");
  }
}

export default MimeLogger;
