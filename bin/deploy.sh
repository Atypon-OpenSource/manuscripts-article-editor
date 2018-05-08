#!/bin/bash

set -e

yarn install
yarn build

# Run this in your Hugo blog repo directory

# These are mine. They won't work for you :)
PROFILE=default # or `default` if you don't use profiles

# enable experimental AWS cli cloudfront support
aws configure set preview.cloudfront true

# Copy over pages - not static js/img/css/downloads
aws s3 sync --include "*" --cache-control "max-age=2592000" --acl "public-read" --sse "AES256" dist/ s3://${BUCKET_NAME}

# Invalidate landing page so everything sees new post - warning, first 1K/mo free, then 1/2 cent each
aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths /index.html /