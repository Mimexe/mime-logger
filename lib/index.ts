import chalk from "chalk";
import * as fs from "fs";
const defaultOptions = {
  warnings: true,
};
class MimeLogger {
  name?: string;
  options?: MimeLoggerOptions;
  constructor(name?: string, opts?: MimeLoggerOptions) {
    this.name = name;
    this.options = opts || defaultOptions;
  }

  log(level: LogLevel = LogLevel.INFO, message: string): void {
    if (!message) throw new TypeError("test");
    console.log(
      this.format({
        message: message,
        level: level,
        name: this.name,
        timestamp: new Date(),
      })
    );
  }

  info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }

  child(name: string): MimeLogger {
    if (this.name == null) {
      if (this.options?.warnings) {
        process.emitWarning("this.name is null () will equals the child", {
          code: "MIME_LOGGER",
          detail:
            "There is no name on the parent logger () will be the child not the name\nSet 'warnings' to 'false' to disable this",
        });
      }
      return new MimeLogger(name, this.options);
    }
    return new MimeLogger(this.name + "/" + name);
  }

  format(obj: FormatObject): string {
    let levelString = null;

    switch (obj.level) {
      case LogLevel.INFO:
        levelString = chalk.green("INFO");
        break;
      case LogLevel.WARN:
        levelString = chalk.yellow("WARN");
        break;
      case LogLevel.ERROR:
        levelString = chalk.red("ERROR");
        break;
      default:
        levelString = chalk.bgRed("???");
        break;
    }
    if (levelString == null) {
      throw new Error("Cannot get level string");
    }
    return `[${obj.timestamp.toLocaleTimeString()}.${obj.timestamp.getMilliseconds()}] ${levelString}${
      this.name ? chalk.yellow(` (${this.name})`) : ""
    }: ${chalk.cyan(obj.message)}`;
  }
}

interface FormatObject {
  message: string;
  name?: string;
  timestamp: Date;
  level: LogLevel;
}

interface MimeLoggerOptions {
  warnings: boolean;
}

enum LogLevel {
  INFO,
  WARN,
  ERROR,
}

export { MimeLogger, LogLevel };
export default MimeLogger;
