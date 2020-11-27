"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = require('http');
var path = require('path');
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
var fs = require('fs');
const colyseus_1 = require("colyseus");
const monitor_1 = require("@colyseus/monitor");
const RaceRoom_1 = require("./RaceRoom");
const path_1 = require("path");
const PORT = Number(process.env.PORT || 25670);
const app = express_1.default();
app.use(cors_1.default());
const staticPath = path_1.join(__dirname, '../public');
//app.use(express.static(process.cwd()+"/my-app/dist/angular-nodejs-example/"));
console.log(`Using static path '${staticPath}'`);
app.set('port', PORT);
app.use('/', express_1.default.static(staticPath));
app.get('/config');
app.use(express_1.default.json());
var server = http.Server(app);
const gameServer = new colyseus_1.Server({
    server,
});
// Define "lobby" room
gameServer.define("lobby", colyseus_1.LobbyRoom);
gameServer.define('races', RaceRoom_1.RaceRoom)
    .enableRealtimeListing();
// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor_1.monitor());
gameServer.listen(PORT);
console.log(`Listening on ws://localhost:${PORT}`);
//# sourceMappingURL=index.js.map