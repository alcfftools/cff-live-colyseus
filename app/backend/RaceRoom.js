"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaceRoom = void 0;
const colyseus_1 = require("colyseus");
const GameState_1 = require("../state/GameState");
const Player_1 = require("./Player");
const riders = __importStar(require("./riders.json"));
const NUM_TURNS = 10;
const INIT_TURN_TIME = 60; //seconds
class RaceRoom extends colyseus_1.Room {
    constructor() {
        super();
        this.loopFunction = () => {
            this.state.turn_time--;
            if (this.state.turn_time == 0) {
                if (this.state.sector < NUM_TURNS) {
                    this.state.sector += 1;
                    console.log(this.state);
                    //TODO: Do the logic
                }
                else {
                    //TODO: Finish race
                    this.stopGameLoop();
                }
                this.state.turn_time = INIT_TURN_TIME;
            }
        };
        this.playerMap = new Map();
    }
    roomHasMaster() {
        for (const player of this.playerMap.values()) {
            if (player.isMaster()) {
                return true;
            }
        }
        return false;
    }
    startGameLoop() {
        const loopInterval = 1000; // Each second
        this.gameLoop = this.clock.setInterval(this.loopFunction, loopInterval);
    }
    stopGameLoop() {
        this.gameLoop.clear();
        this.setState(new GameState_1.GameState(INIT_TURN_TIME));
    }
    restartGameLoop() {
        this.stopGameLoop();
        this.startGameLoop();
    }
    onCreate(options) {
        this.setState(new GameState_1.GameState(INIT_TURN_TIME));
        this.onMessage("ready", (client, message) => {
            if (this.playerMap.has(client.id)) {
                this.playerMap.get(client.id).isReady = message.isReady;
            }
            if (this.roomHasMaster()) { //&& this.allPlayersReady()) {
                this.state.running = true;
                this.startGameLoop();
            }
        });
        colyseus_1.updateLobby(this);
    }
    onJoin(client, options) {
        if (this.state.sector == 0) {
            let rider = new Player_1.Rider(riders[this.playerMap.size]);
            if (!this.playerMap.size) {
                const playerType = Player_1.PlayerType.MASTER;
                this.playerMap.set(client.id, new Player_1.Player(client.id, true, playerType, rider));
            }
            else {
                if (this.roomHasMaster()) {
                    this.playerMap.set(client.id, new Player_1.Player(client.id, true, Player_1.PlayerType.MASTER, rider));
                    // TODO: Let master start the race
                    this.state.running = true;
                }
                else {
                    this.playerMap.set(client.id, new Player_1.Player(client.id, true, Player_1.PlayerType.PLAYER, rider));
                }
            }
        }
        else {
            const playerType = Player_1.PlayerType.MASTER;
            this.spectatorMap.set(client.id, new Player_1.Player(client.id, true, playerType, null));
        }
    }
    onLeave(client, consented) {
        this.playerMap.delete(client.id);
    }
    onDispose() {
    }
}
exports.RaceRoom = RaceRoom;
//# sourceMappingURL=RaceRoom.js.map