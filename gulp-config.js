/**
 * Contains config properties related to the gulp build steps; primarily path-related
 * globs and filesystem names
 */
module.exports = {
  filesystem: {
    dir: {
      sources: "src",
      dist: "dist",
      test: "src/test",
      publish: "publish",
      ts: "src/**/*.ts"
    },
    globs: {
      js: "src/**/*.js",
      tests: "src/**/*.spec*.js",
      json: "src/**/*.json",
      yaml: "src/**/*.yaml",
      txt: "src/**/*.txt",
      wsdl: "src/**/*.xml"
    },
    release: {
      js: "dist/**/*.js",
      tests: "dist/**/*.spec*.js",
      json: "dist/**/*.json",
      yaml: "dist/**/*.yaml",
      txt: "dist/**/*.txt",
      wsdl: "dist/**/*.xml"
    },
    files: {
      package: "package.json",
      packageLock: "package-lock.json",
      environment: ".env.example",
      logger: "logger-config.json",
      npmrc: ".npmrc",
      version: "src/versionInfo.txt"
    }
  }
};
