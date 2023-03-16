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
    constructor(name, opts) {
        this.name = name;
        this.options = opts || defaultOptions;
        debug(`Logger with name ${this.name}, options`, this.options);
        this._checkUpdate();
    }
    async _checkUpdate() {
        const response = await axios
            .get("https://api.github.com/repos/Mimexe/mime-logger/contents/package.json")
            .catch((err) => {
            if (this.options?.warnings) {
                process.emitWarning("Error occured while checking updates");
            }
            debug(`Error occured while checking updates: ` + err.message || err);
            return null;
        });
        if (!response) {
            return;
        }
        const pkg = JSON.parse(Buffer.from(response.data.content, response.data.encoding).toString());
        const thisPkg = JSON.parse(fs.readFileSync("./node_modules/mime-logger/package.json").toString());
        debug("this:", thisPkg.version);
        debug("remote:", pkg.version);
        if (!semver.eq(thisPkg.version, pkg.version)) {
            debug("not equals", semver.eq(thisPkg.version, pkg.version));
            if (semver.lte(thisPkg.version, pkg.version)) {
                debug("update available", semver.lte(thisPkg.version, pkg.version));
                console.log(`[mime-logger] Update available ! ${chalk.cyan(`${thisPkg.version} -> ${pkg.version}`)}`);
                console.log(`[mime-logger] Use "npm install Mimexe/mime-logger"`);
            }
            else {
                debug("not update available", semver.lte(thisPkg.version, pkg.version));
            }
        }
        else {
            debug("equals", semver.eq(thisPkg.version, pkg.version));
        }
    }
    log(level = LogLevel.INFO, message) {
        if (!message)
            return;
        debug(`log ${level.toString()} with message ${message}`);
        console.log(this.format({
            message: message,
            level: level,
            name: this.name,
            timestamp: new Date(),
        }));
    }
    info(message) {
        debug(`log function info ${message}`);
        this.log(LogLevel.INFO, message);
    }
    warn(message) {
        debug(`log function warn ${message}`);
        this.log(LogLevel.WARN, message);
    }
    error(message) {
        debug(`log function error ${message}`);
        this.log(LogLevel.ERROR, message);
    }
    child(name) {
        debug(`child name ${name}`);
        if (this.name == null) {
            if (this.options?.warnings) {
                process.emitWarning("this.name is null () will equals the child", {
                    code: "MIME_LOGGER",
                    detail: "There is no name on the parent logger () will be the child not the name\nSet 'warnings' to 'false' to disable this",
                });
            }
            return new MimeLogger(name, this.options);
        }
        return new MimeLogger(this.name + "/" + name);
    }
    format(obj) {
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
        return `[${obj.timestamp.toLocaleTimeString()}.${obj.timestamp.getMilliseconds()}] ${levelString}${this.name ? chalk.yellow(` (${this.name})`) : ""}: ${chalk.cyan(obj.message)}`;
    }
}
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (LogLevel = {}));
export { MimeLogger, LogLevel };
export default MimeLogger;
