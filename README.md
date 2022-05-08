# platform-party

A real-time multiplayer browser platformer made with p5.

Live demo hosted on Heroku!
- Recommended to use a Chromium based browser when playing
- There may be a delay before you enter the page because Heroku enters sleep mode when the deployment is inactive for over 1 hour

<a href=https://platform-party.herokuapp.com/>
    <img src="./assets/join_game.png" width=120 alt="platform-party"/>
</a>


![Platform Party](./assets/snapshot.png)


## Running with docker
```bash
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
