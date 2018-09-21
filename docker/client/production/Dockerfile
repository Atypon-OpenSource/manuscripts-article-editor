FROM node:8-alpine AS builder

WORKDIR /app

# dependencies

RUN apk add --no-cache git openssh

# install

COPY .yarnrc package.json yarn.lock /app/

ARG YARN_CACHE_FOLDER=/cache/yarn

ARG NPM_TOKEN
RUN npm config set always-auth true
RUN npm config set '//atypon-npm-registry.herokuapp.com/:_authToken' ${NPM_TOKEN}
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
ARG DATA_URL
ARG GIT_COMMIT_HASH
ARG GIT_VERSION
ARG PROJECTS_BUCKET
ARG SENTRY_PUBLIC_DSN
ARG SERVICEWORKER_ENABLED
ARG SYNC_GATEWAY_URL
ARG WAYF_URL
ARG WAYF_KEY

RUN yarn build

# serve

FROM nginx:stable-alpine

COPY docker/client/production/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
