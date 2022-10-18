import type { Config } from "@jest/types";

const defaultConfig: Config.InitialOptions = {
  collectCoverage: true,
  coverageDirectory: "../coverage",
  coveragePathIgnorePatterns: ["node_modules", "__test__", ".mock.ts"],
  preset: "ts-jest",
  verbose: true,
};

export default function createJestConfig(
  config: Config.InitialOptions & Required<Pick<Config.InitialOptions, "rootDir">>
) {
  return { ...defaultConfig, ...config };
}
