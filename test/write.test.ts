/// <reference types="node" />
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { MimeLogger, LogLevel } from "../src/index.js";

describe("write()", () => {
  let output: string[] = [];
  let spy: any;

  beforeEach(() => {
    output = [];
    spy = vi.spyOn(process.stdout, "write").mockImplementation((chunk: any) => {
      output.push(chunk.toString());
      return true;
    });
  });
  afterEach(() => spy.mockRestore());

  test("outputs to stdout", () => {
    new MimeLogger().write("hello");
    expect(output.join("")).toContain("hello");
  });

  test("includes INFO level", () => {
    new MimeLogger().write("msg");
    expect(output.join("")).toContain("INFO");
  });

  test("includes name", () => {
    new MimeLogger("svc").write("msg");
    expect(output.join("")).toContain("(svc)");
  });

  test("%s args substituted", () => {
    new MimeLogger().write("val=%s", 42);
    expect(output.join("")).toContain("val=42");
  });

  test("respects string format option", () => {
    new MimeLogger(undefined, { format: "{level}:{message}" }).write("hello");
    expect(output.join("")).toContain("info:hello");
  });

  test("respects function format option", () => {
    new MimeLogger(undefined, {
      format: (obj) => `WRITE:${obj.message}`,
    }).write("test");
    expect(output.join("")).toContain("WRITE:test");
  });
});

describe("promisesWrite()", () => {
  let output: string[] = [];
  let spy: any;

  beforeEach(() => {
    output = [];
    spy = vi.spyOn(process.stdout, "write").mockImplementation((chunk: any) => {
      output.push(chunk.toString());
      return true;
    });
  });
  afterEach(() => spy.mockRestore());

  test("single promise value written", async () => {
    await new MimeLogger().promisesWrite(
      "%p",
      LogLevel.INFO,
      Promise.resolve("result"),
    );
    expect(output.join("")).toContain("result");
  });

  test("multiple promise values written in order", async () => {
    await new MimeLogger().promisesWrite(
      "a=%p b=%p",
      LogLevel.INFO,
      Promise.resolve("X"),
      Promise.resolve("Y"),
    );
    const combined = output.join("");
    expect(combined).toContain("X");
    expect(combined).toContain("Y");
    expect(combined.indexOf("X")).toBeLessThan(combined.indexOf("Y"));
  });

  test("includes level", async () => {
    await new MimeLogger().promisesWrite(
      "%p",
      LogLevel.WARN,
      Promise.resolve("v"),
    );
    expect(output.join("")).toContain("WARN");
  });

  test("includes name", async () => {
    await new MimeLogger("tasks").promisesWrite(
      "%p",
      LogLevel.INFO,
      Promise.resolve("v"),
    );
    expect(output.join("")).toContain("(tasks)");
  });

  test("ends with newline", async () => {
    await new MimeLogger().promisesWrite(
      "%p",
      LogLevel.INFO,
      Promise.resolve("v"),
    );
    expect(output[output.length - 1]).toBe("\n");
  });

  test("no %p → throws", async () => {
    await expect(
      new MimeLogger().promisesWrite(
        "no placeholder",
        LogLevel.INFO,
        Promise.resolve("v"),
      ),
    ).rejects.toThrow("No %p in message");
  });

  test("awaits slow promise before writing next segment", async () => {
    const slow = new Promise<string>((r) => setTimeout(() => r("slow"), 50));
    const fast = Promise.resolve("fast");
    await new MimeLogger().promisesWrite(
      "%p then %p",
      LogLevel.INFO,
      slow,
      fast,
    );
    const combined = output.join("");
    expect(combined).toContain("slow");
    expect(combined.indexOf("slow")).toBeLessThan(combined.indexOf("fast"));
  });
});
