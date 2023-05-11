# Curiosity Frontend
[![Build Status](https://app.travis-ci.com/RedHatInsights/curiosity-frontend.svg?branch=main)](https://app.travis-ci.com/RedHatInsights/curiosity-frontend)
[![codecov](https://codecov.io/gh/RedHatInsights/curiosity-frontend/branch/main/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/curiosity-frontend)
[![License](https://img.shields.io/github/license/RedHatInsights/curiosity-frontend.svg)](https://github.com/RedHatInsights/curiosity-frontend/blob/main/LICENSE)

A web user interface for subscription reporting, based on [Patternfly](https://www.patternfly.org/)

## Development, Quick Start

### Requirements
Before developing for Curiosity Frontend
 * Your system needs to be running [NodeJS version 18+ and NPM](https://nodejs.org/)
 * [Docker](https://docs.docker.com/engine/install/)
   * Alternatively, you can try [Podman](https://github.com/containers/podman).
 * And [Yarn](https://yarnpkg.com) for dependency and script management.

For in-depth tooling install guidance see the [contribution guidelines](./CONTRIBUTING.md#Development)

### Install
  1. Clone the repository
     ```
     $ git clone https://github.com/RedHatInsights/curiosity-frontend.git
     ```

  1. Within the repo context, install project dependencies
     ```
     $ cd curiosity-frontend && yarn
     ```

### Develop
This is the base context for running a local UI against a mock API and styling.

  1. In a terminal instance that uses the repo context... Run
     ```
     $ yarn start
     ```
  1. Start developing against files in `./src`

For in-depth local run guidance review the [contribution guidelines](./CONTRIBUTING.md#Serving%20Content) 

### Testing
Run and update tests while developing. In a new terminal instance

  1. In a new terminal instance that uses the repo context...
     ```
     $ yarn test:dev
     ```
  2. Test files can be accessed under `__test__` directories parallel to the files you're editing.

For in-depth testing guidance review the [contribution guidelines](./CONTRIBUTING.md#Testing) 

## Contributing
Contributing encompasses [repository specific requirements](./CONTRIBUTING.md).
