import { defineConfig } from 'tsup';

const env = (process.env.NODE_ENV ?? 'development') as 'development' | 'production';

export default defineConfig({
  entry: ['./src/index.ts'],
  outDir: 'dist',
  clean: true,
  dts: false,
  format: ['cjs'],
  minify: env === 'production',
  treeshake: env === 'production',
  watch: env === 'development',
  sourcemap: env === 'development',
});
