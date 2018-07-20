#!/usr/bin/env bash

set -e # exit if any step fails
set -u # exit if a variable isn't set

yarn install --frozen-lockfile --non-interactive --production
yarn build

aws s3 sync --exclude "index.html" --exclude "service-worker.js" \
    --cache-control "max-age=2592000" --acl "public-read" \
     dist/ s3://${S3_BUCKET}

aws s3 cp "dist/index.html" s3://${S3_BUCKET}/index.html \
    --cache-control "max-age=0" --acl "public-read"

 aws s3 cp "dist/service-worker.js" s3://${S3_BUCKET}/service-worker.js \
    --cache-control "no-cache" --acl "public-read"

aws cloudfront create-invalidation \
    --distribution-id ${CLOUDFRONT_ID} --paths /index.html /
