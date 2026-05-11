import MimeLogger, { Formats, colors } from "../dist/index.mjs";

// ─── Preset: pretty (default) ────────────────────────────────────────────────
const prettyLogger = new MimeLogger("pretty", { format: Formats.pretty });
prettyLogger.info("Server started");
prettyLogger.warn("Low memory: %s MB remaining", 128);
prettyLogger.error("Connection failed");

// ─── Preset: minimal ─────────────────────────────────────────────────────────
const minimalLogger = new MimeLogger("minimal", { format: Formats.minimal });
minimalLogger.info("Server started");
minimalLogger.warn("Low memory: %s MB remaining", 128);
minimalLogger.error("Connection failed");

// ─── Preset: detailed (ISO timestamp) ────────────────────────────────────────
const detailedLogger = new MimeLogger("detailed", { format: Formats.detailed });
detailedLogger.info("Server started");
detailedLogger.warn("Low memory");
detailedLogger.error("Connection failed");

// ─── Preset: json ────────────────────────────────────────────────────────────
const jsonLogger = new MimeLogger("json", { format: Formats.json });
jsonLogger.info("Server started");
jsonLogger.warn("Low memory");

// ─── Custom format with color helpers ────────────────────────────────────────
// colors is passed as 2nd arg — no need to import ansis directly
const customLogger = new MimeLogger("app", {
  format: (obj, c) =>
    `${c.dim(obj.timestamp.toISOString())} ${c.bold(obj.level.toUpperCase())} ${c.magenta(obj.name ?? "-")}: ${obj.message}`,
});
customLogger.info("Server started");
customLogger.warn("Low memory");

// ─── String template ─────────────────────────────────────────────────────────
// Available tokens: {time} {date} {time_ms} {iso} {level} {name}
//                   {message} {pid} {env} {file} {line} {function} {caller}
// Use %s for positional args
const templateLogger = new MimeLogger("app", {
  format: `${colors.green("[{level}]")} ${colors.yellow("{name}")} — ${colors.blue("{message}")}`,
});
templateLogger.info("Server started");
templateLogger.warn("Low memory: %s MB remaining", 128);

// ─── Output: file (path tokens control rotation granularity) ─────────────────
// {date} = daily, {date}-{hour} = hourly, {date}-{hour}-{minutes} = per-minute
const fileLogger = new MimeLogger("app", {
  format: Formats.json,
  output: { type: "file", path: "logs/app-{date}.log" },
});
fileLogger.info("Server started");
fileLogger.warn("Low memory");

// ─── Output: console + file (fan-out) ────────────────────────────────────────
const dualLogger = new MimeLogger("app", {
  format: Formats.pretty,
  output: ["console", { type: "file", path: "logs/app-{date}.log" }],
});
dualLogger.info("Goes to stdout AND file");

// ─── Output: custom sink ─────────────────────────────────────────────────────
const records: string[] = [];
const memLogger = new MimeLogger("app", {
  format: Formats.json,
  output: (message) => records.push(message),
});
memLogger.info("Captured in memory");
memLogger.warn("Also captured");
console.log("Captured records:", records);

// ─── Child loggers inherit format + output ───────────────────────────────────
const parent = new MimeLogger("api", { format: Formats.minimal });
const auth = parent.child("auth");
const db = parent.child("db");
parent.info("Booting");
auth.warn("Token expiring soon");
db.error("Query failed: %s", "timeout");
