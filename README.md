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

The variables needed for the server should be in `docker/server/.env`.

The variables needed for the client should be in `docker/client/development/.env`.

Run `yarn docker-compose:server pull` to pull the latest server Docker images.

Run `yarn docker-compose:server up` to start the server in Docker.

Run `yarn docker-compose:client up --build` to start the client in Docker.

## Development

See the [`manuscripts-frontend` wiki](https://gitlab.com/mpapp-private/manuscripts-frontend/wikis/) for more information.
