import path from "node:path";
import { createRequire } from "node:module";
import { defineConfig } from "vitest/config";

const require = createRequire(import.meta.url);

export default defineConfig({
  root: path.resolve(import.meta.dirname, ".."),
  resolve: {
    alias: {
      graphql: require.resolve("graphql"),
      "pothos-prisma-generator": path.resolve(
        import.meta.dirname,
        "../pothos-prisma-generator/src/index.ts"
      ),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["test/tests/**/*.spec.ts"],
    testTimeout: 20000,
    hookTimeout: 20000,
    coverage: {
      provider: "v8",
      reportsDirectory: "./test/coverage",
      include: ["pothos-prisma-generator/src/**"],
      exclude: ["**/PrismaCrudGenerator.ts"],
    },
  },
});

