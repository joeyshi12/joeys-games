FROM node:24-alpine

WORKDIR /app

COPY public .

ENV DB_PATH=/data/db.sqlite3
VOLUME ["/data"]

RUN addgroup -g 1000 appuser \
    && adduser -D -u 1000 -G appuser -h /home/appuser appuser \
    && mkdir -p /data \
    && chown -R appuser:appuser /app /data

USER appuser

CMD ["node", "server.js"]
