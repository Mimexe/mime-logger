import { describe, test, expect, beforeEach, afterEach, spyOn } from "bun:test";
import { MimeLogger, LogLevel } from "../src/index.js";
import Logger from "../src/index.js";

describe("MimeLogger", () => {
  let consoleLogSpy: any;
  let capturedLogs: any[][] = [];

  beforeEach(() => {
    capturedLogs = [];
    consoleLogSpy = spyOn(console, "log").mockImplementation((...args: any[]) => {
      capturedLogs.push(args);
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test("creates logger instance without name", () => {
    const logger = new MimeLogger();
    expect(logger).toBeDefined();
    expect(logger.name).toBeUndefined();
  });

  test("creates logger instance with name", () => {
    const logger = new MimeLogger("test");
    expect(logger).toBeDefined();
    expect(logger.name).toBe("test");
  });

  test("info logs message with INFO level", () => {
    const logger = new MimeLogger("test");
    logger.info("test message");
    
    expect(capturedLogs.length).toBeGreaterThan(0);
    const output = capturedLogs[0][0];
    expect(output).toContain("INFO");
    expect(output).toContain("test message");
    expect(output).toContain("(test)");
  });

  test("warn logs message with WARN level", () => {
    const logger = new MimeLogger();
    logger.warn("warning message");
    
    expect(capturedLogs.length).toBeGreaterThan(0);
    const output = capturedLogs[0][0];
    expect(output).toContain("WARN");
    expect(output).toContain("warning message");
  });

  test("error logs message with ERROR level", () => {
    const logger = new MimeLogger();
    logger.error("error message");

    expect(capturedLogs.length).toBeGreaterThan(0);
    const output = capturedLogs[0][0];
    expect(output).toContain("ERROR");
    expect(output).toContain("error message");
  });

  test("child logger creates namespaced logger", () => {
    const parent = new MimeLogger("parent", { debug: true });
    const child = parent.child("child");
    
    expect(child.name).toBe("parent/child");
  });

  test("log with arguments replaces %s placeholders", () => {
    const logger = new MimeLogger();
    logger.info("Hello %s, you have %s messages", "user", "5");
    
    const output = capturedLogs[0][0];
    expect(output).toContain("Hello user");
    expect(output).toContain("you have 5 messages");
  });

  test("does not log when message is empty", () => {
    const logger = new MimeLogger();
    logger.log(LogLevel.INFO, "", []);
    
    expect(capturedLogs.length).toBe(0);
  });

  test("format includes timestamp", () => {
    const logger = new MimeLogger();
    logger.info("timestamp test");

    const output = capturedLogs[0][0];
    // Should contain time format like [HH:MM:SS.mmm] or [HH:MM:SS AM/PM.mmm]
    expect(output).toMatch(/\[\d{1,2}:\d{2}:\d{2}( [AP]M)?\.\d+\]/);
  });

  test("LogLevel enum exports expected values", () => {
    expect(LogLevel.INFO).toBe(LogLevel.INFO);
    expect(LogLevel.WARN).toBe(LogLevel.WARN);
    expect(LogLevel.ERROR).toBe(LogLevel.ERROR);
    expect(LogLevel.DEBUG).toBe(LogLevel.DEBUG);
  });

  test("default import works", () => {
    const logger = new Logger();
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(MimeLogger);
  });

  test("default import with name works", () => {
    const logger = new Logger("app");
    logger.info("default import test");
    
    expect(capturedLogs.length).toBeGreaterThan(0);
    const output = capturedLogs[0][0];
    expect(output).toContain("INFO");
    expect(output).toContain("(app)");
    expect(output).toContain("default import test");
  });
});

describe("MimeLogger with process.stdout.write", () => {
  let originalStdoutWrite: typeof process.stdout.write;
  let capturedOutput: string[] = [];

  beforeEach(() => {
    capturedOutput = [];
    originalStdoutWrite = process.stdout.write;
    process.stdout.write = (chunk: any): boolean => {
      capturedOutput.push(chunk.toString());
      return true;
    };
  });

  afterEach(() => {
    process.stdout.write = originalStdoutWrite;
  });

  test("write outputs formatted message", () => {
    const logger = new MimeLogger("writer");
    logger.write("writing test");
    
    const output = capturedOutput.join("");
    expect(output).toContain("INFO");
    expect(output).toContain("writing test");
    expect(output).toContain("(writer)");
  });

  test("promisesWrite handles async promises", async () => {
    const logger = new MimeLogger();
    const promise1 = Promise.resolve("value1");
    const promise2 = Promise.resolve("value2");
    
    await logger.promisesWrite("First %p, second %p", LogLevel.INFO, promise1, promise2);
    
    const output = capturedOutput.join("");
    expect(output).toContain("value1");
    expect(output).toContain("value2");
  });

  test("promisesWrite throws when no %p placeholder", async () => {
    const logger = new MimeLogger();
    const promise = Promise.resolve("value");
    
    await expect(
      logger.promisesWrite("No placeholder", LogLevel.INFO, promise)
    ).rejects.toThrow("No %p in message");
  });
});

