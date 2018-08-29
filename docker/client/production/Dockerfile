FROM node:8-alpine AS builder

WORKDIR /app

# dependencies

RUN apk add --no-cache git openssh

# install

COPY .yarnrc package.json yarn.lock /app/

ARG YARN_CACHE_FOLDER=/cache/yarn

RUN mkdir -p ~/.ssh && \
    ssh-keyscan -t rsa gitlab.com >> ~/.ssh/known_hosts && \
    chmod 0700 ~/.ssh
COPY deploy/id_rsa_manuscript_gfx_assets_deploy /root/.ssh/id_rsa
RUN chmod 600 ~/.ssh/id_rsa

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
