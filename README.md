<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc)_

- [wm-starter-node-api](#wm-starter-node-api)
  - [installation/usage](#installationusage)
    - [notes](#notes)
      - [native packages](#native-packages)
      - [integration/e2e tests](#integratione2e-tests)
  - [package.json](#packagejson)
    - [element ordering](#element-ordering)
    - [run scripts](#run-scripts)
    - [notes](#notes-1)
  - [index.js](#indexjs)
  - [directory structure and file placement](#directory-structure-and-file-placement)
    - [wm standards - Node API directory/file layout standards](#wm-standards---node-api-directoryfile-layout-standards)
  - [testing practices](#testing-practices)
    - [this project's testing setup](#this-projects-testing-setup)
    - [test code coverage](#test-code-coverage)
  - [openapi](#openapi)
    - [code structure](#code-structure)
    - [adding an endpoint](#adding-an-endpoint)
  - [misc](#misc)
    - [license string](#license-string)
    - [js file naming](#js-file-naming)
    - [linting](#linting)
    - [dotfiles and root configs](#dotfiles-and-root-configs)
    - [versioning](#versioning)
    - [README file standards](#readme-file-standards)
    - [enumerations](#enumerations)
    - [lolex and testing date-dependent logic](#lolex-and-testing-date-dependent-logic)
    - [mongodb connector](#mongodb-connector)
    - [internal class validation with json schema](#internal-class-validation-with-json-schema)
    - [\_ for private methods](#for-private-methods)
    - [profiling](#profiling)
  - [dependencies](#dependencies)
  - [dev dependencies](#dev-dependencies)
  - [License](#license)
    - [Installation & Config](#installation--config)
    - [Local development](#local-development)
    - [Unit Test](#unit-test)
    - [jwt usage](#jwt-usage)
    - [Verification](#verification)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# wm-starter-node-api

Provides a possible starting point for WM Node API projects; "possible" in the sense that this project provides some base groundwork up-front configuration but also includes some concrete examples of other useful patterns and practices (enumerations, mongo connections, common utilities, testing conventions/setup _etc._) and additional contrived code which uses the baseline patterns.

Its intended use is as a base you can strip things out of to arrive at a starting point for your project _or_ to refer to as examples. The things which are intended to be deleted in your project (_e.g._ the 'people loading' controller) should be obvious.

This is not intended to be static nor is it indended to be considered the "only" way to accomplish certain things. As Wellmark matures its Node practices, some of these may in fact be codified but right now the main intent is to provide examples and conventions; we'll iterate over the issues as they arise.

ES6 syntax is used throughout the codebase including string template literals, arrow functions, let/const. It also features ES2016 async/await utilization as an alternative to Promises and generators (which were an alternative to callbacks). Some of the syntax usages work OOTB on Node >=6.10 (_e.g._ let, const) but others (_e.g._ async/await) do not; async/await is natively supported in Node >= 7.6.0. If you need to run on Node 6.x, async/await cannot be used. Note the `engines` tag in `package.json` specifies a Node 8 runtime or greater.

The remainder of this README will provide details on how things are structured within the codebase. What's not documented in this file should (hopefully) documented in the source code (jsdoc).

## installation/usage

- Check out from git
- Disconnect from git (delete .git folder)
- Rename top-level folder
- Change package.json to reflect name of api (and other details in package file)
- Change `APP_NAME` constant (in `src/constants.js`) to reflect the API name
- Delete example/non-infrastructural code (clean/mutate swagger.json, clear some of the controller/service pairs, the fake business logic)

### notes

#### native packages

This project uses a native package; that is, a package which kicks off a [gyp](https://github.com/nodejs/node-gyp) build to compile platform-specific code. The native library is [node-report](https://www.npmjs.com/package/node-report), which is a tool to provide better dumps and forensic information when the Node process unexpectedly exits.

The github page includes the prerequisites to successfully execute a npm install which relies on gyp; basically for Windows, it includes the VC++ build tools, python, and setting NPM/PATH vars correctly.

To get these working, one needs to have the C++ Build Tools (on Windows) or gcc (on \*nix) installed. In general, the steps are:

- Install CPP Build Tools within VS2015
  - Control Panel -> Programs -> Uninstall a Program
  - Right-click on MS Visual Studio, select Change
  - Select 'Modify'
  - Under 'Programming Languages', check the box for Visual C++ and click 'Update'
  - Wait...

After that, make sure the MSBuild directory's `bin` folder is on the PATH; the suffix will be `BuildTools\MSBuild\15.0\Bin`.

If this proves difficult or problematic, one can try to pass the `--ignore-scripts` commandline option when doing an `npm install`; since these native packages typically rely on post-install hooks, this will stop the package from trying to build a native lib. However, this means that if your Node API's code runs across a native package in the call stack, it'll fail hard.

#### integration/e2e tests

If your project does not include integration/e2e tests, some of the `test`-related NPM run scripts in `package.json` will fail; these NPM run scripts would need to be augmented in this case, but it's naturally recommended to strive for useful integration and e2e tests.

## package.json

### element ordering

Adopts a common element ordering convention for package.json files:

1. name
2. description
3. version
4. author

- The remaining elements are sorted in alphabetical order.
- Dependencies are sorted alphabetically
- Run scripts are sorted alphabetically

### run scripts

This project forgoes the usage of grunt/gulp or other build tools and uses simple 'npm run' scripts to perform the various tasks. Using Gulp as Wellmark's chosen Node build tool is in-flight as of the time of this writing.

| script                        | notes                                                                                                                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| build                         | performs a 'full build'; cleans dist directory, runs eslint/unit tests, generates documentation and coverage reports, copies proper source files to dist                                           |
| build-without-clean           | utility function, intended for use when Windows locks a directory and prevents rmrf of dist                                                                                                        |
| check-dependencies            | utility function, intended for use when Windows locks a directory and prevents rmrf of dist                                                                                                        |
| check-updates                 | command-line utility to easily check for package updates; use 'and upgrade' version for interactive updates                                                                                        |
| clean                         | rm rf mkdir dist                                                                                                                                                                                   |
| copy-js                       | copies the non-test-related js source to dist                                                                                                                                                      |
| copy-loose-files-to-dist      | copies all the non-js files the runtime needs at execution time to `dist`                                                                                                                          |
| dev                           | starts app in dev mode                                                                                                                                                                             |
| eslint-find-option-rules      | utility script which dumps a list of unused rules to stdout; useful when you want to see what rules are available but unused (e.g. new eslint plugin installed, airbnd eslint rule update, _etc._) |
| exact-semver                  | removes non-exact dependency strings                                                                                                                                                               |
| generate-documentation        | builds project documentation using `jsdoc`                                                                                                                                                         |
| lint                          | runs eslint against /src                                                                                                                                                                           |
| precommit                     | runs lint against the files you've staged for commit                                                                                                                                               |
| prepush                       | uses `husky` package to perform linting and testing before _pushing_ to git (not committing); prevents junk from hitting source control                                                            |
| security-check                | uses the [nsp](https://www.npmjs.com/package/nsp) package to perform scans and warns on any package deps with known vulnerabilities                                                                |
| start                         | starts the app                                                                                                                                                                                     |
| test                          | runs all tests                                                                                                                                                                                     |
| test-all-with-coverage-report | tests all running through istanbul to generate code coverage report                                                                                                                                |
| test-db-integration           | runs the integration tests against the database code                                                                                                                                               |
| test-e2e-integration          | runs the end-to-end integration tests                                                                                                                                                              |
| test-unit                     | runs the unit tests                                                                                                                                                                                |

### notes

- **cross-env** - the `cross-env` library is used to safely set environment variables in npm run scripts regardless of platform
- **pre** and **post** - NPM supports prefixing run script names with pre/post and it will automatically execute that step accordiningly; for example, if we had a task `kill`, NPM will try to run `prekill` before `kill` and `postkill` after `kill`
- **&&** - uses `&&` chaining and small scripts to enable run script chaining

## index.js

The project features a fairly tall primary file in lieu of chopping it up into smaller pieces; the intent here is to keep the intialization code all in one place, but individual projects may choose to segregate initialization of additional routes (for example) to accompanying files.

It's obvious anyone reading this can grok the code presented, but the following documentation tries to convey the reasoning behind the code structure.

| practice                                            | impl                                                         | notes                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fail fast on unexpected environment                 | class `RuntimeEnvironment`                                   | `RuntimeEnvironment` codifies WM's environment name constants; this quick check ensures `process.env.NODE_ENV` is set to something we expect since it's common for Node apps to configure themselves differently based on runtime environment                                                                                                                                                                                          |
| fail fast on missing required environment variables | package `dotenv-safe`                                        | The project uses the [dotenv-safe](https://www.npmjs.com/package/dotenv-safe) library to catch early the case of a envvar being noted as 'required' but being unset during application startup; this prevents sudden failures 'deeper' within the system when an absolutely-required env var is not defined. Convention is to put ALL variables in the `.env.example` file, comment out the optionals, and explain the use of each one |
| provide extra info in stacktraces in dev            | package `longjohn`                                           | Provide extra info in stack traces--but only in dev!                                                                                                                                                                                                                                                                                                                                                                                   |
| mapped diagnostic context logging feature           | package `cls`, class `SharedApplicationContext`, logger      | Relates to the mapped diagnostic context logging feature                                                                                                                                                                                                                                                                                                                                                                               |
| measure response time                               | package `response-time`                                      | adds an X-Response-Time header to HTTP Responses to indicate response time                                                                                                                                                                                                                                                                                                                                                             |
| forced wait middleware                              | `middleware/forced-wait-middleware`                          | simple utility to simulate slow API response; intended for use during client development so they can handle slower-than-acceptable server responses; could be easily augmented to accept 'signals' to force different errors (400's, 500's) to also ensure proper client handling.                                                                                                                                                     |
| run code on app exit                                | package `signal-exit`                                        | need to clean up resources on process exit regardless of how 'clean' the shutdown is                                                                                                                                                                                                                                                                                                                                                   |
| handle uncaught exceptions                          | listen to `uncaughtException` events + package `node-report` | logs diagnostic output on uncaught exception before telling the process to continue dying; node report provides some hope of performing post-mortem troubleshooting. Could be extended to try to send an email of this report as well, but no matter what the process _has_ to be allowed to die                                                                                                                                       |

## directory structure and file placement

This section describes the directory structure of the codebase.

In general there are two schools of thoughts around organizing large JS/TS codebases: organize-by-feature or organize-by-layer. In the former, all artifacts which (for example) produce a 'user picker' (_.e.g._ model object, UI controls, _etc._) are grouped in `/userPicker`; in the latter, your code is organized (at the top level) according to its conceptual layer or job (_e.g._ service API endpoint enables in `controllers`, models in `model`, _etc._). Many OSS NG2 apps lean toward the former and many Node APIs (including this one) seem to prefer the latter strategy.

### wm standards - Node API directory/file layout standards

- Source files should be grouped under /src and built to /dist; this allows easy transformation or culling (e.g. excluding test code) from /dist, which should represent the runtime build
- Automated tests belong close to the unit under test; if you have a file called `myfile.js`, the unit test should be in the same directory with the name of `myfile.spec.unit.js`.
- Test naming conventions:
  _ \$unit_under_test.spec.unit.js - A unit test
  _ $unit_under_test.spec.db.integration.js - An integration test going against a live DB
	* $unit_under_test.spec.e2e.integration.js - An integration test against the current API's endpoints
- Code which is needed but not business logic, models, persistence logic _et al._ (_i.e._ utility classes) should be nested under `lib`
- All dotfiles should reside in root of project directory

## testing practices

Strong automated testing foundations are important for virtually any project, but it's even more important for JS projects due to the nature of the platform itself; in a strongly-typed language, a refactor which changes a method signature is trivial to get tooling assistance. JS IDEs can assist in these refactorings but are much less bulletproof than other platforms. Note this is not to suggest refactoring is the only reason for unit testing.

Wellmark generic standards for automated testing:

- Do it during development
- Use code coverage tools to gauge the degree of tests
- Use code reviews to determine the usefulness of tests
- Create tests which cover specific bugs while closing the bug
- Use canonical datasets; it's virtually impossible to make strong assertions against variable/unknown data, and strong assertions are what make tests useful
- Don't mock what you don't own - That is, don't try to mock out calls to Mongo.
- Don't strive to achieve a code coverage % target; use the code coverage tool as a guide to identify weak areas; code coverage tools _cannot_ guage the _usefulness_ of your tests

A good automated testbed being grown with the project increases development velocity. Consider writing some DAO code which is (eventually) used in response to an API call. Without tests, it's likely you're using the `make-change -> start server -> manually exercise-API-endpoint -> debug or read logs -> repeat` development cycle. Having a good automated testing practice eliminates this development style.

### this project's testing setup

This project uses Mocha for its test runner and Chai for its assertion language.

The _local_ notion of the distinction between unit/integration/e2e tests are as follows:

- **Unit Tests** - Unit tests are those which test a small, isolated unit and depends on _no_ external systems; you can run these tests on a standalone machine and they should run and run quickly
- **Integration Tests** - Integration tests are those which run against something 'real'. If your app's persistence layer is using Mongo, then your integration tests run against a Mongo instance. The typical cycle here is Before each [suite | test] - Drop collection, create collection, insert canonical dataset -> Run DAO code to mutate persistent storage -> Make assertions against the new state of persistent storage. This project's naming conventions allow for distinctions to be made between integration tests going against a database and (perhaps) an external service; the DB integration tests would be named `$unit_under_test.spec.db.integration` to indicate they need a connection to Mongo and (perhaps) integration tests against an external service called 'WeatherService' could be `$unit_under_test.spec.ws.integration`. The important part is to use glob naming patterns to run them indidually when needed (glob `**db.integration**`) and still allow for running them all together (glob `**spec.**.integration**`) somewhere else. In this application, the e2e (end to end) tests are considered integration tests since the system will need to bind to a specific network port to do so.

The artifacts involved with this project's unit testing are as follows:

| artifact convention                  | notes                                                                                                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| spec.unit.js                         | any files suffixed with this are unit tests                                                                                                           |
| `test-unit` script in `package.json` | sets node environment, tells mocha to eval unit testing filename glob pattern                                                                         |
| `mocha-multi-reporters.json`         | config file to allow using more than one mocha reporter; will create a git-ignored `test-results.xml` file in directory root for use by the CI server |
| `src/test/unit-helpers.js`           | sets up facilities for all unit tests                                                                                                                 |
| `src/test/mocha.unit.opts`           | mocha opts for unit tests                                                                                                                             |
| `src/test/test-data-util.js`         | convenience class to load the local static canonical datasets used in testing                                                                         |
| `src/test/test-constants.js`         | contains invariants related to the local application's testing needs                                                                                  |
| `src/test/data`                      | contains canonical datasets used during automated testing                                                                                             |

The other tests follow largely the same patterns.

Things to note:

- Enterprise applications are very data-driven. Automated tests by their nature _must_ operate on known data. The larger an application becomes the larger the encompassed domain becomes which in turn increases the requirements to define, keep, and version a representative dataset. The offered example is admittedly very, very small. More work will be done on this topic along with discussions with DB/infrastructure teams to carve out relaxed-permission-and-isolatable systems to enable multiple developers/CI servers to run integration tests simultaneously and with no overlap.
- The application uses the [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) project which in turn uses the [mongodb-prebuilt](https://github.com/winfinit/mongodb-prebuilt) project's prebuilt binaries to boot an in-memory/on-demand mongodb instance binding to an open port to perform integration testing. It is conceivable that testing persistence code in this manner could be called a _unit_ test where running the same code against shared "full scale production mirror" environments would be the 'integration' tests. As above, the exact 'final' approach regarding centralized integration tests is in flux right now, so this provides a working example of an integration test using 'real' mongodb completely isolated from any other instances and spawned on-demand during test runs. This itself can be a boon during development cycles using the test harnesses themselves as quicker 'change code -> run solution' dev cycles than needing to start the entire server app.
- The underlying conventions--using test constants and invariants, using local static datasources, _etc._--are used by all tests (unit and integration).
- If you follow the pattern that all units conceptually 'under' an API endpoint should be fully tested, your e2e tests should just be asserting correct responses to stimuli and events (this request should get a 200 with 4 results, forcing this error should return a properly-formatted 500 response, etc.). This is dependent on your controllers being very _thin_; the only code which should be in a service controller is input normalization before delegating the 'real work' to other components of the system.

### test code coverage

This project uses [nyc](https://www.npmjs.com/package/nyc), the [istanbul](https://www.npmjs.com/package/istanbul) commandline interface to generate code coverage reports. After running your coverage report, the report will be available in the project's directory structure under `\coverage`.

The usual caveats apply to code coverage tools:

- don't strive for 100% coverage, strive for _enough_ coverage
- code coverage tools can only ascertain the code/branch coverage of your tests, not the quality of those tests

## openapi

The OpenAPI (Swagger) specification is a powerful definition format to describe RESTful APIs. Nest provides a dedicated [module](https://docs.nestjs.com/recipes/swagger) to work with it. With this module, the swagger YAML file is generated by the code. Learn more about the [module here.](https://docs.nestjs.com/recipes/swagger). Also, in order to fully understand how it is used, you'll need to get familiar with [nestjs](https://docs.nestjs.com/).

### code structure

Below is an example of an api module:

![Api code structure](readme-assets/images/api-module-code-structure.jpg?raw=true 'Api code structure')

Controller - this is where the http verb will go. In the following example, you would also put your @POST and @PUT endpoints related to the api.

```Typescript
import { Controller, Get, Response, HttpStatus, Param, Body, Post, Request, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UtilitiesService } from './utilities.service';

@ApiTags('utilities')
@Controller('api-health')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  @Get()
  getHealth(): string {
    return this.utilitiesService.getHealth();
  }
}
```

Module

```Typescript
import { Module } from '@nestjs/common';
import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';
@Module({
    imports: [],
    controllers: [UtilitiesController],
    providers: [UtilitiesService],
})
export class UtilitiesModule {}
```

Service

```Typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilitiesService {
  getHealth(): any {
    const healthObject: any = {};
    healthObject.status = 'healthy';
    return healthObject;
  }
}
```

\*\*\*Note: when needed, please use the dto and interfaces. Refer to the documentation link above to learn more abou these.

### adding an endpoint

Check the existing the modules to see if the endpoint belongs in any of these. If so, then pdate the controller with the new verb and add the new method. Otherwise, copy an existing modules folder and rename to your new one.

## misc

### license string

NPM complains if a project's 'license' string is missing or it contains a value that's not in the [SPDX list](https://spdx.org/licenses/). Setting to 'unlicensed' quiets the NPM complaints.

### js file naming

Use `lowercase-with-dashes` approach to all js filenames. Since all filesystems aren't case sensitive, stick to all lowercase. Do not use spaces in filenames.

### linting

This project uses [eslint](https://github.com/eslint/eslint) as its linter and extends the ruleset from [airbnb](https://www.npmjs.com/package/eslint-config-airbnb). The local configuration is in `eslintrc` which:

- tells eslint we're extending `airbnb-base`
- sets the environment (_i.e._ node, mocha, es6)
- extends selected eslint plugins
- establishes global var names
- sets parser options
- overrides configuration for select rules from their airbnb-base parent
- sets configuration for eslint plugin rules

The goals of linting are to enforce chosen practices, watch for easy "gotchas" in the language (_e.g._ type coercion, using double-equals as opposed to triple-equals), and to try to make all Node-related WM look the same to ease maintenance development. Obviously, using linting from the start of the project (as opposed to bolting it on post-development) is the preferred solution.

### dotfiles and root configs

| file                               | notes                                                                                                                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .editorconfig                      | [editorconfig](http://editorconfig.org/) configuration                                                                                                                           |
| .envexample                        | [dotenv-safe](https://www.npmjs.com/package/dotenv-safe) configuration                                                                                                           |
| .eslintignore                      | defines what's ignored during linting                                                                                                                                            |
| .eslintrc                          | eslint configuration                                                                                                                                                             |
| .npmrc                             | npm configuration; sets default options to save automatically and save exact versions                                                                                            |
| .nycrc                             | configures code coverage tooling                                                                                                                                                 |
| .jsdoc.json                        | configures jsdoc documentation generation                                                                                                                                        |
| .mocha-multi-reporters-config.json | configures the [mocha-multi-reporters](https://www.npmjs.com/package/mocha-multi-reporters) package; the CI system uses the junit report to calculate pass/fail during CI builds |

### versioning

The version tag of the code (stored in package.json) should follow the [semantic versioning](http://semver.org/) standards.

Adding to the challenge of versioning is versioning the API (stored in the swagger definition). If the semver standards are followed, the major version of the swagger-defined version tag should _always_ match. The challenge here is making sure to keep the two in relative sync, which at this time requires manual intervention.

### README file standards

Maintaining a useful project README is useful to everyone who has to work on the project. This is the place to document the following:

- purpose of the project
- functional specifications
- service endpoints
- configuration variables and any notes on usage (valid data types, the major changes the setting introduces, optional/required status, mongodb/database details, pertinent URIs for all environments (_e.g._ mongodb connection strings (sans auth) for all environments), _etc._)
- high-level directory structure
- local project conventions developers need to adhere to
- known issues or suboptimal designs

This isn't meant to be an exhaustive list. Basically anything which will assist future developers.

### enumerations

Strongly-typed languages (Java, C#) feature support for 'strong' enumeration types to cofify related constants and provide utility functions over those enumerated values. Unfortunately, JS/ES6/Typescript do not come with anything OOTB; TS enums are simplistic index-based enumerations.

This project provides examples of using the [enumify](https://www.npmjs.com/package/enumify) library to more-or-less approximate the best features of 'proper' enums. The two examples in the default codebase are found in `model/address-type` and `model/american-state`. The types provide examples of associating properties with each enumerated value with simple mnemonic-to-full-representation properties. For example, each AmericanState features the abbreviation and the full name of the state. Callers can retrieve instances by using the enumeration name (_e.g._ IOWA) or abbreviation (IA) or full name (Iowa). These help clarify code and helps reduce the occurrences of magic strings in your codebase.

Note that this strategy introduces some wrinkles in serialization duties as one needs to account for the behavior of the serialized representation; that is, flattening the object into its base type without enumerating all properties. `Object.defineProperty` can assist in encapsulating this requirement within the type itself.

Some of these base types will eventually make their way into internal shared npm packages.

### lolex and testing date-dependent logic

Testing date-dependent logic can be tricky with static datasets. For example, consider a static dataset with a field containing 'effectiveDate'; your business logic is supposed to pick out all people from a collection with an effective date elapsed time over one month. Obviously, running the business logic against a static dataset will cause the business logic to break after one month in 'real time'.

Mutating the dataset (_e.g._ mutate the date on load manually) is suboptimal since these are supposed to be static datasets and you're introducing variability into the tests. The better option is to use [lolex](https://www.npmjs.com/package/lolex), a library which assists by mutating the clock during test runs. A (convoluted) example of this is in `business_services/person-manager.spec.unit.js`.

### mongodb connector

In `src/lib/persistence/mongodb-connector` there is an implementation of a function to acquire a connection to MongoDB. Centralizing the acquisition of a connection is a good practice to follow as it's a bit more involved than `MongoClient.connect()` to be fault-tolerant.

Initial attempts to just use `MongoClient.connect()` approach is that the driver would enter an unusable state if the connection to the DB was interrupted (_e.g._ network connectivity drop). This function attempts to handle this eventuality by testing the connection before return and resetting connection/throwing errors as soon as possible in the call chain.

### internal class validation with json schema

The classes `src/model/address` and `src/model/person` each feature an embedded JSON schema to ascertain instance syntactic validity; this allows the class instance itself to report whether it's valid post-construction. This pattern is provided as a possible POC on how to do this with the acknowledgement that it's a bit alien in its approach. The `src/model/people` collective object segregates its contained Person instances depending on their syntactic validity.

The general goals were to allow an instance to indicate to interested code whether it's syntactically valid and to construct fully without throwing exceptions during construction on invalid data or having to introduce external validators. If your use case fits, this approach may be useful.

### \_ for private methods

JS doesn't truly support the notion of private methods; you can approximate them but it's not built in. The simple modern convention is to use an underscore prefix for functions you _intend_ to be privately-scoped. Naturally, it's up to the developers to adhere to this standard. A real side-benefit of this approach is that you don't need to resort to things like reflection to test the function from unit tests (which should be the only code calling another unit's privately-marked functions).

### profiling

To profile your API, start the `profile-dev` NPM script and use the `chrome://inspect` endpoint in Chrome to attach once it's running

## dependencies

- [@wellmark/wm-lib-logger](http://tfs.int.wellmark.com:8080/tfs/DefaultCollection/BTS/_git/wm-lib-logger): Shared wellmark node API logging library
- [ajv](https://github.com/epoberezkin/ajv): Another JSON Schema Validator
- [body-parser](): Node.js body parsing middleware
- [clone](https://github.com/pvorb/node-clone): deep cloning of objects and arrays
- [compression](): Node.js compression middleware
- [cors](): Node.js CORS middleware
- [cross-env](https://github.com/kentcdodds/cross-env): Run scripts that set and use environment variables across platforms
- [dotenv-safe](https://github.com/rolodato/dotenv-safe): Load environment variables from .env and ensure they are defined
- [enumify](https://github.com/rauschma/enumify): Provides a possible starting point or reference base for WM Node API projects; see README.md for additional information
- [env-var](https://github.com/evanshortiss/env-var): Solution for loading and sanatizing environment variables in node.js with correct typings
- [express](): Fast, unopinionated, minimalist web framework
- [get-port](): Get an available port
- [helmet](https://github.com/helmetjs/helmet): help secure Express/Connect apps with various HTTP headers
- [js-yaml](): YAML 1.2 parser and serializer
- [lodash](https://github.com/lodash/lodash): Lodash modular utilities.
- [longjohn](https://github.com/mattinsler/longjohn): Long stack traces for node.js inspired by https://github.com/tlrobinson/long-stack-traces
- [mem](): Memoize functions - An optimization used to speed up consecutive function calls by caching the result of calls with identical input
- [moment](https://github.com/moment/moment): Parse, validate, manipulate, and display dates
- [mongodb](https://github.com/mongodb/node-mongodb-native): The official MongoDB driver for Node.js
- [morgan](): HTTP request logger middleware for node.js
- [node-report](https://github.com/nodejs/node-report): Diagnostic Report for Node.js
- [response-time](): Response time for Node.js servers
- [root-require](https://github.com/mikermcneil/root-require): For use in tests only! require() using a relative path from the root directory of the present module
- [signal-exit](https://github.com/tapjs/signal-exit): when you want to fire an event no matter how a process exits.
- [stats-map](): Map that keeps track of the hits and misses
- [swagger-tools](https://github.com/apigee-127/swagger-tools): Various tools for using and integrating with Swagger.
- [useragent](https://github.com/3rd-Eden/useragent): Fastest, most accurate &amp; effecient user agent string parser, uses Browserscope&#39;s research for parsing
- [valid-url](https://github.com/ogt/valid-url): URI validation functions
- [verror](https://github.com/davepacheco/node-verror): richer JavaScript errors

## dev dependencies

- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [chai-as-promised](): Extends Chai with assertions about promises.
- [chai-http](https://github.com/chaijs/chai-http): Extend Chai Assertion library with tests for http apis
- [copyfiles](https://github.com/calvinmetcalf/copyfiles): copy some files
- [decache](https://github.com/dwyl/decache): decache (Delete Cache) lets you delete modules from node.js require() cache; useful when testing your modules/projects.
- [dependency-check](https://github.com/maxogden/dependency-check): checks which modules you have used in your code and then makes sure they are listed as dependencies in your package.json
- [deps-ok](https://github.com/bahmutov/deps-ok): Fast checking of top level dependencies based on version numbers
- [eslint](): An AST-based pattern checker for JavaScript.
- [eslint-config-airbnb](https://github.com/airbnb/javascript): Airbnb&#39;s ESLint config, following our styleguide
- [eslint-config-airbnb-base](https://github.com/airbnb/javascript): Airbnb&#39;s base JS ESLint config, following our styleguide
- [eslint-find-rules](https://github.com/sarbbottam/eslint-find-rules): Find built-in ESLint rules you don&#39;t have in your custom config.
- [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import): Import with sanity.
- [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc): JSDoc linting rules for ESLint.
- [eslint-plugin-json](https://github.com/azeemba/eslint-plugin-json): Lint JSON files
- [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y): Static AST checker for accessibility rules on JSX elements.
- [eslint-plugin-lodash](https://github.com/wix/eslint-plugin-lodash): Lodash specific linting rules for ESLint
- [eslint-plugin-promise](): Enforce best practices for JavaScript promises
- [eslint-plugin-unicorn](): Various awesome ESLint rules
- [exact-semver](https://github.com/bahmutov/exact-semver): Removes fuzzy characters from listed dependencies in your package.json
- [husky](https://github.com/typicode/husky): Prevents bad commit or push (git hooks, pre-commit/precommit, pre-push/prepush, post-merge/postmerge and all that stuff...)
- [istanbul](https://github.com/gotwarlost/istanbul): Yet another JS code coverage tool that computes statement, line, function and branch coverage with module loader hooks to transparently add coverage when running tests. Supports all JS coverage use cases including unit tests, server side functional tests
- [jsdoc](https://github.com/jsdoc3/jsdoc): An API documentation generator for JavaScript.
- [jsdoc-strip-async-await](https://github.com/jcowgar/jsdoc-strip-async-await): jsdoc plugin to strip async/await keywords before parse.
- [lint-staged](): Lint files staged by git
- [lolex](https://github.com/sinonjs/lolex): Fake JavaScript timers
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [mocha-junit-reporter](https://github.com/michaelleeallen/mocha-junit-reporter): A JUnit reporter for mocha.
- [mocha-multi-reporters](https://github.com/stanleyhlng/mocha-multi-reporters): Generate multiple mocha reports in a single mocha execution.
- [mongodb-memory-server](): In-memory MongoDB Server. Designed with testing in mind, the server will allow you to connect your favourite ODM or client library to the MongoDB Server and run integration tests isolated from each other.
- [mongodb-prebuilt](https://github.com/winfinit/mongodb-prebuilt): Install MongoDB prebuilt binaries via npm
- [npm-check](https://github.com/dylang/npm-check): Check for outdated, incorrect, and unused dependencies.
- [nsp](https://github.com/nodesecurity/nsp): The Node Security (nodesecurity.io) command line interface
- [nyc](https://github.com/istanbuljs/nyc): the Istanbul command line interface
- [rimraf](): A deep deletion module for node (like `rm -rf`)

## License

UNLICENSED

### Installation & Config

- Use [dotenv-safe](https://www.npmjs.com/package/dotenv-safe) for configuration loading. please copy `.env.example` to `.env`, then use `.env` for Configuration. All keys are required.

  | Variable                                     | Value                                                                                                                 |
  | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
  | `JWT_SECRET`                                 | jwt secret key                                                                                                        |
  | `NODE_ENV`                                   | The staging environment; defined in dependency wm-lib-runtime-enviroment; values are LOCAL, DEV, SIT, UAT, PREP, PROD |
  | `WM_CCC_DATASTORE_HOST`                      | Hostname of datastore WM_CCC DB                                                                                       |
  | `WM_CCC_DATASTORE_PORT`                      | Port number WM_CCC DB                                                                                                 |
  | `WM_CCC_DATASTORE_DB_NAME`                   | The name of the WM_CCC DB                                                                                             |
  | `WM_CCC_DATASTORE_USER`                      | Username for WM_CCC DB                                                                                                |
  | `WM_CCC_DATASTORE_PASSWORD`                  | Password for WM_CCC DB                                                                                                |
  | `WM_CCC_ROOT_URI_DOCUMENT_API`               | The root URI for contacting the Document API                                                                          |
  | `WM_CC_ROOT_URI_DYNAMICS_ROOT`               | The root URI for contacting the CRM API                                                                               |
  | `WM_CC_ROOT_URI_LCA_ROOT`                    | The root URI for contacting the LCA API                                                                               |
  | `WM_CCC_OBJECT_STORAGE_TYPE`                 | Indicates the type of storage used to keep Pending documents until Release/Denial                                     |
  | `WM_CC_TEMPORARY_PATH`                       | the path to temporary save files                                                                                      |
  | `WM_CCC_OBJECT_STORAGE_S3_BUCKET`            | Indicates bucket name                                                                                                 |
  | `WM_CCC_OBJECT_STORAGE_S3_REGION`            | aws s3 regin                                                                                                          |
  | `WM_CCC_OBJECT_STORAGE_S3_ACCESS_KEY_ID`     | aws access key id for s3 access                                                                                       |
  | `WM_CCC_OBJECT_STORAGE_S3_SECRET_ACCESS_KEY` | aws secret access key for s3 access                                                                                   |
  | `WM_CCC_CACHE_THRESHOLDS`                    | the cache thresholds time (ms) for document api catalog get                                                           |
  | `WM_CRMWBI_ROOT_URI_CONTACT_API`             | The root URI for contacting Enterprise Contact API                                                                    |
  | `WM_CRMWBI_DATASTORE_HOST`                   | Hostname of datastore WM_CRMWBI DB                                                                                    |
  | `WM_CRMWBI_DATASTORE_PORT`                   | Port number WM_CRMWBI DB                                                                                              |
  | `WM_CRMWBI_DATASTORE_DB_NAME`                | The name of the WM_CRMWBI DB                                                                                          |
  | `WM_CRMWBI_DATASTORE_USER`                   | Username for WM_CRMWBI DB                                                                                             |
  | `WM_CRMWBI_DATASTORE_PASSWORD`               | Password for WM_CRMWBI DB                                                                                             |

### Local development

Use docker-compose run Mongodb

```
$ sudo docker-compose -f docker/dev.yml up -d
```

Start the API/Processor (use cross-env for windows NODE_ENV environment variable setting)

```
npm run dev
```

Import test data

```
npm run import
```

### Unit Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

### jwt usage
- please use [jwt.io](https://jwt.io/) to generate jwt token.
- set the `secret key` at `VERIFY SIGNATURE` area. The secret key defined at `.env` file `JWT_SECRET` key.
- you can paste `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ4eHh4eHh4eHh4eHh4eHgiLCJ1c2VyUm9sZSI6ImFkbWluIiwiaWF0IjoxNTg4Mzg1MzIwLCJleHAiOjE2ODgzODg5MjB9.yiiG2jVhNt5W0kCy__SGz_jM0vcxRzjebye1qzh2388` in `Encoded` area, for the beginning schema. The payload will be decoded and shown at `PAYLOAD:DATA` area.
- you can modify payload at `PAYLOAD:DATA` area. The modified jwt token synchronously generate.

![](readme-assets/images/jwt.io.jpg)

- in `swagger Open Api page` (http://localhost:3000/v1/docs after service launched), click `Authorize` button. input `bearer ${jwt token}` in the `Value` area. Caution: there's one `space` between `bearer` and `jwt token`.

![](readme-assets/images/swagger-authorize-button.jpg)

![](readme-assets/images/bearer.jpg)

### Verification
- Run mock service by launching new shell/CMD (run `npm run mock`)
- setup mongoDB, you can go to folder `docker`, run `sudo docker-compose -f docker/dev.yml up -d` to start mongoDb and mongo express.
- Connect to MongoDB with mongo express. Mongo express is up http://localhost:8081/ if docker-compose is used.
- Copy .env.example to .env
- Run `npm run import` to import test data.
- Start backend. you can use vscode start or use `npm run dev`
- I have completed swagger Open Api, please open http://localhost:3000/v1/docs to do the test. For jwt token, please refer to `jwt usage`.
- for attachment upload api, please use postman load `docs/cca.postman_collection.json` to do the test.
- you can change the `mock/mock.controller.ts` to mock different data and response status.
- current case:
  - form id: `B-2318744` have the related data. to test approval chain
  - form id: `B-2317902` need use role `test` to build. to test the 403 when create conversation.
  - there case is easy to structure

###Heroku setup and deploy

The app has been setup to be deployed in heroku with updated package.json

To run locally:

- download and install heroku from https://devcenter.heroku.com/articles/heroku-cli
- Make sure all dependencies like Mongo are running.
- run `heroku config:set NODE_OPTIONS=--max_old_space_size=4096`
- Deploy with command `heroku local web`
- app should be running at http://localhost:5000/

To deploy

- commit to git
- use command `heroku login` and enter credentials.
- `heroku create`
- git push heroku master
