#!/usr/bin/env bash

set -e # exit if any step fails
set -u # exit if a variable isn't set

docker login -u gitlab-ci-token -p ${CI_JOB_TOKEN} registry.gitlab.com
docker pull ${CONTAINER_IMAGE} || true
docker build -f docker/client/development/Dockerfile --cache-from ${CONTAINER_IMAGE} --tag ${CONTAINER_IMAGE} .
docker push ${CONTAINER_IMAGE}
