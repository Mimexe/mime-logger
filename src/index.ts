export { MimeLogger } from "./logger.js";
export { LogLevel } from "./types.js";
export type { FormatObject, LoggerOptions, FormatFn, ColorHelpers, OutputTarget, FileOutputOptions } from "./types.js";
export { getLevelString } from "./formatter.js";
export { Formats, colors } from "./presets.js";

import MimeLogger from "./logger.js";
export default MimeLogger;
