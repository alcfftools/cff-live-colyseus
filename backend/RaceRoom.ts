import {Client, Delayed, Room, updateLobby } from "colyseus";
import {Schema, ArraySchema, } from "@colyseus/schema";

import {GameState} from "../state/GameState";
import {Player, PlayerType, Rider} from "./Player";
import {ReadyState} from "../messages/readystate";

import * as riders from './riders.json';
import { Stage, TERRAIN_TYPE } from "./Stage";
import { Classification, PlayerValue } from "../state/Classification";


const INIT_TURN_TIME = 10; //seconds

export class RaceRoom extends Room<GameState> {

    private playerMap: Map<string, Player>;
    private spectatorMap: Map<string, Player>;
    private gameLoop: Delayed;
    private stage: Stage;
    private numSectors: number;
    private classification: ArraySchema<Classification>;
    private sector_class : Classification;
    

    constructor() {
        super();
        this.playerMap = new Map<string, Player>(); 
        this.stage = new Stage({
            Stamina : 18,
            Sprint : 1,
            Climbing : 43,
            Flat : 0.5,
            Technique : 9.5,
            Downhill : 25.5,
            Teamwork : 2.5,
            Experience : 3
        });
        this.stage.Sectors = [TERRAIN_TYPE.CLIMB, TERRAIN_TYPE.DOWN, TERRAIN_TYPE.CLIMB, TERRAIN_TYPE.CLIMB, TERRAIN_TYPE.CLIMB];
        this.numSectors = this.stage.Sectors.length;
        this.classification = new ArraySchema<Classification>();
        this.sector_class = new Classification();
    }

    private loopFunction = () => {
        this.state.turn_time--;
        if(this.state.turn_time == 0){
            if(this.state.sector < this.numSectors){
                //TODO: Do the logic
                this.computeSectorValues(this.stage.Sectors[this.state.sector]);
                let ordered = this.sector_class.order();
                let class_sector = new Classification();
                class_sector.playerValues = new ArraySchema();
                class_sector.playerValues = new ArraySchema(...ordered);
                this.classification.push(class_sector);
                this.state.classification = this.classification;
                this.state.sector += 1;
                console.log(this.state);    
            } else {
                //TODO: Finish race
                this.stopGameLoop();
            }
            this.state.turn_time = INIT_TURN_TIME;
        }
    }

    private roomHasMaster(): boolean {
        for (const player of this.playerMap.values()) {
            if (player.isMaster()) {
                return true;
            }
        }
        return false;
    }
    
    private startGameLoop() {
        this.setState(new GameState(INIT_TURN_TIME));
        const loopInterval = 1000; // Each second
        this.gameLoop = this.clock.setInterval(this.loopFunction, loopInterval);
    }

    private stopGameLoop() {
        this.gameLoop.clear();
    }

    private restartGameLoop() {
        this.stopGameLoop();
        this.startGameLoop();
    }

    private computeSectorValues(type: TERRAIN_TYPE){
        this.sector_class = new Classification();
        this.playerMap.forEach( 
            (player) => {
                let effort = this.playerMap.get(player.id).getStrategy();
                let rider = player.getRider();
                let globalSectorValue = 0.5 * this.computeGlobalValue(this.stage, rider) + 0.5 * this.computeSectorSpecificValue(type, player.getStrategy(), rider);
                this.sector_class.playerValues.push( new PlayerValue(rider.Name, globalSectorValue));
            }
        );
    }

    private computeGlobalValue(stage: Stage, rider: Rider) : number {
        let val = 
            (stage.Aggressiveness * rider.Aggressiveness +
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
            stage.TimeTrial * rider.TimeTrial)/100;
        return val;
    }
    
    private computeSectorSpecificValue(type:TERRAIN_TYPE, effort : number, rider: Rider){
        switch(type){
            case TERRAIN_TYPE.CLIMB:
                return effort * rider.Climbing / 100;
                break;
            case TERRAIN_TYPE.FLAT:
                return effort * rider.Flat / 100;
                break;
            case TERRAIN_TYPE.HILL:
                return effort * rider.Hills / 100;
                break;
            case TERRAIN_TYPE.COBBLE:
                return effort * rider.Cobblestone / 100;
                break;
            case TERRAIN_TYPE.DOWN:
                return effort * rider.Downhill / 100;
                break;
        }
    }

    onCreate(options: any) {
        this.setState(new GameState(INIT_TURN_TIME));

        this.onMessage("ready", (client, message: ReadyState) => {
            if (this.playerMap.has(client.id)) {
                this.playerMap.get(client.id).isReady = message.isReady;
            }

            if (this.roomHasMaster() ){ //&& this.allPlayersReady()) {
                this.state.running = true;
                this.startGameLoop();
            }
        });

        this.onMessage("strategy", (client, message: number) => {
            this.playerMap.get(client.id).setStrategy(message);
        });
        updateLobby(this);
    }

    onJoin(client: Client, options: any) {
        if(this.state.sector == 0){
            let rider = new Rider(riders[this.playerMap.size])
            if (!this.playerMap.size) {
                const playerType = PlayerType.MASTER;
                this.playerMap.set(client.id, new Player(client.id, true, playerType, rider, 60));
            } else {
                if (this.roomHasMaster()) {
                    this.playerMap.set(client.id, new Player(client.id, true, PlayerType.MASTER, rider, 60));
                    // TODO: Let master start the race
                    this.state.running = true;
                } else {
                    this.playerMap.set(client.id, new Player(client.id, true, PlayerType.PLAYER, rider, 60));
                }
            }
            if (options.name){
                this.state.players.set(options.name, rider.Name);
            }
            client.send("initializeRider", rider);
        }else {
            const playerType = PlayerType.MASTER;
            this.spectatorMap.set(client.id, new Player(client.id, true, playerType, null, 0));
        }
    }

    onLeave(client: Client, consented: boolean) {
        this.playerMap.delete(client.id);
    }

    onDispose() {
    }
}
