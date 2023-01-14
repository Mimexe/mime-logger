declare class MimeLogger {
    name?: string;
    options?: MimeLoggerOptions;
    constructor(name?: string, opts?: MimeLoggerOptions);
    log(level: LogLevel | undefined, message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
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
}
declare enum LogLevel {
    INFO = 0,
    WARN = 1,
    ERROR = 2
}
export { MimeLogger, LogLevel };
export default MimeLogger;
