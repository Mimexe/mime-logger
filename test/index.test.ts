import assert from "assert";
import { MimeLogger, LogLevel } from "../lib/index.js";

const logger = new MimeLogger("mocha");

describe("test null", () => {
  it("name should not be null", () => {
    assert.notEqual(logger.name, null);
  });
  it("log should not be null", () => {
    assert.notEqual(logger.log, null);
  });
  it("info should not be null", () => {
    assert.notEqual(logger.info, null);
  });
  it("warn should not be null", () => {
    assert.notEqual(logger.warn, null);
  });
  it("error should not be null", () => {
    assert.notEqual(logger.error, null);
  });
  it("child should not be null", () => {
    assert.notEqual(logger.child, null);
  });
  it("format should not be null", () => {
    assert.notEqual(logger.format, null);
  });
});
describe("type test", () => {
  it("name should be a string", () => {
    assert.equal(typeof logger.name, "string");
  });
  it("log should be a function", () => {
    assert.equal(typeof logger.log, "function");
  });
  it("info should be a function", () => {
    assert.equal(typeof logger.info, "function");
  });
  it("warn should be a function", () => {
    assert.equal(typeof logger.warn, "function");
  });
  it("error should be a function", () => {
    assert.equal(typeof logger.error, "function");
  });
  it("child should be a function", () => {
    assert.equal(typeof logger.child, "function");
  });
  it("format should be a function", () => {
    assert.equal(typeof logger.format, "function");
  });
});
describe("functions test", () => {
  it("name should return 'mocha'", () => {
    assert.equal(logger.name, "mocha");
  });
  it("log should return void", () => {
    assert.equal(logger.log(LogLevel.INFO, "Hello World!"), null);
  });
  it("info should return void", () => {
    assert.equal(logger.info("Hello World!"), null);
  });
  it("warn should return void", () => {
    assert.equal(logger.warn("Hello World!"), null);
  });
  it("error should return void", () => {
    assert.equal(logger.error("Hello World!"), null);
  });
  it("child should return MimeLogger", () => {
    assert.equal(logger.child("test") instanceof MimeLogger, true);
  });
});
