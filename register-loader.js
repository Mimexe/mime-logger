import { register } from "module";
import { pathToFileURL } from "url";

// Register the TypeScript loader
register("ts-node/esm", pathToFileURL("./"));
