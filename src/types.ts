export enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error"
}

export interface FormatObject {
  message: string;
  name?: string;
  timestamp: Date;
  level: LogLevel;
  args: any[];
}
