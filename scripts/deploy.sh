#!/usr/bin/env bash

set -e # exit if any step fails
set -u # exit if a variable isn't set

yarn install --frozen-lockfile --non-interactive --production
yarn build

# upload static files to S3

aws s3 sync --exclude "index.html" --exclude "service-worker.js" \
    --cache-control "max-age=2592000" --acl "public-read" \
     dist/ s3://${S3_BUCKET}

aws s3 cp "dist/index.html" s3://${S3_BUCKET}/index.html \
    --cache-control "max-age=0" --acl "public-read"

if [[ -f "dist/service-worker.js" ]]; then
aws s3 cp "dist/service-worker.js" s3://${S3_BUCKET}/service-worker.js \
    --cache-control "no-cache" --acl "public-read"
fi

# invalidate the CloudFront cache for the index page

aws configure set preview.cloudfront true

aws cloudfront create-invalidation \
    --distribution-id ${CLOUDFRONT_ID} --paths /index.html /

# upload the source maps for this release to Sentry

sentry-cli releases new --finalize "$SENTRY_RELEASE"
sentry-cli releases deploys "$SENTRY_RELEASE" new -e ${CI_ENVIRONMENT_NAME} -n ${CI_ENVIRONMENT_NAME}
sentry-cli releases files "$SENTRY_RELEASE" upload-sourcemaps dist/js
