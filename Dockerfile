FROM node:24-alpine

WORKDIR /app

COPY public .

ENV DB_PATH=/data/db.sqlite3
VOLUME ["/data"]

RUN apk add --no-cache su-exec \
    && chown -R node:node /app

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
