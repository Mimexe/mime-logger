import MimeLogger from "../dist/index.mjs";

const logger = new MimeLogger();

logger.info("Server started");
logger.warn("Low memory: %s MB remaining", 128);
logger.error("Connection failed");
