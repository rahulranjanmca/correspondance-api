module.exports = {
  setupFiles: ['<rootDir>/setupTests.js'],
  roots: ['<rootDir>/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/.__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: ['src/**/*.ts', '!src/lib/**', '!src/*.ts']
};
