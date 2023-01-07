import chalk from "chalk";
import * as fs from "fs";

class MimeLogger {
  name: string;
  constructor(name: string) {
    this.name = name;
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
    return `[${obj.timestamp.toLocaleTimeString()}.${obj.timestamp.getMilliseconds()}] ${levelString} ${chalk.yellow(
      `(${this.name})`
    )}: ${chalk.cyan(obj.message)}`;
  }
}

interface FormatObject {
  message: string;
  name: string;
  timestamp: Date;
  level: LogLevel;
}

enum LogLevel {
  INFO,
  WARN,
  ERROR,
}

export { MimeLogger, LogLevel, FormatObject };
export default { MimeLogger, LogLevel };
