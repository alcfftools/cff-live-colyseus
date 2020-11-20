var http = require('http');
var path = require('path');
import express from "express";
import cors from "cors";
var fs = require('fs');

import {LobbyRoom, Server} from "colyseus";
import {monitor} from "@colyseus/monitor";

import {RaceRoom} from "./RaceRoom";
import {join} from "path";

const PORT = Number(process.env.PORT || 25671);
const app = express()

const staticPath = join(__dirname, '../frontend/cff-live/dist/cff-live');
//app.use(express.static(process.cwd()+"/my-app/dist/angular-nodejs-example/"));
console.log(`Using static path '${staticPath}'`);
app.set('port', PORT);
app.use('/', express.static(staticPath));

// Routing
// app.get('/', function(request, response) {
//     response.sendFile(path.join(staticPath, 'index.html'));
//   });

app.use(cors());
app.use(express.json())


var server = http.Server(app);
const gameServer = new Server({
    server,
});

// Define "lobby" room
gameServer.define("lobby", LobbyRoom);



// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor());

app.put('/rooms/:room', function(req,res){
    // register our RaceRoom
    // TODO: Do this handling the "new room request"
    var room  = req.params.room;
    gameServer.define(room, RaceRoom)
        .enableRealtimeListing();
    res.status(200).send({});
});

gameServer.listen(PORT);
console.log(`Listening on ws://localhost:${PORT}`)
