import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  platform: "node",
  target: "node16",
  dts: true,
  outDir: "dist",
  clean: true,
  outputOptions: {
    exports: "named",
  },
});
