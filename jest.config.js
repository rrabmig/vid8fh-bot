module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  rootDir: './',
  watch: false,

  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^src$': '<rootDir>/src',
    '^src/(.+)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['src/typings'],
  moduleFileExtensions: ['js', 'json', 'ts'],

  testRegex: '.*\\.spec\\.ts$',
  testPathIgnorePatterns: [
    '/node_modules./',
    '<rootDir>/(coverage|dist|lib|tmp)./',
  ],

  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
};
