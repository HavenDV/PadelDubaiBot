module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/**/*.d.ts",
    "!src/app/globals.css",
    "!src/app/layout.tsx",
    "!src/app/page.tsx",
  ],
  coverageReporters: ["text", "lcov", "html"],
  coverageDirectory: "coverage",
};
