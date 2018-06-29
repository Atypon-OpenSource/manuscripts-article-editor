# manuscripts-frontend 

A client for collaborative editing of rich-text articles.

[![pipeline status](https://gitlab.com/mpapp-private/manuscripts-frontend/badges/master/pipeline.svg)](https://gitlab.com/mpapp-private/manuscripts-frontend/commits/master)

## Installation

Run `yarn` to install the dependencies.

## Running the app (development mode)

The variables listed in `.env.example` should all have appropriate values set in `.env` (copy `.env.example` to `.env` to get started).

Run `yarn start` to start the app in development mode (using `webpack-dev-server` and `react-hot-loader`).

The editor currently depends on the [`csl-data`](https://gitlab.com/mpapp-private/csl-data) web service for CSL styles and locales.

## Building the app (production mode)

The variables listed in `.env.example` should all be defined as environment variables.

Run `yarn build` to build the app to the `dist` folder, from where it can be deployed.

## Running in Docker

1. Edit env variables needed for the server in `docker/server/.env` (example found at `docker/server/.env.example`).
2. Edit env variables needed for the client in `docker/client/development/.env` (example found at `docker/client/development/.env.example`).
3. `docker login registry.gitlab.com` to log in to GitLab’s Container Registry using your GitLab username and password (or a deploy token for read-only access to the registry images).
4. `yarn docker-compose:server pull --no-parallel` to pull the latest server Docker images.
5. `yarn docker-compose:server up --build` to start the server in Docker.
6. `yarn docker-compose:client up --build` to start the client in Docker.
7. Install and start the [`csl-data`](https://gitlab.com/mpapp-private/csl-data) web service for CSL styles and locales.
8. Open <http://0.0.0.0:8080/> in a web browser to start the app.

**IMPORTANT:** Before running the service for the first time, run `INITIALIZE_DATABASE=true yarn docker-compose:server run api` to initialize the database, or include `APP_INITIALIZE=1` and `APP_RUN_AFTER_INITIALIZE=1` in server environment variables at `docker/server/.env`.

## Stopping the service in Docker

- Run `yarn docker-compose:server down` to stop and remove the server.
- Run `yarn docker-compose:client down` to stop and remove the client.
- Optionally, run `yarn docker-compose:server down -v` to stop and remove the server and delete the data volumes.

## Running tests with TestCafé locally

1. Follow the steps in "Running in Docker", above.
1. Run `yarn testcafe chrome tests` to run the tests in Chrome.

## Development

See the [`manuscripts-frontend` wiki](https://gitlab.com/mpapp-private/manuscripts-frontend/wikis/) for more information.
