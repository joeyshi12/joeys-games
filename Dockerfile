FROM node:16.13.1

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

WORKDIR /tmp
COPY . .
RUN npm install && npm run build && mv dist /dist
WORKDIR /dist
RUN rm -rf /tmp

CMD ["node", "server.js"]
