import {Client, Delayed, Room, updateLobby } from "colyseus";
import {GameState} from "../state/GameState";
import {Player, PlayerType} from "./Player";
import {ReadyState} from "../messages/readystate";

export class RaceRoom extends Room<GameState> {

    private playerMap: Map<string, Player>;

    private gameLoop!: Delayed;

    constructor() {
        super();
        this.playerMap = new Map<string, Player>(); 
    }

    private loopFunction = () => {
        this.state.turn += 1;
        console.log(this.state);        
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
    }

    private restartGameLoop() {
        this.stopGameLoop();
        this.startGameLoop();
    }

    // private allPlayersReady(): boolean {
    //     for (const player of this.playerMap.values()) {
    //         if (!player.isReady) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    onCreate(options: any) {
        this.setState(new GameState());

        this.onMessage("move", (client, message: Movement) => {
            
        });
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
        if (!this.playerMap.size) {
            const playerType = Math.random() >= 0.5 ? PlayerType.MASTER : PlayerType.PLAYER;
            this.playerMap.set(client.id, new Player(client.id, true, playerType));
        } else {
            if (this.roomHasMaster()) {
                this.playerMap.set(client.id, new Player(client.id, true, PlayerType.MASTER));
                // TODO: Let master start the race
                this.state.running = true;
            } else {
                this.playerMap.set(client.id, new Player(client.id, true, PlayerType.PLAYER));
            }
        }
    }

    onLeave(client: Client, consented: boolean) {
        this.playerMap.delete(client.id);
    }

    onDispose() {
    }
}
