#!/bin/sh

set -e # exit if any step fails

/opt/testcafe/scripts/wait-for-client.sh echo "Dependencies ready. Starting tests…"

node /opt/testcafe/bin/testcafe.js --ports 1337,1338 "$@"
