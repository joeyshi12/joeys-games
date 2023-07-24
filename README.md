# platform-party

A real-time multiplayer browser platformer made with the
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas">canvas scripting API</a>.

Live demo hosted on a Raspberry Pi.

<a href="https://platform-party.joeyshi.xyz">
    <img src="./images/join_game.png" width=178 alt="platform-party"/>
</a>


![Platform Party](./images/snapshot.png)


## Running with docker
```bash
docker pull joeyshi12/platform-party
docker run -ti -p 5000:8080 joeyshi12/platform-party
```
*connect with url localhost:5000*


## Running source code
```bash
npm install
node dist/server.js
```
*connect with url localhost:8080*
