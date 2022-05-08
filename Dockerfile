FROM node:16.13.1

COPY . .
RUN yarn install
RUN npm run heroku-postbuild

WORKDIR /dist

ENV PORT=8080
EXPOSE 8080
CMD ["node", "src/app.js"]
