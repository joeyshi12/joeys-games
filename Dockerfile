FROM node:16.13.1

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

WORKDIR /tmp
COPY . .
RUN npm install && mv dist /dist && mv node_modules /dist
WORKDIR /dist
RUN rm -rf /tmp

CMD ["node", "app.js"]
