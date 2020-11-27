var http = require('http');
var path = require('path');
import express from "express";
import cors from "cors";
var fs = require('fs');

import {LobbyRoom, Server} from "colyseus";
import {monitor} from "@colyseus/monitor";

import {RaceRoom} from "./RaceRoom";
import {join} from "path";

const PORT = Number(process.env.PORT || 25670);
const app = express()

const staticPath = join(__dirname, '../public');
//app.use(express.static(process.cwd()+"/my-app/dist/angular-nodejs-example/"));
console.log(`Using static path '${staticPath}'`);
app.set('port', PORT);
app.use('/', express.static(staticPath));

app.get('/config')

app.use(cors());
app.use(express.json())


var server = http.Server(app);
const gameServer = new Server({
    server,
});

// Define "lobby" room
gameServer.define("lobby", LobbyRoom);

gameServer.define('races', RaceRoom)
        .enableRealtimeListing();


// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor());

gameServer.listen(PORT);
console.log(`Listening on ws://localhost:${PORT}`)
