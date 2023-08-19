import chalk from "chalk";
import Debug from "debug";
const debug = Debug("mime-logger");
const defaultOptions = {
    debug: false,
};
class MimeLogger {
    constructor(name, opts) {
        this.name = name;
        this.options = opts || defaultOptions;
        this.options.debug = this.options.debug || false;
        debug(`set development ${this.options.debug}`);
        debug(`Logger with name ${this.name}, options`, this.options);
    }
    setDevelopment(enabled) {
        debug(`set development ${enabled}`);
        if (enabled) {
            this.options.debug = true;
        }
        else {
            this.options.debug = false;
        }
    }
    log(level = LogLevel.INFO, message, args) {
        if (!message)
            return;
        debug(`log ${level.toString()} with message ${message}`);
        console.log(this.format({
            message: message,
            level: level,
            name: this.name,
            timestamp: new Date(),
            args,
        }));
    }
    info(message, ...args) {
        debug(`log function info ${message} with args [${args.join(", ")}]`);
        this.log(LogLevel.INFO, message, args);
    }
    warn(message, ...args) {
        debug(`log function warn ${message} with args [${args.join(", ")}]`);
        this.log(LogLevel.WARN, message, args);
    }
    error(message, ...args) {
        debug(`log function error ${message} with args [${args.join(", ")}]`);
        this.log(LogLevel.ERROR, message, args);
    }
    debug(message, ...args) {
        debug(`log function debug ${message} with args [${args.join(", ")}]`);
        if (this.options.debug) {
            debug(`debug enabled`);
            this.log(LogLevel.DEBUG, message, args);
        }
        else {
            debug(`debug not enabled`);
        }
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
            case LogLevel.DEBUG:
                levelString = chalk.gray("DEBUG");
                break;
            default:
                levelString = chalk.bgRed("???");
                break;
        }
        if (levelString == null) {
            throw new Error("Cannot get level string");
        }
        const message = `[${obj.timestamp.toLocaleTimeString()}.${obj.timestamp.getMilliseconds()}] ${levelString}${this.name
            ? chalk.yellow(` (${this.name}${obj.level == LogLevel.DEBUG ? "/DEBUG" : ""})`)
            : ""}: ${chalk.cyan(obj.message)}`;
        let messageFormatted = message;
        for (const arg of obj.args) {
            messageFormatted = messageFormatted.replace("%s", arg);
        }
        return messageFormatted;
    }
    write(message, ...args) {
        debug(`write message ${message} with args [${args.join(", ")}]`);
        process.stdout.write(this.format({
            message: message,
            level: LogLevel.INFO,
            name: this.name,
            timestamp: new Date(),
            args,
        }));
    }
    async promisesWrite(message, level = LogLevel.INFO, ...promises) {
        debug(`promises write message ${message} with promises`, promises);
        const now = new Date();
        let levelString = null;
        switch (level) {
            case LogLevel.INFO:
                levelString = chalk.green("INFO");
                break;
            case LogLevel.WARN:
                levelString = chalk.yellow("WARN");
                break;
            case LogLevel.ERROR:
                levelString = chalk.red("ERROR");
                break;
            case LogLevel.DEBUG:
                levelString = chalk.gray("DEBUG");
                break;
            default:
                levelString = chalk.bgRed("???");
                break;
        }
        if (levelString == null) {
            throw new Error("Cannot get level string");
        }
        const start = `[${now.toLocaleTimeString()}.${now.getMilliseconds()}] ${levelString}${this.name
            ? chalk.yellow(` (${this.name}${level == LogLevel.DEBUG ? "/DEBUG" : ""})`)
            : ""}: `;
        process.stdout.write(start);
        if (message.indexOf("%p") == -1) {
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
    }
}
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    LogLevel["DEBUG"] = "debug";
})(LogLevel || (LogLevel = {}));
export { MimeLogger, LogLevel };
export default MimeLogger;
