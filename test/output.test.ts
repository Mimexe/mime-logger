/// <reference types="node" />
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { MimeLogger, Formats } from "../src/index.js";

const mockWrite = vi.fn();
vi.mock("fs", () => ({
  existsSync: vi.fn().mockReturnValue(false),
  mkdirSync: vi.fn(),
  createWriteStream: vi.fn(() => ({ write: mockWrite, end: vi.fn() })),
}));

import { createWriteStream, mkdirSync } from "fs";
import { _clearCaches } from "../src/output.js";

describe("output: console (default)", () => {
  let logs: string[] = [];
  let spy: any;

  beforeEach(() => {
    logs = [];
    spy = vi.spyOn(console, "log").mockImplementation((msg) => logs.push(msg));
  });
  afterEach(() => spy.mockRestore());

  test("logs go to console.log by default", () => {
    new MimeLogger().info("hello");
    expect(logs).toHaveLength(1);
    expect(logs[0]).toContain("hello");
  });

  test("explicit console target same as default", () => {
    new MimeLogger(undefined, { output: "console" }).info("hello");
    expect(logs).toHaveLength(1);
  });
});

describe("output: custom fn", () => {
  test("custom fn receives formatted message", () => {
    const received: string[] = [];
    new MimeLogger(undefined, {
      format: Formats.json,
      output: (msg) => received.push(msg),
    }).info("hello");

    expect(received).toHaveLength(1);
    expect(JSON.parse(received[0]).message).toBe("hello");
  });

  test("custom fn receives FormatObject as 2nd arg", () => {
    let capturedObj: any;
    new MimeLogger("svc", {
      output: (_msg, obj) => {
        capturedObj = obj;
      },
    }).warn("test");

    expect(capturedObj.level).toBe("warn");
    expect(capturedObj.name).toBe("svc");
    expect(capturedObj.message).toBe("test");
  });

  test("multiple calls all reach fn", () => {
    const received: string[] = [];
    const logger = new MimeLogger(undefined, {
      format: (obj) => obj.message,
      output: (msg) => received.push(msg),
    });
    logger.info("a");
    logger.warn("b");
    logger.error("c");
    expect(received).toEqual(["a", "b", "c"]);
  });
});

describe("output: fan-out array", () => {
  let logs: string[] = [];
  let spy: any;

  beforeEach(() => {
    logs = [];
    spy = vi.spyOn(console, "log").mockImplementation((msg) => logs.push(msg));
  });
  afterEach(() => spy.mockRestore());

  test("message reaches all targets", () => {
    const custom: string[] = [];
    new MimeLogger(undefined, {
      format: (obj) => obj.message,
      output: ["console", (msg) => custom.push(msg)],
    }).info("hello");

    expect(logs[0]).toBe("hello");
    expect(custom[0]).toBe("hello");
  });

  test("three targets all called", () => {
    const a: string[] = [],
      b: string[] = [];
    new MimeLogger(undefined, {
      format: (obj) => obj.message,
      output: [(msg) => a.push(msg), (msg) => b.push(msg), "console"],
    }).info("msg");

    expect(a).toHaveLength(1);
    expect(b).toHaveLength(1);
    expect(logs).toHaveLength(1);
  });
});

describe("output: file", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _clearCaches();
  });

  test("stream opened with append flag", () => {
    new MimeLogger(undefined, {
      output: { type: "file", path: "logs/test.log" },
    }).info("msg");

    expect(createWriteStream).toHaveBeenCalledWith("logs/test.log", {
      flags: "a",
      encoding: "utf8",
    });
  });

  test("stream write called with message + newline", () => {
    new MimeLogger(undefined, {
      format: (obj) => obj.message,
      output: { type: "file", path: "logs/test.log" },
    }).info("written");

    expect(mockWrite).toHaveBeenCalledWith("written\n");
  });

  test("stream reused across writes (createWriteStream called once)", () => {
    const logger = new MimeLogger(undefined, {
      output: { type: "file", path: "logs/reuse.log" },
    });
    logger.info("a");
    logger.info("b");
    logger.info("c");

    expect(createWriteStream).toHaveBeenCalledTimes(1);
    expect(mockWrite).toHaveBeenCalledTimes(3);
  });

  test("ANSI codes stripped before writing", () => {
    new MimeLogger(undefined, {
      format: (_obj, c) => c.red("error") + " plain",
      output: { type: "file", path: "logs/ansi.log" },
    }).info("msg");

    const written: string = mockWrite.mock.calls[0][0];
    expect(written).not.toMatch(/\x1b\[/);
    expect(written).toContain("error plain");
  });

  test("mkdirSync called for directory", () => {
    new MimeLogger(undefined, {
      output: { type: "file", path: "logs/sub/test.log" },
    }).info("msg");

    expect(mkdirSync).toHaveBeenCalledWith("logs/sub", { recursive: true });
  });

  test("mkdirSync not called again for same dir", () => {
    const logger = new MimeLogger(undefined, {
      output: { type: "file", path: "logs/cached/app.log" },
    });
    logger.info("a");
    logger.info("b");

    expect(mkdirSync).toHaveBeenCalledTimes(1);
  });

  test("{date} token resolved in path", () => {
    new MimeLogger(undefined, {
      output: { type: "file", path: "logs/{date}.log" },
    }).info("msg");

    const path: string = (createWriteStream as any).mock.calls[0][0];
    expect(path).toMatch(/logs\/\d{4}-\d{2}-\d{2}\.log/);
  });

  test("{hour} token resolved to 2-digit hour", () => {
    new MimeLogger(undefined, {
      output: { type: "file", path: "logs/{hour}.log" },
    }).info("msg");

    const path: string = (createWriteStream as any).mock.calls[0][0];
    expect(path).toMatch(/logs\/\d{2}\.log/);
  });

  test("{year}-{month}-{day} tokens all resolved", () => {
    new MimeLogger(undefined, {
      output: { type: "file", path: "logs/{year}/{month}/{day}.log" },
    }).info("msg");

    const path: string = (createWriteStream as any).mock.calls[0][0];
    expect(path).toMatch(/logs\/\d{4}\/\d{2}\/\d{2}\.log/);
  });

  test("{date} consistent with {year}-{month}-{day}", () => {
    new MimeLogger(undefined, {
      output: { type: "file", path: "a/{date}.log" },
    }).info("msg");
    new MimeLogger(undefined, {
      output: { type: "file", path: "b/{year}-{month}-{day}.log" },
    }).info("msg");

    const paths = (createWriteStream as any).mock.calls.map(
      (c: any[]) => c[0] as string,
    );
    const datePart = paths[0].replace("a/", "").replace(".log", "");
    const ymdPart = paths[1].replace("b/", "").replace(".log", "");
    expect(datePart).toBe(ymdPart);
  });

  test("static path (no tokens) used as-is", () => {
    new MimeLogger(undefined, {
      output: { type: "file", path: "logs/app.log" },
    }).info("msg");

    expect(createWriteStream).toHaveBeenCalledWith(
      "logs/app.log",
      expect.any(Object),
    );
  });
});

describe("output: child inheritance", () => {
  test("child uses parent output target", () => {
    const received: string[] = [];
    const parent = new MimeLogger("parent", {
      format: (obj) => obj.name ?? "",
      output: (msg) => received.push(msg),
    });
    parent.child("child").info("msg");
    expect(received[0]).toBe("parent/child");
  });
});
