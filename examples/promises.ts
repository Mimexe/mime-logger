import MimeLogger, { LogLevel } from "../dist/index.mjs";

const logger = new MimeLogger("tasks");

async function fetchUser(id: number): Promise<string> {
  await new Promise((r) => setTimeout(r, id == 2 ? 1000 : 500));
  return `user_${id}`;
}

async function main() {
  await logger.promisesWrite("Fetched user: %p", LogLevel.INFO, fetchUser(42));

  await logger.promisesWrite(
    "User %p and %p loaded",
    LogLevel.INFO,
    fetchUser(1),
    fetchUser(2),
  );
}

main();
