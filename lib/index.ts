import chalk from "chalk";
import * as fs from "fs";
import axios from "axios";
import Debug from "debug";
import semver from "semver";
const debug = Debug("mime-logger");

const defaultOptions = {
  warnings: true,
  update: true,
};
class MimeLogger {
  name?: string;
  options?: MimeLoggerOptions;
  constructor(name?: string, opts?: MimeLoggerOptions) {
    this.name = name;
    this.options = opts || defaultOptions;
    debug(`Logger with name ${this.name}, options`, this.options);
    this._checkUpdate();
  }

  private async _checkUpdate() {
    const response = await axios.get(
      "https://api.github.com/repos/Mimexe/mime-logger/contents/package.json"
    );
    const pkg: {
      name: string;
      version: string;
      description: string;
      main: string;
      scripts: object;
      keywords: Array<string>;
      author: string;
      type: "commonjs" | "module";
      license: string;
    } = JSON.parse(
      Buffer.from(response.data.content, response.data.encoding).toString()
    );

    const thisPkg: {
      name: string;
      version: string;
      description: string;
      main: string;
      scripts: object;
      keywords: Array<string>;
      author: string;
      type: "commonjs" | "module";
      license: string;
    } = JSON.parse(
      fs.readFileSync("./node_modules/mime-logger/package.json").toString()
    );

    debug("this:", thisPkg.version);
    debug("remote:", pkg.version);

    if (!semver.eq(thisPkg.version, pkg.version)) {
      debug("not equals", semver.eq(thisPkg.version, pkg.version));
      if (semver.lte(thisPkg.version, pkg.version)) {
        debug("update available", semver.lte(thisPkg.version, pkg.version));
        console.log(
          `[mime-logger] Update available ! ${chalk.cyan(
            `${thisPkg.version} -> ${pkg.version}`
          )}`
        );
      } else {
        debug("not update available", semver.lte(thisPkg.version, pkg.version));
      }
    } else {
      debug("equals", semver.eq(thisPkg.version, pkg.version));
    }
  }

  log(level: LogLevel = LogLevel.INFO, message: string): void {
    if (!message) return;
    debug(`log ${level.toString()} with message ${message}`);
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
    debug(`log function info ${message}`);
    this.log(LogLevel.INFO, message);
  }

  warn(message: string): void {
    debug(`log function warn ${message}`);
    this.log(LogLevel.WARN, message);
  }

  error(message: string): void {
    debug(`log function error ${message}`);
    this.log(LogLevel.ERROR, message);
  }

  child(name: string): MimeLogger {
    debug(`child name ${name}`);
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
    debug(`format object`, obj);

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
  update: boolean;
}

enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export { MimeLogger, LogLevel };
export default MimeLogger;
