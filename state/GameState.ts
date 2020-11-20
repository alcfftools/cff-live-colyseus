import {Schema, type} from "@colyseus/schema";

export class GameState extends Schema {

    @type("number")
    turn: number;

     @type("boolean")
     running: boolean;

    constructor(turn:number=0) {
        super();
        this.turn = 0
        this.running = false;
    }
}