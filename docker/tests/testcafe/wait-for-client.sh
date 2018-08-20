#!/bin/sh

set -u # exit if a variable isn't set

echo "Connecting to Sync Gateway at ${SYNC_GATEWAY_URL}…"

sg_attempts=0
until $(curl -o /dev/null -s --head --fail "${SYNC_GATEWAY_URL}")
do
  sg_attempts=$((sg_attempts + 1))
  if [ $sg_attempts -eq 256 ]
  then
    echo "Sync Gateway did not appear."
    exit 1
  fi
  sleep 1
done

echo "Connected to Sync Gateway."

echo "Connecting to API at ${API_BASE_URL}/app/version…"

attempts=0
until $(curl -o /dev/null -s --head --fail "${API_BASE_URL}/app/version")
do
  attempts=$((attempts + 1))
  if [ $attempts -eq 256 ]
  then
    echo "API did not appear."
    exit 1
  fi
  sleep 1
done

echo "Connected to API."

echo "Connecting to data service at ${DATA_URL}/shared/styles.json…"

attempts=0
until $(curl -o /dev/null -s --head --fail "${DATA_URL}/shared/styles.json")
do
  attempts=$((attempts + 1))
  if [ $attempts -eq 256 ]
  then
    echo "Data service did not appear."
    exit 1
  fi
  sleep 1
done

echo "Connected to data service."

echo "Connecting to client at ${BASE_URL}…"

attempts=0
until $(curl -o /dev/null -s --head --fail "${BASE_URL}")
do
  attempts=$((attempts + 1))
  if [ $attempts -eq 256 ]
  then
    echo "Client did not appear."
    exit 1
  fi
  sleep 1
done

echo "Connected to client."

exec "$@"
