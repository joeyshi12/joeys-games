FROM node:24-alpine

WORKDIR /app

COPY public .

# waldo-royale is not built here. It publishes its site as a release asset, and this unpacks a
# pinned one into the path Caddy used to mount a separate container at. The checksum is verified
# because an external download is being baked into a production image.
ARG WALDO_ROYALE_VERSION=0.5.2
ARG WALDO_ROYALE_SHA256=6fe59d85a2d437e8bea95882db9902af9a6c01b4cbf880e830a2793a36aadf3e
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
