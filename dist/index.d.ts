declare class MimeLogger {
    name?: string;
    options: MimeLoggerOptions;
    constructor(name?: string, opts?: MimeLoggerOptions);
    setDeveloppement(enabled: boolean): void;
    log(level: LogLevel | undefined, message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    debug(message: string): void;
    child(name: string): MimeLogger;
    format(obj: FormatObject): string;
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
    debug?: boolean;
}
declare enum LogLevel {
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
export { MimeLogger, LogLevel };
export default MimeLogger;
