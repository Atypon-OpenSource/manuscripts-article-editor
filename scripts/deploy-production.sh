#!/usr/bin/env bash

yarn install --frozen-lockfile --non-interactive --production
yarn build
aws s3 cp --recursive --include "*" --cache-control "max-age=2592000" --acl "public-read" --sse "AES256" dist/ s3://${S3_BUCKET}
aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths /index.html /
