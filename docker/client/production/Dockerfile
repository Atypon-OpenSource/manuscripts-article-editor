FROM node:8 AS builder

WORKDIR /app

# install

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

ARG YARN_CACHE_FOLDER=/cache/yarn

RUN yarn install --frozen-lockfile --non-interactive --production

# build

COPY tsconfig.json /app/tsconfig.json
COPY tsconfig.build.json /app/tsconfig.build.json
COPY webpack.common.js /app/webpack.common.js
COPY webpack.prod.js /app/webpack.prod.js
COPY public /app/public
COPY src /app/src

ARG API_APPLICATION_ID="io.manuscripts"
ARG API_BASE_URL="http://127.0.0.1:3000/api/v1"
ARG CSL_DATA_URL="http://127.0.0.1:3002/"
ARG SYNC_GATEWAY_URL="http://127.0.0.1:4984/"
ARG SENTRY_PUBLIC_DSN

RUN yarn build

# serve

FROM nginx:alpine

COPY docker/production/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
