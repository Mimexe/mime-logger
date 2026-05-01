/// <reference types="node" />
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { MimeLogger, Formats } from "../src/index.js";

describe("Formats.pretty", () => {
  let logs: string[] = [];
  let spy: any;

  beforeEach(() => {
    logs = [];
    spy = vi.spyOn(console, "log").mockImplementation((msg) => logs.push(msg));
  });
  afterEach(() => spy.mockRestore());

  test("contains level", () => {
    new MimeLogger("app", { format: Formats.pretty }).info("msg");
    expect(logs[0]).toContain("INFO");
  });

  test("contains message", () => {
    new MimeLogger(undefined, { format: Formats.pretty }).info("hello world");
    expect(logs[0]).toContain("hello world");
  });

  test("contains name in parens", () => {
    new MimeLogger("svc", { format: Formats.pretty }).warn("oops");
    expect(logs[0]).toContain("(svc)");
  });

  test("contains timestamp", () => {
    new MimeLogger(undefined, { format: Formats.pretty }).info("msg");
    expect(logs[0]).toMatch(/\d{1,2}:\d{2}:\d{2}/);
  });

  test("substitutes %s args", () => {
    new MimeLogger(undefined, { format: Formats.pretty }).info("val %s", 99);
    expect(logs[0]).toContain("val 99");
  });
});

describe("Formats.minimal", () => {
  let logs: string[] = [];
  let spy: any;

  beforeEach(() => {
    logs = [];
    spy = vi.spyOn(console, "log").mockImplementation((msg) => logs.push(msg));
  });
  afterEach(() => spy.mockRestore());

  test("contains level (uppercase)", () => {
    new MimeLogger(undefined, { format: Formats.minimal }).info("msg");
    expect(logs[0]).toContain("INFO");
  });

  test("contains message", () => {
    new MimeLogger(undefined, { format: Formats.minimal }).warn("watch out");
    expect(logs[0]).toContain("watch out");
  });

  test("contains name", () => {
    new MimeLogger("api", { format: Formats.minimal }).error("fail");
    expect(logs[0]).toContain("api");
  });

  test("no ISO timestamp", () => {
    new MimeLogger(undefined, { format: Formats.minimal }).info("msg");
    expect(logs[0]).not.toMatch(/\d{4}-\d{2}-\d{2}T/);
  });

  test("substitutes %s args", () => {
    new MimeLogger(undefined, { format: Formats.minimal }).info("x=%s", "foo");
    expect(logs[0]).toContain("x=foo");
  });
});

describe("Formats.detailed", () => {
  let logs: string[] = [];
  let spy: any;

  beforeEach(() => {
    logs = [];
    spy = vi.spyOn(console, "log").mockImplementation((msg) => logs.push(msg));
  });
  afterEach(() => spy.mockRestore());

  test("contains ISO timestamp", () => {
    new MimeLogger(undefined, { format: Formats.detailed }).info("msg");
    expect(logs[0]).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test("contains level", () => {
    new MimeLogger(undefined, { format: Formats.detailed }).warn("msg");
    expect(logs[0]).toContain("WARN");
  });

  test("contains name", () => {
    new MimeLogger("db", { format: Formats.detailed }).error("msg");
    expect(logs[0]).toContain("(db)");
  });
});

describe("Formats.json", () => {
  let logs: string[] = [];
  let spy: any;

  beforeEach(() => {
    logs = [];
    spy = vi.spyOn(console, "log").mockImplementation((msg) => logs.push(msg));
  });
  afterEach(() => spy.mockRestore());

  test("output is valid JSON", () => {
    new MimeLogger(undefined, { format: Formats.json }).info("msg");
    expect(() => JSON.parse(logs[0])).not.toThrow();
  });

  test("contains level field", () => {
    new MimeLogger(undefined, { format: Formats.json }).warn("msg");
    expect(JSON.parse(logs[0]).level).toBe("warn");
  });

  test("contains message field", () => {
    new MimeLogger(undefined, { format: Formats.json }).info("hello");
    expect(JSON.parse(logs[0]).message).toBe("hello");
  });

  test("contains ISO timestamp field", () => {
    new MimeLogger(undefined, { format: Formats.json }).info("msg");
    const ts = JSON.parse(logs[0]).timestamp;
    expect(ts).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });

  test("name field is null when unnamed", () => {
    new MimeLogger(undefined, { format: Formats.json }).info("msg");
    expect(JSON.parse(logs[0]).name).toBeNull();
  });

  test("name field present when named", () => {
    new MimeLogger("svc", { format: Formats.json }).info("msg");
    expect(JSON.parse(logs[0]).name).toBe("svc");
  });

  test("%s substituted in message field", () => {
    new MimeLogger(undefined, { format: Formats.json }).info("val=%s", 7);
    expect(JSON.parse(logs[0]).message).toBe("val=7");
  });
});

describe("custom FormatFn with colors", () => {
  let logs: string[] = [];
  let spy: any;

  beforeEach(() => {
    logs = [];
    spy = vi.spyOn(console, "log").mockImplementation((msg) => logs.push(msg));
  });
  afterEach(() => spy.mockRestore());

  test("receives colors as 2nd arg", () => {
    let receivedColors: any;
    const format = (_obj: any, c: any) => {
      receivedColors = c;
      return "ok";
    };
    new MimeLogger(undefined, { format }).info("msg");
    expect(typeof receivedColors.red).toBe("function");
    expect(typeof receivedColors.bold).toBe("function");
    expect(typeof receivedColors.dim).toBe("function");
  });

  test("1-arg format fn still works (backward compat)", () => {
    const logger = new MimeLogger("app", {
      format: (obj) => `${obj.level}|${obj.name}|${obj.message}`,
    });
    logger.info("hello");
    expect(logs[0]).toBe("info|app|hello");
  });

  test("format fn receives correct FormatObject fields", () => {
    let captured: any;
    new MimeLogger("svc", {
      format: (obj) => { captured = obj; return ""; },
    }).warn("test msg");
    expect(captured.level).toBe("warn");
    expect(captured.name).toBe("svc");
    expect(captured.message).toBe("test msg");
    expect(captured.timestamp).toBeInstanceOf(Date);
  });
});
