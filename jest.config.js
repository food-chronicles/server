module.exports = {
  // preset: "@shelf/jest-mongodb",
  watchPathIgnorePatterns: ["globalConfig"],
  globalSetup: "<rootDir>/_test_/helpers/globalSetup.js",
  globalTeardown: "<rootDir>/node_modules/@shelf/jest-mongodb/teardown.js",
  testEnvironment: "<rootDir>/node_modules/@shelf/jest-mongodb/environment.js",
};
