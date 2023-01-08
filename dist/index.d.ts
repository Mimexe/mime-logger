declare class MimeLogger {
    name?: string;
    constructor(name?: string);
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
declare enum LogLevel {
    INFO = 0,
    WARN = 1,
    ERROR = 2
}
export { MimeLogger, LogLevel, FormatObject };
declare const _default: {
    MimeLogger: typeof MimeLogger;
    LogLevel: typeof LogLevel;
};
export default _default;
