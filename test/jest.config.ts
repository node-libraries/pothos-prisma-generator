import type { Config } from "jest";

const config: Config = {
  resolver: "ts-jest-resolver",
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  rootDir: "./",
  roots: ["tests"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "lib",
    "generated",
    "PrismaCrudGenerator",
  ],
};

export default config;
