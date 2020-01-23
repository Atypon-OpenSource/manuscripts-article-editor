FROM node:8-alpine AS builder

WORKDIR /app

# install

COPY package.json yarn.lock ./

ARG YARN_CACHE_FOLDER=/cache/yarn

RUN yarn install --frozen-lockfile --non-interactive --production

# build

COPY tsconfig.json ./
COPY babel.config.js ./
COPY webpack.common.ts webpack.prod.ts environment-variables.ts ./
COPY public ./public
COPY types ./types
COPY src ./src

ARG API_APPLICATION_ID
ARG API_BASE_URL
ARG BASE_URL
ARG BEACON_HTTP_URL
ARG BEACON_WS_URL
ARG CRISP_WEBSITE_ID
ARG DATA_URL
ARG DERIVED_DATA_BUCKET
ARG DISCOURSE_HOST
ARG ENABLE_CONNECT_LOGIN_OPTION
ARG EXPORT_LITERATUM
ARG GIT_COMMIT_HASH
ARG GIT_VERSION
ARG GOOGLE_ANALYTICS_ID
ARG IAM_BASE_URL
ARG JUPYTER_URL
ARG JUPYTER_TOKEN
ARG PROJECTS_BUCKET
ARG SENTRY_PUBLIC_DSN
ARG SERVICEWORKER_ENABLED
ARG SYNC_GATEWAY_URL

RUN ALLOW_MISSING_VARIABLES=1 yarn build

# serve

FROM nginx:stable-alpine

COPY docker/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
