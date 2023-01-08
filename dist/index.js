import chalk from "chalk";
class MimeLogger {
    constructor(name) {
        this.name = name;
    }
    log(level = LogLevel.INFO, message) {
        if (!message)
            throw new TypeError("test");
        console.log(this.format({
            message: message,
            level: level,
            name: this.name,
            timestamp: new Date(),
        }));
    }
    info(message) {
        this.log(LogLevel.INFO, message);
    }
    warn(message) {
        this.log(LogLevel.WARN, message);
    }
    error(message) {
        this.log(LogLevel.ERROR, message);
    }
    child(name) {
        if (this.name == null) {
            throw new Error("You need a name for the parent");
        }
        return new MimeLogger(this.name + "/" + name);
    }
    format(obj) {
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
    LogLevel[LogLevel["INFO"] = 0] = "INFO";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["ERROR"] = 2] = "ERROR";
})(LogLevel || (LogLevel = {}));
export { MimeLogger, LogLevel };
export default { MimeLogger, LogLevel };
