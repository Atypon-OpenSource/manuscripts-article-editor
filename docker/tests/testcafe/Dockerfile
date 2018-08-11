FROM testcafe/testcafe

USER root

RUN apk add --no-cache curl

RUN cd /opt/testcafe && npm install faker

COPY docker/tests/testcafe/testcafe-docker.sh /opt/testcafe/docker/testcafe-docker.sh
COPY docker/tests/testcafe/wait-for-client.sh /opt/testcafe/docker/wait-for-client.sh
RUN  chmod ugo+x /opt/testcafe/docker/wait-for-client.sh

USER user
ENV NODE_PATH=/opt:/opt/testcafe/node_modules

COPY ./testcafe-tests/ /testcafe-tests/

ENTRYPOINT ["/opt/testcafe/docker/testcafe-docker.sh"]
