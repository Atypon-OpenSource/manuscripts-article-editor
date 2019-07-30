FROM node:8-alpine AS builder

WORKDIR /app

# dependencies

RUN apk add --no-cache git openssh

# install

COPY .yarnrc package.json yarn.lock /app/

ARG YARN_CACHE_FOLDER=/cache/yarn

RUN yarn install --frozen-lockfile --non-interactive --production

# build

COPY tsconfig.json /app/
COPY babel.config.js /app/
COPY webpack.common.ts webpack.prod.ts /app/
COPY public /app/public
COPY types /app/types
COPY src /app/src

ARG API_APPLICATION_ID
ARG API_BASE_URL
ARG BASE_URL
ARG CRISP_WEBSITE_ID
ARG DATA_URL
ARG DERIVED_DATA_BUCKET
ARG DISCOURSE_HOST
ARG GIT_COMMIT_HASH
ARG GIT_VERSION
ARG GOOGLE_ANALYTICS_ID
ARG JUPYTER_URL
ARG JUPYTER_TOKEN
ARG PROJECTS_BUCKET
ARG SENTRY_PUBLIC_DSN
ARG SERVICEWORKER_ENABLED
ARG SYNC_GATEWAY_URL
ARG WAYF_URL
ARG WAYF_KEY

RUN yarn build

# serve

FROM nginx:stable-alpine

COPY docker/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
