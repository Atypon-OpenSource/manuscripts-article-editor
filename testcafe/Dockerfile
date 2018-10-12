FROM testcafe/testcafe

USER root

RUN apk add --no-cache curl

RUN cd /opt/testcafe && npm install faker

COPY scripts/entrypoint.sh /opt/testcafe/scripts/entrypoint.sh
COPY scripts/wait-for-client.sh /opt/testcafe/scripts/wait-for-client.sh
RUN chmod ugo+x /opt/testcafe/scripts/wait-for-client.sh

USER user

ENV NODE_PATH=/opt:/opt/testcafe/node_modules

COPY tests/ /testcafe-tests/

ENTRYPOINT ["/opt/testcafe/scripts/entrypoint.sh"]
