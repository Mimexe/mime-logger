console.log("Running all of the examples:");
async function main() {
  console.log("Basic usage:");
  await import("./basic");

  console.log("Child loggers:");
  await import("./child-loggers");

  console.log("Promises:");
  await import("./promises");
}

main();
