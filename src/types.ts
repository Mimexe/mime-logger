export enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  DEBUG = "debug",
}

export interface FormatObject {
  message: string;
  name?: string;
  timestamp: Date;
  level: LogLevel;
  args: any[];
}

export interface MimeLoggerOptions {
  debug?: boolean;
}

export const defaultOptions: MimeLoggerOptions = {
  debug: false,
};
