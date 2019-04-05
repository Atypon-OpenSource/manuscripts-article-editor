# manuscripts-frontend 

A client for collaborative editing of rich-text articles.

[![pipeline status](https://gitlab.com/mpapp-private/manuscripts-frontend/badges/master/pipeline.svg)](https://gitlab.com/mpapp-private/manuscripts-frontend/commits/master)

## Installation

Run `yarn` to install the dependencies.

## Running the client (development mode)

The variables listed in `.env.example` should all have appropriate values set in `.env` (copy `.env.example` to `.env` to get started).

Run `yarn start` to start the app in development mode (using `webpack-dev-server` and `react-hot-loader`).

## Building the app (production mode)

The variables listed in `.env.example` should all be defined as environment variables.

Run `yarn build` to build the app to the `dist` folder, from where it can be deployed.

## Running in Docker

1. Edit env variables needed for the server in `docker/server/.env` (example found at `docker/server/.env.example`).
2. Edit env variables needed for the client in `docker/client/development/.env` (example found at `docker/client/development/.env.example`).
2. Create a Docker volume for Yarn's cache: `docker volume create --name=yarn-cache`
3. `docker login registry.gitlab.com` to log in to GitLab’s Container Registry using your GitLab username and password (or a deploy token for read-only access to the registry images).
4. `yarn docker-compose:server pull --no-parallel` to pull the latest server Docker images.
5. `yarn docker-compose:server up` to start the server in Docker.
6. `yarn docker-compose:client up --build` to start the client in Docker.
8. Open <http://localhost:8080/> in a web browser to start the app.

**IMPORTANT:** When running the service for the first time, set `APP_INITIALIZE=1` and `APP_RUN_AFTER_INITIALIZE=1` in the server environment variables at `docker/server/.env`.

## Stopping the service in Docker

- Run `yarn docker-compose:server down` to stop and remove the server.
- Run `yarn docker-compose:client down` to stop and remove the client.
- Optionally, run `yarn docker-compose:server down -v` to stop and remove the server and delete the data volumes.

## Running Jupyter in Docker

- Run `yarn docker-compose:server up jupyter` to start the notebook server.

## Running tests with TestCafé locally

1. Follow the steps in "Running in Docker", above.
2. Run `yarn testcafe chrome testcafe/tests` to run the tests in Chrome.

## Running tests with Cypress locally

1. Follow the steps in "Running in Docker", above.
2. Run `yarn run cypress:open` to launch the Cypress runner.
3. From the Cypress runner, select an individual test to run or select `Run all specs`

## Development

See the [`manuscripts-frontend` wiki](https://gitlab.com/mpapp-private/manuscripts-frontend/wikis/) for more information.

## Analysis

Run `yarn stats` to generate a `stats.json` file, then `yarn analyze` to open `webpack-bundle-analyzer`'s visualization of the webpack bundle.
