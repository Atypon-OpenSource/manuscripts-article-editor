# manuscripts-frontend 

A client for collaborative editing of rich-text articles.

[![pipeline status](https://gitlab.com/mpapp-private/manuscripts-frontend/badges/master/pipeline.svg)](https://gitlab.com/mpapp-private/manuscripts-frontend/commits/master)

## Installation

Run `yarn` to install the dependencies.

## Build (for production)

The variables listed in `.env.example` must all be defined as environment variables.

Run `yarn build` to build the app to the `dist` folder.
 
Deploy the files to S3 with `scripts/deploy.sh`.

## Running the client in development mode

The variables listed in `.env.example` should all have appropriate values set in `.env` (copy `.env.example` to `.env` to get started).

Run `yarn start` to start the app in development mode (using `webpack-dev-server` and `react-hot-loader`).

Run `docker-compose up data jupyter` to start the services needed for development.

Open <http://localhost:8080/developer> to create a dummy user profile.

## Running the backend API in Docker

1. Add any environment variables needed for the API server in `docker/server/.env`.
1. `docker login registry.gitlab.com` to log in to GitLab’s Container Registry using your GitLab username and password (or a deploy token for read-only access to the registry images).
1. Run `docker-compose pull` to pull the latest server Docker images.
1. [first run] Initialize the backend services: `scripts/api/initialize.sh`
1. [subsequent runs] Start the backend services: `docker-compose up api`
1. Run `docker-compose up data jupyter` to start the additional services.
1. To stop the service, run `docker-compose down`. Add an optional `-v` flag to delete the data volumes.

## Running the client in Docker (optional)

- Run `docker-compose up --build client` to build and start the client web server.

## Testing

### Unit tests

Run `yarn test` to run the unit tests in Jest.

### Running tests with TestCafé

1. Run `yarn testcafe chrome testcafe/tests` to run the tests in Chrome.

### Running tests with Cypress

1. Run `yarn run cypress:open` to launch the Cypress runner.
1. From the Cypress runner, select an individual test to run or select `Run all specs`

## Development

See the [`manuscripts-frontend` wiki](https://gitlab.com/mpapp-private/manuscripts-frontend/wikis/) for more information.

# Developing manuscripts-api

1. If needed, initialize the backend services: `scripts/api/initialize.sh`
1. Start the other backend services in Docker: `docker-compose up sync_gateway data jupyter`
1. Start the API: `scripts/api/start-local.sh`

## Developing @manuscripts/style-guide

1. Clone [`@manuscripts/style-guide`](https://gitlab.com/mpapp-private/manuscripts-style-guide) to a folder alongside this one, run `yarn install` to install its dependencies, run `yarn link` to make it available as a local dependency, then run `yarn dev` in that folder to start building it.
1. In this folder, run `yarn link @manuscripts/style-guide` to use the linked module as a local dependency.

## Analysis

Run `yarn stats` to generate a `stats.json` file, then `yarn analyze` to open `webpack-bundle-analyzer`'s visualization of the webpack bundle.
