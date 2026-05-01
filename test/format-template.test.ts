/// <reference types="node" />
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { MimeLogger } from "../src/index.js";

function makeLogger(format: string, name?: string) {
  return new MimeLogger(name, { format });
}

describe("string template — tokens", () => {
  let logs: string[] = [];
  let spy: any;

  beforeEach(() => {
    logs = [];
    spy = vi.spyOn(console, "log").mockImplementation((msg) => logs.push(msg));
  });
  afterEach(() => spy.mockRestore());

  test("{level} → raw level value", () => {
    makeLogger("{level}").warn("msg");
    expect(logs[0]).toBe("warn");
  });

  test("{name} → logger name", () => {
    makeLogger("{name}", "myapp").info("msg");
    expect(logs[0]).toBe("myapp");
  });

  test("{name} → empty string when no name", () => {
    makeLogger("[{name}]").info("msg");
    expect(logs[0]).toBe("[]");
  });

  test("{message} → message content", () => {
    makeLogger("{message}").info("hello world");
    expect(logs[0]).toBe("hello world");
  });

  test("{iso} → valid ISO 8601 string", () => {
    makeLogger("{iso}").info("msg");
    expect(logs[0]).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  test("{time} → local time with ms", () => {
    makeLogger("{time}").info("msg");
    expect(logs[0]).toMatch(/\[\d{1,2}:\d{2}:\d{2}( [AP]M)?\.\d+\]/);
  });

  test("{date} → local date string", () => {
    makeLogger("{date}").info("msg");
    expect(logs[0].length).toBeGreaterThan(0);
    expect(logs[0]).not.toContain("{date}");
  });

  test("{pid} → current process PID", () => {
    makeLogger("{pid}").info("msg");
    expect(logs[0]).toBe(String(process.pid));
  });

  test("{env} → NODE_ENV or 'production'", () => {
    makeLogger("{env}").info("msg");
    expect(logs[0]).toBe(process.env.NODE_ENV ?? "production");
  });

  test("{time_ms} → milliseconds component", () => {
    makeLogger("{time_ms}").info("msg");
    expect(Number(logs[0])).toBeGreaterThanOrEqual(0);
    expect(Number(logs[0])).toBeLessThan(1000);
  });

  test("multiple tokens in one template", () => {
    makeLogger("{level} {name}: {message}", "svc").error("oops");
    expect(logs[0]).toBe("error svc: oops");
  });

  test("repeated token replaced everywhere", () => {
    makeLogger("{level} ({level})", "svc").info("msg");
    expect(logs[0]).toBe("info (info)");
  });

  test("unknown token left as-is", () => {
    makeLogger("{unknown}").info("msg");
    expect(logs[0]).toBe("{unknown}");
  });
});

describe("string template — %s substitution", () => {
  let logs: string[] = [];
  let spy: any;

  beforeEach(() => {
    logs = [];
    spy = vi.spyOn(console, "log").mockImplementation((msg) => logs.push(msg));
  });
  afterEach(() => spy.mockRestore());

  test("single %s replaced", () => {
    makeLogger("{message}").info("val=%s", "hello");
    expect(logs[0]).toBe("val=hello");
  });

  test("multiple %s replaced in order", () => {
    makeLogger("{message}").info("%s and %s", "a", "b");
    expect(logs[0]).toBe("a and b");
  });

  test("numeric arg coerced to string", () => {
    makeLogger("{message}").info("n=%s", 42);
    expect(logs[0]).toBe("n=42");
  });

  test("extra args beyond %s count ignored", () => {
    makeLogger("{message}").info("one=%s", "x", "ignored");
    expect(logs[0]).toBe("one=x");
  });
});
