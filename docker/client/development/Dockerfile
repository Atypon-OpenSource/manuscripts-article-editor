FROM node:8-alpine

WORKDIR /app

# dependencies

RUN apk --no-cache git openssh

# install

COPY package.json yarn.lock /app/

ARG PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ARG YARN_CACHE_FOLDER=/cache/yarn

RUN mkdir -p ~/.ssh && \
    ssh-keyscan -t rsa gitlab.com >> ~/.ssh/known_hosts && \
    chmod 0700 ~/.ssh
COPY deploy/id_rsa_manuscript_gfx_assets_deploy /root/.ssh/id_rsa
RUN chmod 600 ~/.ssh/id_rsa

RUN npm config set registry https://registry.npmjs.org/
RUN yarn install --frozen-lockfile --non-interactive

# start

COPY tsconfig.json /app/
COPY webpack.common.js webpack.dev.js /app/
COPY public /app/public
COPY src /app/src

EXPOSE 8080

CMD ["yarn", "start"]
