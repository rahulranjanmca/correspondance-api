module.exports = {
  setupFiles: ['dotenv-safe/config'],
  roots: ['<rootDir>/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/.__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx,json,node}",
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/lib/",
    "<rootDir>/src/app.module.ts",
    "<rootDir>/src/app.ts",
    "<rootDir>/src/boot.ts",
    "<rootDir>/src/index.ts",
    "<rootDir>/src/lambda.ts",
  ]
};
