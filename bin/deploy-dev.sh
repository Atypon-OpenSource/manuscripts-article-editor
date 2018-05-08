#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DISTRIBUTION_ID=${APP_CLOUDFRONT_ID_DEV} BUCKET_NAME=${APP_S3_BUCKET_DEV} ${DIR}/deploy.sh