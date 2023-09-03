import type { Config } from "jest";

const config: Config = {
  resolver: "ts-jest-resolver",
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  rootDir: "test/tests",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  coveragePathIgnorePatterns: [
    "./src/backend/libs",
    "./src/backend/test-tools",
    "./src/generated",
    "/node_modules/",
  ],
};

export default config;
