#!/usr/bin/env bash

set -e

export COUCHBASE_INITIALIZE=true
export APP_INITIALIZE=1
export APP_RUN_AFTER_INITIALIZE=0
export PYTHONUNBUFFERED=1

docker-compose down --volumes
docker-compose up -d couchbase
docker-compose up -d sync_gateway
docker-compose up api
