import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "node/index": "src/node/index.ts",
    "browser/index": "src/browser/index.ts"
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  bundle: false,
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".js"
    };
  }
});
