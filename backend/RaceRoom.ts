import {Client, Delayed, Room, updateLobby } from "colyseus";
import {GameState} from "../state/GameState";
import {Player, PlayerType, Rider} from "./Player";
import {ReadyState} from "../messages/readystate";

import * as riders from './riders.json';


const NUM_TURNS = 10;
const INIT_TURN_TIME = 60; //seconds

export class RaceRoom extends Room<GameState> {

    private playerMap: Map<string, Player>;
    private spectatorMap: Map<string, Player>;

    private gameLoop: Delayed;

    constructor() {
        super();
        this.playerMap = new Map<string, Player>(); 
    }

    private loopFunction = () => {
        this.state.turn_time--;
        if(this.state.turn_time == 0){
            if(this.state.sector < NUM_TURNS){
                this.state.sector += 1;
                console.log(this.state);       
                //TODO: Do the logic
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
        const loopInterval = 1000; // Each second
        this.gameLoop = this.clock.setInterval(this.loopFunction, loopInterval);
    }

    private stopGameLoop() {
        this.gameLoop.clear();
        this.setState(new GameState(INIT_TURN_TIME));
    }

    private restartGameLoop() {
        this.stopGameLoop();
        this.startGameLoop();
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
        updateLobby(this);
    }

    onJoin(client: Client, options: any) {
        if(this.state.sector == 0){
            let rider = new Rider(riders[this.playerMap.size])
            if (!this.playerMap.size) {
                const playerType = PlayerType.MASTER;
                this.playerMap.set(client.id, new Player(client.id, true, playerType, rider));
            } else {
                if (this.roomHasMaster()) {
                    this.playerMap.set(client.id, new Player(client.id, true, PlayerType.MASTER, rider));
                    // TODO: Let master start the race
                    this.state.running = true;
                } else {
                    this.playerMap.set(client.id, new Player(client.id, true, PlayerType.PLAYER, rider));
                }
            }
            
        }else {
            const playerType = PlayerType.MASTER;
            this.spectatorMap.set(client.id, new Player(client.id, true, playerType, new Rider()));
        }
    }

    onLeave(client: Client, consented: boolean) {
        this.playerMap.delete(client.id);
    }

    onDispose() {
    }
}
