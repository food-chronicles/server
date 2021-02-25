module.exports = {
  // preset: "@shelf/jest-mongodb",
  watchPathIgnorePatterns: ["globalConfig"],
  globalSetup: "<rootDir>/__test__/helpers/globalSetup.js",
  globalTeardown: "<rootDir>/node_modules/@shelf/jest-mongodb/teardown.js",
  testEnvironment: "<rootDir>/node_modules/@shelf/jest-mongodb/environment.js",
};
