#!/usr/bin/env bash

set -e # exit if any step fails
set -u # exit if a variable isn't set

yarn install --frozen-lockfile --non-interactive

export SCREENSHOTS=${PWD}/screenshots
mkdir -p ${SCREENSHOTS}/data

docker volume create --name=build-cache
docker volume create --name=yarn-cache

docker-compose -f docker/tests/testcafe/docker-compose.yml down -v
yarn run docker-compose:testcafe pull
yarn run docker-compose:testcafe up --build --abort-on-container-exit --exit-code-from $1 $1
