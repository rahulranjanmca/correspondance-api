const gulp = require(`gulp`);
const ts = require(`gulp-typescript`);
const eslint = require(`gulp-eslint`);
const debug = require(`gulp-debug`);
const size = require(`gulp-size`);
const tsProject = ts.createProject(`tsconfig.json`);
const gulpInstall = require(`gulp-install`);
const gulpClean = require(`gulp-clean`);
const run = require("gulp-run");
const gulpReplace = require("gulp-replace");
const moment = require("moment-timezone");

// const packageJSON = require('./package.json');
const gConfig = require("./gulp-config");
const paths = gConfig.filesystem;
const distDir = paths.dir.dist;
const publishDir = paths.dir.publish;

const nodeMod = "node_modules";
const dirTypes = "./src/**/*.ts";

//Clean the distribution folder
function cleanDist() {
  return gulp.src(distDir, { read: false, allowEmpty: true }).pipe(gulpClean());
}

// Clean and rebase node modules folder
function cleanModules() {
  return gulp.src(nodeMod, { read: false, allowEmpty: true }).pipe(gulpClean());
}

// Clean the app compile folder
function cleanBuild() {
  return gulp
    .src(publishDir, { read: false, allowEmpty: true })
    .pipe(gulpClean());
}

function _getDateTimeCST() {
  return moment(Date.now())
    .tz("America/Chicago")
    .format("YYYY-MM-DD");
}

function versioning() {
  return gulp
    .src(paths.files.version)
    .pipe(gulpReplace("$version", _getDateTimeCST()))
    .pipe(gulp.dest(distDir));
}

// Enable source maps for troubleshooting
function useSourceMaps(done) {
  useSourceMaps = true;
  done();
}

// Fail build on compile error
function failOnTypeScriptError(done) {
  tsExitOnCompileError = true;
  done();
}

// Copy any assets you need into the library
function copyassets() {
  return gulp
    .src([
      paths.globs.yaml,
      paths.files.package,
      paths.files.logger,
      paths.files.environment,
      paths.globs.wsdl,
      paths.files.npmrc
    ])
    .pipe(gulp.dest(distDir));
}

/**
 * lint the .ts files in release pipeline.
 */
function lint() {
  return gulp
    .src([paths.dir.ts])
    .pipe(eslint())
    .pipe(debug({ title: "Linting" }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// Compile the typescript to tsconfig.json standard
function compile(done) {
  const tsResult = gulp
    .src([paths.dir.ts])
    .pipe(tsProject())
    .on("error", err => {
      throw err;
    });
  return tsResult.js
    .pipe(debug({ title: "ts" }))
    .pipe(gulp.dest(distDir))
    .pipe(size({ title: "compile" }))
    .resume()
    .on("end", done);
}

// Compile the typescript to tsconfig.json standard
function compileBuild(done) {
  const tsResult = gulp
    .src([paths.dir.ts])
    .pipe(tsProject())
    .on("error", err => {
      throw err;
    });
  return tsResult.js
    .pipe(debug({ title: "ts" }))
    .pipe(gulp.dest(publishDir))
    .pipe(size({ title: "compile" }))
    .resume()
    .on("end", done);
}

// Install production node_modules to dist
function install() {
  return gulp
    .src("./package.json")
    .pipe(gulp.dest(distDir))
    .pipe(gulpInstall({ production: true, noOptional: true }));
}

// Run npm pack to package the project into a library
function package(done) {
  run("npm run gulp-pack").exec();
  done();
}

// All your base are belong to us
gulp.task("purge", gulp.series(cleanModules));
// All your base are belong to us
gulp.task("version", gulp.series(versioning));
// Gulp task to clean the base folders
gulp.task("cleanBase", gulp.series(cleanBuild, cleanDist, cleanModules));
// Gulp task to clean the base folders
gulp.task("install", gulp.series(install));
// Gulp task to clean the base folders
gulp.task("preCommit", gulp.series(cleanBuild, lint, compileBuild, cleanBuild));

gulp.task("clean", gulp.series(cleanDist));
gulp.task("clean-mod", gulp.series(cleanModules));

// gulp.task('build', gulp.series(gulp.parallel(cleanDist, lint), run('tsc'), run('npm pack')));

/**
 * This is the primary task to build the project to release.
 */
gulp.task(
  "build",
  gulp.series(
    gulp.parallel(cleanBuild, cleanDist, useSourceMaps, failOnTypeScriptError),
    compile,
    versioning,
    copyassets,
    install
  )
);
