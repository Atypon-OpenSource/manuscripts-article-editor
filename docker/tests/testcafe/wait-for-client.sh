#!/bin/sh

echo "Connecting to Sync Gateway…"

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
echo "Connecting to API…"

attempts=0
until $(curl -o /dev/null -s --head --fail "${API_BASE_URL}/app/version")
do
  attempts=$((attempts + 1))
  if [ $attempts -eq 256 ]
  then
    echo "Client did not appear."
    exit 1
  fi
  sleep 1
done

echo "Connected to API…"

exec "$@"
