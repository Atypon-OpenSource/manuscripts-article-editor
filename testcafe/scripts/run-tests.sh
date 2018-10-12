#!/usr/bin/env bash

set -e # exit if any step fails
set -u # exit if a variable isn't set

yarn install --frozen-lockfile --non-interactive

docker volume create --name=build-cache
docker volume create --name=yarn-cache

SCREENSHOTS="$PWD/screenshots"
mkdir -p "$SCREENSHOTS"

CONFIG="testcafe/docker-compose.yml"

docker-compose --file "$CONFIG" down --volumes
docker-compose --file "$CONFIG" pull
docker-compose --file "$CONFIG" build
docker-compose --file "$CONFIG" up -d client
docker-compose --file "$CONFIG" run \
    --user="$(id -u):$(id -g)" \
    --volume="${SCREENSHOTS}:/screenshots" \
    $1
docker-compose --file "$CONFIG" down
