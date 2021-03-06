# Consus

[![Build Status](https://travis-ci.org/TheFourFifths/consus.svg?branch=dev)](https://travis-ci.org/TheFourFifths/consus)
[![codecov](https://codecov.io/gh/TheFourFifths/consus/branch/dev/graph/badge.svg)](https://codecov.io/gh/TheFourFifths/consus)
[![npm](https://img.shields.io/npm/v/consus.svg)](https://www.npmjs.com/package/consus)
[![Dependency Status](https://david-dm.org/TheFourFifths/consus.svg)](https://david-dm.org/TheFourFifths/consus)
[![devDependency Status](https://david-dm.org/TheFourFifths/consus/dev-status.svg)](https://david-dm.org/TheFourFifths/consus?type=dev)

## Installing

```bash
# Install as a global module
npm install consus -g
# Start the server daemon
consusd start
# Stop the daemon
consusd stop
```

## Developing

### Getting Started

```bash
# Clone the repository
git clone git@github.com:TheFourFifths/consus.git
# Enter the project directory
cd consus
# Install dependencies
npm install
# Build the project
npm run build
# Start the server
npm start
```

### Development Scripts

* `npm test`: Run the test suite
* `npm run delete-database`: Delete all data in the database
* `npm run data-setup`: Delete all data in the database, then add sample data
* `npm run lint`: Run the linter
* `npm run build`: Build the usable .dist directory
* `npm run coverage`: Generate a code coverage report

## Project File Structure

* `docs`: Project documentation goes here
* `bin`: A directory containing the `consusd` file for running as a global module
* `src`: The project's source code
    * `api`: API apps that register and handle REST endpoints
    * `lib`: Miscellaneous library modules
    * `public`: Public files served to the web browser
    * `store`: Flux stores which contain state and consume actions
* `test`: The project's tests
    * `unit`: Unit tests
    * `functional`: Functional tests
