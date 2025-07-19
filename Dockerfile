FROM node:24-alpine

WORKDIR /app

COPY public .

CMD ["node", "server.js"]
