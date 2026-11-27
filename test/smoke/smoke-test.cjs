const { default: MimeLogger, LogLevel, Formats, colors, getLevelString } = require("mime-logger");

let failures = 0;
function check(name, cond) {
  if (!cond) {
    console.error(`  FAIL  ${name}`);
    failures++;
  }
}

check("default export is a constructor", typeof MimeLogger === "function");
check("LogLevel enum", LogLevel.INFO === "info" && LogLevel.WARN === "warn");
check("Formats.pretty is a function", typeof Formats.pretty === "function");
check("colors.red is a function", typeof colors.red === "function");
check("getLevelString", getLevelString("warn").includes("WARN"));

const logger = new MimeLogger("cjs-smoke");
check("logger.info is a function", typeof logger.info === "function");
check("logger.child returns MimeLogger", logger.child("sub") instanceof MimeLogger);

let captured = [];
const captureLogger = new MimeLogger("cap", {
  output: (msg) => captured.push(msg),
  format: "{level} {message}",
});
captureLogger.error("cjs error %s", "test");
check("CJS custom format", captured.length === 1 && captured[0].includes("cjs error test"));

if (failures > 0) {
  console.error(`\n${failures} CJS smoke test(s) FAILED`);
  process.exit(1);
}
console.log("CJS smoke test passed");
