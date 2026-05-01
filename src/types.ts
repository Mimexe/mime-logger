export enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface FormatObject {
  message: string;
  name?: string;
  timestamp: Date;
  level: LogLevel;
  args: any[];
}

export interface ColorHelpers {
  red: (s: string) => string;
  yellow: (s: string) => string;
  blue: (s: string) => string;
  green: (s: string) => string;
  cyan: (s: string) => string;
  magenta: (s: string) => string;
  gray: (s: string) => string;
  bold: (s: string) => string;
  dim: (s: string) => string;
}

export type FormatFn = (obj: FormatObject, colors: ColorHelpers) => string;

export interface FileOutputOptions {
  type: "file";
  /** Path to log file. Supports time tokens: `{year}` `{month}` `{day}` `{date}` `{hour}` `{minutes}` `{seconds}` `{ms}` */
  path: string;
}

export type OutputTarget =
  | "console"
  | FileOutputOptions
  | ((message: string, obj: FormatObject) => void);

export interface LoggerOptions {
  format?: string | FormatFn;
  output?: OutputTarget | OutputTarget[];
}
