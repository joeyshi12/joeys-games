# platform-party

A real-time multiplayer browser platformer made with p5.

Live demo hosted on fly.io!
- Recommended to use a Chromium based browser when playing

<a href="https://platform-party.fly.dev/">
    <img src="./assets/join_game.png" width=120 alt="platform-party"/>
</a>


![Platform Party](./assets/snapshot.png)


## Running with docker
```
docker pull joeyshi12/platform-party
docker run -p 5000:8080 joeyshi12/platform-party
```
*connect with url localhost:5000*


## Running source code
```bash
yarn install && npm run heroku-postbuild
node dist/src/app.js
```
*connect with url localhost:8080*
