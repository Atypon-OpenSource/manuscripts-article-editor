FROM node:8-alpine

WORKDIR /app

# dependencies

RUN apk add --no-cache git openssh

# install

COPY .yarnrc package.json yarn.lock /app/

ARG PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ARG YARN_CACHE_FOLDER=/cache/yarn

RUN yarn install --frozen-lockfile --non-interactive

# start

COPY tsconfig.json /app/
COPY babel.config.js /app/
COPY webpack.common.ts webpack.dev.ts /app/
COPY public /app/public
COPY types /app/types
COPY src /app/src

EXPOSE 8080

CMD yarn start --host 0.0.0.0 --public $PUBLIC_HOST
