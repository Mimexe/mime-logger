console.clear();
import Logger, { LogLevel } from "./index.js";
function seperator(text) {
    console.log(`\n${"=".repeat(text.length)}\n${text}\n${"=".repeat(text.length)}\n`);
}
async function pause() {
    return new Promise((resolve) => {
        process.stdin.once("data", () => {
            resolve();
            process.stdin.pause();
        });
        process.stdout.write("\nPress enter to continue...");
        process.stdin.resume();
    });
}
seperator("Tests");
const logger = new Logger("test");
seperator("Base");
logger.info("test %s %s normally normal -> %s", "test2", "test3");
logger.warn("test %s %s normally normal -> %s", "test2", "test3");
logger.error("test %s %s normally normal -> %s", "test2", "test3");
seperator("Development debug log");
console.log("development false");
logger.setDevelopment(false);
logger.debug("test %s %s normally normal -> %s", "test2", "test3");
console.log("development true");
logger.setDevelopment(true);
logger.debug("test %s %s normally normal -> %s", "test2", "test3");
seperator("Childrens");
const child = logger.child("child");
child.info("test %s %s normally normal -> %s", "test2", "test3");
child.warn("test %s %s normally normal -> %s", "test2", "test3");
child.error("test %s %s normally normal -> %s", "test2", "test3");
seperator("Childrens > Development debug log");
console.log("development false");
child.setDevelopment(false);
child.debug("test %s %s normally normal -> %s", "test2", "test3");
console.log("development true");
child.setDevelopment(true);
child.debug("test %s %s normally normal -> %s", "test2", "test3");
seperator("Without name");
const nonames = new Logger();
nonames.info("test %s %s normally normal -> %s", "test2", "test3");
nonames.warn("test %s %s normally normal -> %s", "test2", "test3");
nonames.error("test %s %s normally normal -> %s", "test2", "test3");
seperator("Without name > Development debug log");
console.log("development false");
nonames.setDevelopment(false);
nonames.debug("test %s %s normally normal -> %s", "test2", "test3");
console.log("development true");
nonames.setDevelopment(true);
nonames.debug("test %s %s normally normal -> %s", "test2", "test3");
seperator("Without name > Childrens");
const nonameschild = nonames.child("child");
nonameschild.info("test %s %s normally normal -> %s", "test2", "test3");
nonameschild.warn("test %s %s normally normal -> %s", "test2", "test3");
nonameschild.error("test %s %s normally normal -> %s", "test2", "test3");
seperator("Without name > Childrens > Development debug log");
console.log("development false");
nonameschild.setDevelopment(false);
nonameschild.debug("test %s %s normally normal -> %s", "test2", "test3");
console.log("development true");
nonameschild.setDevelopment(true);
nonameschild.debug("test %s %s normally normal -> %s", "test2", "test3");
await pause();
seperator("Write");
logger.write("test %s %s normally normal -> %s", "test2", "test3");
logger.write("->> hello %s", "world");
await pause();
seperator("Promises log | No %p");
await logger
    .promisesWrite("Hello", LogLevel.INFO, new Promise((resolve) => {
    setTimeout(() => {
        resolve("World");
    }, 3000);
}), new Promise((resolve) => {
    setTimeout(() => {
        resolve("World!");
    }, 4000);
}))
    .catch((err) => {
    if (err.message != "No %p in message") {
        throw err;
    }
    else {
        process.stdout.write("[Test] Error catched, test passed\n");
    }
});
seperator("Promises log | With %p");
await logger.promisesWrite("Hello %p%p", LogLevel.INFO, new Promise((resolve) => {
    setTimeout(() => {
        resolve("World");
    }, 3000);
}), new Promise((resolve) => {
    setTimeout(() => {
        resolve("!");
    }, 4000);
}));
process.stdin.once("data", (d) => {
    process.stdin.pause();
    process.exit(d.toString().trim() == "y" ? 0 : 1);
});
process.stdout.write("\nTesting successful ? (y/n) ");
process.stdin.resume();
