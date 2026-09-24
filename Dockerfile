FROM node:24-alpine

WORKDIR /app

COPY public .

# waldo-royale is not built here. It publishes its site as a release asset, and this unpacks a
# pinned one into the path Caddy used to mount a separate container at. The checksum is verified
# because an external download is being baked into a production image.
ARG WALDO_ROYALE_VERSION=0.5.1
ARG WALDO_ROYALE_SHA256=81c1a28260a33ae65f2a5d076cd3a9aadc12c52d84ffdc6395058448025ab92c
RUN set -eu; \
    mkdir -p web/waldo-royale; \
    wget -qO /tmp/waldo.tgz \
      "https://github.com/joeyshi12/waldo-royale/releases/download/v${WALDO_ROYALE_VERSION}/site.tar.gz"; \
    echo "${WALDO_ROYALE_SHA256}  /tmp/waldo.tgz" | sha256sum -c -; \
    tar xzf /tmp/waldo.tgz -C web/waldo-royale; \
    rm /tmp/waldo.tgz

ENV DB_PATH=/data/db.sqlite3
VOLUME ["/data"]

RUN apk add --no-cache su-exec \
    && chown -R node:node /app

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
