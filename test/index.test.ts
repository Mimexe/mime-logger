import MimeLogger, { LogLevel } from "../lib/index.js";
const logger = new MimeLogger("Test");
describe("test mime_logger", function () {
  it("test mime-logger.MimeLogger.log", function () {
    logger.log(LogLevel.INFO, "test mime-logger.MimeLogger.log");
  });
  it("test mime-logger.MimeLogger.info", function (done) {
    logger.info("test mime-logger.MimeLogger.info");
    done();
  });
});
