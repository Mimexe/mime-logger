import chalk from "chalk";
import Debug from "debug";
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
