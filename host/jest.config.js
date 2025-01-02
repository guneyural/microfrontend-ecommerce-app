module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^host/(.*)$": "<rootDir>/src/mocks/hostMocks.ts",
  },
  globals: {
    "ts-jest": {
      diagnostics: {
        ignoreCodes: [2322],
      },
    },
  },
};
