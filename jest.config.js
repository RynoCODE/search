/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/.next/"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  projects: [
    {
      displayName: "lib",
      testEnvironment: "node",
      testMatch: ["<rootDir>/__tests__/lib/**/*.test.ts"],
      transform: {
        "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
      },
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
      },
    },
    {
      displayName: "components",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/__tests__/components/**/*.test.tsx"],
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
      transform: {
        // Inline tsconfig override needed: main tsconfig uses jsx: "preserve"
        // which ts-jest cannot transform; component tests require "react-jsx"
        "^.+\\.tsx?$": ["ts-jest", {
          tsconfig: {
            jsx: "react-jsx",
            esModuleInterop: true,
            module: "commonjs",
            moduleResolution: "node",
            resolveJsonModule: true,
            paths: { "@/*": ["./*"] },
          },
        }],
      },
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
      },
    },
  ],
};