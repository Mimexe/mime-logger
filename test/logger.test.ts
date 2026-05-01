/// <reference types="node" />
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { MimeLogger, LogLevel } from "../src/index.js";
import Logger from "../src/index.js";

describe("MimeLogger — core", () => {
  let logs: string[] = [];
  let spy: any;

  beforeEach(() => {
    logs = [];
    spy = vi.spyOn(console, "log").mockImplementation((msg) => logs.push(msg));
  });
  afterEach(() => spy.mockRestore());

  test("creates without name", () => {
    const logger = new MimeLogger();
    expect(logger.name).toBeUndefined();
  });

  test("creates with name", () => {
    expect(new MimeLogger("test").name).toBe("test");
  });

  test("info outputs INFO level", () => {
    new MimeLogger().info("msg");
    expect(logs[0]).toContain("INFO");
    expect(logs[0]).toContain("msg");
  });

  test("warn outputs WARN level", () => {
    new MimeLogger().warn("msg");
    expect(logs[0]).toContain("WARN");
  });

  test("error outputs ERROR level", () => {
    new MimeLogger().error("msg");
    expect(logs[0]).toContain("ERROR");
  });

  test("log() with explicit level", () => {
    new MimeLogger().log(LogLevel.WARN, "explicit", []);
    expect(logs[0]).toContain("WARN");
    expect(logs[0]).toContain("explicit");
  });

  test("name appears in output", () => {
    new MimeLogger("myapp").info("msg");
    expect(logs[0]).toContain("(myapp)");
  });

  test("empty message → no output", () => {
    new MimeLogger().log(LogLevel.INFO, "", []);
    expect(logs).toHaveLength(0);
  });

  test("output includes timestamp", () => {
    new MimeLogger().info("msg");
    expect(logs[0]).toMatch(/\[\d{1,2}:\d{2}:\d{2}( [AP]M)?\.\d+\]/);
  });

  test("%s args substituted in order", () => {
    new MimeLogger().info("Hello %s, you have %s msgs", "user", 5);
    expect(logs[0]).toContain("Hello user");
    expect(logs[0]).toContain("you have 5 msgs");
  });

  test("non-string args coerced to string", () => {
    new MimeLogger().info("val: %s", 42);
    expect(logs[0]).toContain("val: 42");
  });
});

describe("MimeLogger — child loggers", () => {
  let logs: string[] = [];
  let spy: any;

  beforeEach(() => {
    logs = [];
    spy = vi.spyOn(console, "log").mockImplementation((msg) => logs.push(msg));
  });
  afterEach(() => spy.mockRestore());

  test("child appends name", () => {
    expect(new MimeLogger("parent").child("child").name).toBe("parent/child");
  });

  test("child of unnamed logger uses child name directly", () => {
    expect(new MimeLogger().child("child").name).toBe("child");
  });

  test("deep nesting joins with /", () => {
    const logger = new MimeLogger("a").child("b").child("c");
    expect(logger.name).toBe("a/b/c");
  });

  test("child inherits format", () => {
    const parent = new MimeLogger("p", {
      format: (obj) => `${obj.level}:${obj.name}:${obj.message}`,
    });
    parent.child("c").info("msg");
    expect(logs[0]).toBe("info:p/c:msg");
  });

  test("child name appears in output", () => {
    new MimeLogger("api").child("auth").warn("token expired");
    expect(logs[0]).toContain("(api/auth)");
    expect(logs[0]).toContain("token expired");
  });
});

describe("MimeLogger — exports", () => {
  test("default export is MimeLogger", () => {
    expect(new Logger()).toBeInstanceOf(MimeLogger);
  });

  test("LogLevel.INFO is 'info'", () => {
    expect(LogLevel.INFO).toBe("info");
  });

  test("LogLevel.WARN is 'warn'", () => {
    expect(LogLevel.WARN).toBe("warn");
  });

  test("LogLevel.ERROR is 'error'", () => {
    expect(LogLevel.ERROR).toBe("error");
  });
});
