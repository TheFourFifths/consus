# Consus

[![Build Status](https://travis-ci.org/TheFourFifths/consus.svg?branch=master)](https://travis-ci.org/TheFourFifths/consus)

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
* `npm run lint`: Run the linter
* `npm run build`: Build the usable .dist directory

## Project File Structure

* `doc`: Project documentation goes here
* `bin`: A directory containing the `consusd` file for running as a global module
* `src`: The project's source code
    * `api`: API apps that register and handle REST endpoints
    * `lib`: Miscellaneous library modules
    * `model`: Model classes for organizing data
    * `public`: Public files served to the web browser
    * `store`: Flux stores which contain state and consume actions
* `test`: The project's tests
    * `unit`: Unit tests
