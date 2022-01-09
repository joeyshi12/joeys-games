# platform-party

A real-time multiplayer browser platformer made with p5.

<a href=https://platform-party.herokuapp.com/>
    <img src="./assets/join_game.png" width=120/>
</a>

*there may be a delay before you are able to enter the game page since Heroku goes into sleep mode whenever the deployment is inactive for over 1 hour*

![Platform Party](./assets/snapshot.png)

## How to run locally
```bash
# install dependencies for server and client with yarn
yarn install && cd web && yarn install

# build the client in watch mode
npm run watch

# escape with Ctrl-c or from a different window, start server
cd .. && node dist/src/app.js
```
