module.exports = {
  roots: ["<rootDir>"],
  testMatch: ["**/test/**/*_test.+(ts|tsx|js)"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },
  testEnvironment: "jest-environment-jsdom-global",
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
  moduleNameMapper: {
    "^@source/(.*)$": ["<rootDir>/src/$1"],
    "^@test/(.*)$": ["<rootDir>/test/$1"],
    "^@shared/(.*)$": ["<rootDir>/src/shared/$1"],
    "^@actions$": ["<rootDir>/src/renderer/actions"],
    "^@actions/(.*)$": ["<rootDir>/src/renderer/actions/$1"],
    "^@reducers/(.*)$": ["<rootDir>/src/renderer/actions/$1"],
    "^@libraries/(.*)$": ["<rootDir>/src/main/libraries/$1", "<rootDir>/src/renderer/libraries/$1"],
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules",
  },
};
