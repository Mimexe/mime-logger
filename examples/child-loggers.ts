import MimeLogger from "../dist/index.mjs";

const logger = new MimeLogger("app");

const db = logger.child("db");
const api = logger.child("api");
const auth = api.child("auth");

logger.info("Application booting");
db.info("Connected to database");
api.info("Listening on port 3000");
auth.warn("Token expiring soon");
auth.error("Invalid credentials");
