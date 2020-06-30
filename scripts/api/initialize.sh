#!/usr/bin/env bash

set -e

export COUCHBASE_INITIALIZE=true
export PYTHONUNBUFFERED=1

docker-compose down --volumes
docker-compose up -d couchbase
docker-compose up -d sync-gateway
docker-compose up api-initialize
docker-compose down
