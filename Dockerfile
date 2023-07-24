FROM node:16.13.1

ENV SERVER_URL=https://platform-party.joeyshi.xyz
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

WORKDIR /tmp
COPY . .
RUN npm install --dev && npm run build && mv dist /dist
WORKDIR /dist
RUN rm -rf /tmp

CMD ["node", "server.js"]
