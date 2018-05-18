FROM node:8

WORKDIR /app

# install

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

ARG PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ARG YARN_CACHE_FOLDER=/cache/yarn

RUN yarn install --frozen-lockfile --non-interactive

# start

COPY tsconfig.json /app/tsconfig.json
COPY webpack.common.js /app/webpack.common.js
COPY webpack.dev.js /app/webpack.dev.js
COPY public /app/public
COPY src /app/src

EXPOSE 8080

CMD ["yarn", "start"]
