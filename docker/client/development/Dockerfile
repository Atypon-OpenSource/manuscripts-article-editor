FROM node:8-alpine

WORKDIR /app

# install

COPY package.json yarn.lock /app/

ARG PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ARG YARN_CACHE_FOLDER=/cache/yarn

RUN npm config set registry https://registry.npmjs.org/
RUN yarn install --frozen-lockfile --non-interactive

# start

COPY tsconfig.json /app/
COPY webpack.common.js webpack.dev.js /app/
COPY public /app/public
COPY src /app/src

EXPOSE 8080

CMD ["yarn", "start"]
