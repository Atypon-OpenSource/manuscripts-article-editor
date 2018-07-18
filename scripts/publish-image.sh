#!/usr/bin/env bash

set -e # exit if any step fails
set -u # exit if a variable isn't set

docker login -u gitlab-ci-token -p ${CI_JOB_TOKEN} registry.gitlab.com
docker pull ${CONTAINER_IMAGE} || true
# - docker build --build-arg API_APPLICATION_ID="$API_APPLICATION_ID" --build-arg API_BASE_URL="$API_BASE_URL" --build-arg CSL_DATA_URL="$CSL_DATA_URL" --build-arg SYNC_GATEWAY_URL="$SYNC_GATEWAY_URL" -f docker/client/production/Dockerfile --cache-from ${CONTAINER_IMAGE} --tag ${CONTAINER_IMAGE} .
docker build -f docker/client/development/Dockerfile --cache-from ${CONTAINER_IMAGE} --tag ${CONTAINER_IMAGE} .
docker push ${CONTAINER_IMAGE}
