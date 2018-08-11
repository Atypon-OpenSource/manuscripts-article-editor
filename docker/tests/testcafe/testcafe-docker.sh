#!/bin/sh

/opt/testcafe/docker/wait-for-client.sh echo "Dependencies ready. Starting tests…"

node /opt/testcafe/bin/testcafe.js --ports 1337,1338 "$@"
