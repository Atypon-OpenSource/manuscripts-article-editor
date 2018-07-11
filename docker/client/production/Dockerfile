FROM node:8-alpine AS builder

WORKDIR /app

# install

COPY package.json yarn.lock /app/

ARG YARN_CACHE_FOLDER=/cache/yarn

RUN mkdir -p ~/.ssh && \
    ssh-keyscan -t rsa gitlab.com >> ~/.ssh/known_hosts && \
    chmod 0700 ~/.ssh
COPY deploy/id_rsa_manuscript_gfx_assets_deploy /root/.ssh/id_rsa
RUN chmod 600 ~/.ssh/id_rsa

RUN yarn install --frozen-lockfile --non-interactive --production

# build

COPY tsconfig.json tsconfig.build.json /app/
COPY webpack.common.js webpack.prod.js /app/
COPY public /app/public
COPY src /app/src

RUN yarn build

# serve

FROM nginx:alpine

COPY docker/production/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
