import { expect } from "chai";
import sinon from "sinon";
import { MimeLogger, LogLevel } from "../lib/index";

describe("MimeLogger Tests", function () {
  this.timeout(10000); // Set timeout to 10 seconds for async tests

  let sandbox: sinon.SinonSandbox;
  let consoleLogSpy: sinon.SinonSpy;
  let stdoutWriteSpy: sinon.SinonSpy;
  // TODO: Remove this when development mode is removed
  let emitWarningSpy: sinon.SinonSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    consoleLogSpy = sandbox.spy(console, "log");
    stdoutWriteSpy = sandbox.spy(process.stdout, "write");
    // TODO: Remove this when development mode is removed
    emitWarningSpy = sandbox.spy(process, "emitWarning");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should log info messages", () => {
    const logger = new MimeLogger("test");
    logger.info("test %s %s", "test2", "test3");

    expect(consoleLogSpy.calledWithMatch("INFO")).to.be.true;
    expect(consoleLogSpy.calledWithMatch("test test2 test3")).to.be.true;
  });

  it("should log warn messages", () => {
    const logger = new MimeLogger("test");
    logger.warn("test %s %s", "test2", "test3");

    expect(consoleLogSpy.calledWithMatch("WARN")).to.be.true;
    expect(consoleLogSpy.calledWithMatch("test test2 test3")).to.be.true;
  });

  it("should log error messages", () => {
    const logger = new MimeLogger("test");
    logger.error("test %s %s", "test2", "test3");

    expect(consoleLogSpy.calledWithMatch("ERROR")).to.be.true;
    expect(consoleLogSpy.calledWithMatch("test test2 test3")).to.be.true;
  });

  it("should handle child loggers", () => {
    const logger = new MimeLogger("test");
    const child = logger.child("child");

    child.info("test %s %s", "test2", "test3");

    expect(child.name).to.equal("test/child");
  });

  it("should handle child with parent without name", () => {
    const logger = new MimeLogger();
    const child = logger.child("child");

    child.info("test %s %s", "test2", "test3");

    expect(child.name).to.equal("child");
  });

  it("should handle logging without a name", () => {
    const logger = new MimeLogger();
    logger.info("test %s %s", "test2", "test3");

    expect(consoleLogSpy.calledWithMatch("INFO")).to.be.true;
    expect(consoleLogSpy.calledWithMatch("test2 test3")).to.be.true;
  });

  it("should throw error if %p is missing in message", async () => {
    const logger = new MimeLogger("test");

    try {
      await logger.promisesWrite(
        "Hello",
        LogLevel.INFO,
        Promise.resolve("World"),
        Promise.resolve("!")
      );
    } catch (error: any) {
      expect(error.message).to.equal("No %p in message");
    }

    expect(stdoutWriteSpy.calledWithMatch("Hello World!")).to.be.false;
  });

  it("should format message correctly", () => {
    const logger = new MimeLogger("test");

    const formattedMessage = logger.format({
      message: "test %s %s",
      name: "test",
      timestamp: new Date(),
      level: LogLevel.INFO,
      args: ["test2", "test3"],
    });

    expect(formattedMessage).to.match(/test2 test3/);
  });

  it("should write message to stdout", () => {
    const logger = new MimeLogger("test");

    logger.write("test %s %s", "test2", "test3");

    expect(stdoutWriteSpy.calledWithMatch("test test2 test3")).to.be.true;
  });

  // TODO: Remove this test when development mode is removed
  it("should handle development mode correctly", () => {
    const logger = new MimeLogger("test");

    logger.setDevelopment(true);
    expect(logger.options.debug).to.be.true;

    logger.setDevelopment(false);
    expect(logger.options.debug).to.be.false;

    // Test deprecated function
    expect(emitWarningSpy.calledOnce).to.be.true;
    const warningArgs = emitWarningSpy.getCall(0).args;
    expect(warningArgs[0]).to.include(
      "Use debug package instead, this function will be removed in the future"
    );
    expect(warningArgs[1]).to.equal("DeprecationWarning");
  });
});
