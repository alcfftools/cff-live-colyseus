import {Schema, ArraySchema, MapSchema, type} from "@colyseus/schema";
import { Player } from "../backend/Player";
import { Classification, PlayerValue } from "./Classification";


export class GameState extends Schema {

    @type({map : "string"})
    players : MapSchema<string>;

    @type("number")
    turn_time: number;

    @type("number")
    sector: number;

    @type("boolean")
    running: boolean;

    @type([Classification])
    classification = new ArraySchema<Classification>();

    constructor(init_clock: number) {
        super();
        this.turn_time = init_clock;
        this.sector = 0;
        this.running = false;
        this.players = new MapSchema<string>();
        this.classification = new ArraySchema<Classification>();
    }
}