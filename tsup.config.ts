import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  outDir: "dist",
  sourcemap: false,
  clean: true,
  dts: false,
  format: ["cjs"],
  minify: true,
  treeshake: true,
});
