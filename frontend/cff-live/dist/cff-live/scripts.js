import {Schema, ArraySchema, type} from "@colyseus/schema";





export class GameState extends Schema {

    //@type([Rider])
    //riders = new ArraySchema<Rider>();

    @type("number")
    turn_time: number;

    @type("number")
    sector: number;

    @type("boolean")
    running: boolean;

    constructor(init_clock: number) {
        super();
        this.turn_time = init_clock;
        this.sector = 0;
        this.running = false;
    }
}
;
//# sourceMappingURL=scripts.js.map