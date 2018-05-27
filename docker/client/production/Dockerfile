FROM node:8-alpine AS builder

WORKDIR /app

# install

COPY package.json yarn.lock /app/

ARG YARN_CACHE_FOLDER=/cache/yarn

RUN yarn install --frozen-lockfile --non-interactive --production

# build

COPY tsconfig.json tsconfig.build.json /app/
COPY webpack.common.js webpack.prod.js /app/
COPY public /app/public
COPY src /app/src

ARG API_APPLICATION_ID="io.manuscripts"
ARG API_BASE_URL="http://127.0.0.1:3000/api/v1"
ARG CSL_DATA_URL="http://127.0.0.1:3002/"
ARG SYNC_GATEWAY_URL="http://127.0.0.1:4984/"
ARG SENTRY_PUBLIC_DSN
ARG WAYF_CLOUD_BASE_URL="https://wayf-cloud-sandbox.literatumonline.com"
ARG WAYF_CLOUD_AUTH_HEADER_KEY='Authorization'
ARG WAYF_CLOUD_AUTHORIZATION_HEADER_VALUE='Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwdWJsaXNoZXJDb2RlIjoib2hteWo3UUF6In0.LbkczXtG7zxYVl9V0KdOIfoErCoWoMH78Ot9INtdBto'
ARG WAYF_CLOUD_ID_REQUIRED=1

RUN yarn build

# serve

FROM nginx:alpine

COPY docker/production/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
