import type { Config } from "jest";

const config: Config = {
  resolver: "ts-jest-resolver",
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "..",
  moduleNameMapper: {},
  roots: ["test/tests"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  collectCoverageFrom: ["pothos-prisma-generator/src/**/*.ts"],
  coveragePathIgnorePatterns: ["PrismaCrudGenerator"],
};

export default config;
