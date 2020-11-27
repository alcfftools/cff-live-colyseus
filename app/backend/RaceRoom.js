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
const schema_1 = require("@colyseus/schema");
const GameState_1 = require("../state/GameState");
const Player_1 = require("./Player");
const riders = __importStar(require("./riders.json"));
const Stage_1 = require("./Stage");
const Classification_1 = require("../state/Classification");
const INIT_TURN_TIME = 10; //seconds
class RaceRoom extends colyseus_1.Room {
    constructor() {
        super();
        this.loopFunction = () => {
            this.state.turn_time--;
            if (this.state.turn_time == 0) {
                if (this.state.sector < this.numSectors) {
                    //TODO: Do the logic
                    this.computeSectorValues(this.stage.Sectors[this.state.sector]);
                    let ordered = this.sector_class.order();
                    let class_sector = new Classification_1.Classification();
                    class_sector.playerValues = new schema_1.ArraySchema();
                    class_sector.playerValues = new schema_1.ArraySchema(...ordered);
                    this.classification.push(class_sector);
                    this.state.classification = this.classification;
                    this.state.sector += 1;
                    console.log(this.state);
                }
                else {
                    //TODO: Finish race
                    this.stopGameLoop();
                }
                this.state.turn_time = INIT_TURN_TIME;
            }
        };
        this.playerMap = new Map();
        this.stage = new Stage_1.Stage({
            Stamina: 18,
            Sprint: 1,
            Climbing: 43,
            Flat: 0.5,
            Technique: 9.5,
            Downhill: 25.5,
            Teamwork: 2.5,
            Experience: 3
        });
        this.stage.Sectors = [Stage_1.TERRAIN_TYPE.CLIMB, Stage_1.TERRAIN_TYPE.DOWN, Stage_1.TERRAIN_TYPE.CLIMB, Stage_1.TERRAIN_TYPE.CLIMB, Stage_1.TERRAIN_TYPE.CLIMB];
        this.numSectors = this.stage.Sectors.length;
        this.classification = new schema_1.ArraySchema();
        this.sector_class = new Classification_1.Classification();
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
        this.setState(new GameState_1.GameState(INIT_TURN_TIME));
        const loopInterval = 1000; // Each second
        this.gameLoop = this.clock.setInterval(this.loopFunction, loopInterval);
    }
    stopGameLoop() {
        this.gameLoop.clear();
    }
    restartGameLoop() {
        this.stopGameLoop();
        this.startGameLoop();
    }
    computeSectorValues(type) {
        this.sector_class = new Classification_1.Classification();
        this.playerMap.forEach((player) => {
            let effort = this.playerMap.get(player.id).getStrategy();
            let rider = player.getRider();
            let globalSectorValue = 0.5 * this.computeGlobalValue(this.stage, rider) + 0.5 * this.computeSectorSpecificValue(type, player.getStrategy(), rider);
            this.sector_class.playerValues.push(new Classification_1.PlayerValue(rider.Name, globalSectorValue));
        });
    }
    computeGlobalValue(stage, rider) {
        let val = (stage.Aggressiveness * rider.Aggressiveness +
            stage.Climbing * rider.Climbing +
            stage.Cobblestone * rider.Cobblestone +
            stage.Downhill * rider.Downhill +
            stage.Experience * rider.Experience +
            stage.Flat * rider.Flat +
            stage.Hills * rider.Hills +
            stage.Sprint * rider.Sprint +
            stage.Stamina * rider.Stamina +
            stage.Teamwork * rider.Teamwork +
            stage.Technique * rider.Technique +
            stage.TimeTrial * rider.TimeTrial) / 100;
        return val;
    }
    computeSectorSpecificValue(type, effort, rider) {
        switch (type) {
            case Stage_1.TERRAIN_TYPE.CLIMB:
                return effort * rider.Climbing / 100;
                break;
            case Stage_1.TERRAIN_TYPE.FLAT:
                return effort * rider.Flat / 100;
                break;
            case Stage_1.TERRAIN_TYPE.HILL:
                return effort * rider.Hills / 100;
                break;
            case Stage_1.TERRAIN_TYPE.COBBLE:
                return effort * rider.Cobblestone / 100;
                break;
            case Stage_1.TERRAIN_TYPE.DOWN:
                return effort * rider.Downhill / 100;
                break;
        }
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
        this.onMessage("strategy", (client, message) => {
            this.playerMap.get(client.id).setStrategy(message);
        });
        colyseus_1.updateLobby(this);
    }
    onJoin(client, options) {
        if (this.state.sector == 0) {
            let rider = new Player_1.Rider(riders[this.playerMap.size]);
            if (!this.playerMap.size) {
                const playerType = Player_1.PlayerType.MASTER;
                this.playerMap.set(client.id, new Player_1.Player(client.id, true, playerType, rider, 60));
            }
            else {
                if (this.roomHasMaster()) {
                    this.playerMap.set(client.id, new Player_1.Player(client.id, true, Player_1.PlayerType.MASTER, rider, 60));
                    // TODO: Let master start the race
                    this.state.running = true;
                }
                else {
                    this.playerMap.set(client.id, new Player_1.Player(client.id, true, Player_1.PlayerType.PLAYER, rider, 60));
                }
            }
            if (options.name) {
                this.state.players.set(options.name, rider.Name);
            }
            client.send("initializeRider", rider);
        }
        else {
            const playerType = Player_1.PlayerType.MASTER;
            this.spectatorMap.set(client.id, new Player_1.Player(client.id, true, playerType, null, 0));
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