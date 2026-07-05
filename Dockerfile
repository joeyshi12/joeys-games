FROM node:24-alpine

WORKDIR /app

COPY public .

ENV DB_PATH=/data/db.sqlite3
VOLUME ["/data"]

# Set owner of app files to non-root node user
RUN mkdir -p /data \
    && chown -R node:node /app /data

USER node

CMD ["node", "server.js"]
