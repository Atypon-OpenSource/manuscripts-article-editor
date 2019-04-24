#!/usr/bin/env bash

set -e

DIR=$(dirname "$0")
API_DIR="$DIR/../../../manuscripts-api"
SERVER_DIR="$DIR/../../docker/server"

export env $(grep -v '^#' "$SERVER_DIR/defaults.env" | xargs)

if [[ -f "$SERVER_DIR/.env" ]]; then
  export env $(grep -v '^#' "$SERVER_DIR/.env" | xargs)
fi

export COUCHBASE_INITIALIZE=false
export APP_INITIALIZE=0
export APP_COUCHBASE_HOSTNAME=localhost
export APP_DB_URI=couchbase://localhost/
export APP_GATEWAY_HOSTNAME=localhost
#export LCB_LOGLEVEL=5

"$DIR/wait.js"

TS_NODE_TRANSPILE_ONLY=true TS_NODE_PROJECT="$API_DIR/tsconfig.json" \
    node --require ts-node/register ${NODE_DEBUG_OPTION} "$API_DIR/src/index.ts"
