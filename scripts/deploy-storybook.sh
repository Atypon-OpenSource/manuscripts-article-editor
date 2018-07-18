#!/usr/bin/env bash

set -e # exit if any step fails
set -u # exit if a variable isn't set

yarn install --frozen-lockfile --non-interactive
yarn run build-storybook
aws s3 sync --cache-control "max-age=2592000" --acl "public-read" --sse "AES256" storybook-static/ "s3://${STORYBOOK_BUCKET_NAME}"
aws cloudfront create-invalidation --distribution-id ${STORYBOOK_DISTRIBUTION_ID} --paths /index.html /
