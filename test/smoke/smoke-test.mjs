import MimeLogger, { LogLevel, Formats, colors, getLevelString, getCallerInfo } from "mime-logger";

let failures = 0;
function check(name, cond) {
  if (!cond) {
    console.error(`  FAIL  ${name}`);
    failures++;
  }
}

check("default export is a constructor", typeof MimeLogger === "function");
check("LogLevel enum", LogLevel.INFO === "info" && LogLevel.WARN === "warn" && LogLevel.ERROR === "error");
check("Formats.preset exists", typeof Formats.pretty === "function" && typeof Formats.json === "function");
check("colors.red is a function", typeof colors.red === "function");
check("getLevelString", getLevelString("info").includes("INFO"));
check("getCallerInfo returns object", typeof getCallerInfo() === "object");

const logger = new MimeLogger("smoke");
check("logger.info is a function", typeof logger.info === "function");
check("logger.child returns MimeLogger", logger.child("sub") instanceof MimeLogger);
check("logger.child name", logger.child("sub").name === "smoke/sub");

let captured = [];
const captureLogger = new MimeLogger("cap", {
  output: (msg) => captured.push(msg),
  format: "{level} {name} {message}",
});
captureLogger.info("hello %s", "world");
check("custom format output", captured.length === 1 && captured[0].includes("hello world"));

let jsonCaptured = [];
const jsonLogger = new MimeLogger("json", {
  output: (msg) => jsonCaptured.push(msg),
  format: Formats.json,
});
jsonLogger.warn("test warn");
const parsed = JSON.parse(jsonCaptured[0]);
check("Formats.json produces valid JSON", parsed.level === "warn" && parsed.message === "test warn");

await logger.promisesWrite("value: %p", LogLevel.INFO, Promise.resolve("ok"));
check("promisesWrite resolves", true);

logger.write("direct write");
check("write method executes", true);

if (failures > 0) {
  console.error(`\n${failures} ESM smoke test(s) FAILED`);
  process.exit(1);
}
console.log("ESM smoke test passed");
