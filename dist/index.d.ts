declare class MimeLogger {
    name?: string;
    options: MimeLoggerOptions;
    constructor(name?: string, opts?: MimeLoggerOptions);
    /**
     * @deprecated Use debug package instead, this function will be removed in the future
     */
    setDevelopment(enabled: boolean): void;
    log(level: LogLevel | undefined, message: string, args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    /**
     * @deprecated Use debug package instead, this function will be removed in the future
     */
    debug(message: string, ...args: any[]): void;
    child(name: string): MimeLogger;
    format(obj: FormatObject): string;
    write(message: string, ...args: any[]): void;
    promisesWrite(message: string, level?: LogLevel, ...promises: Promise<any>[]): Promise<void>;
}
interface FormatObject {
    message: string;
    name?: string;
    timestamp: Date;
    level: LogLevel;
    args: any[];
}
interface MimeLoggerOptions {
    debug?: boolean;
}
declare enum LogLevel {
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    DEBUG = "debug"
}
export { MimeLogger, LogLevel };
export default MimeLogger;
