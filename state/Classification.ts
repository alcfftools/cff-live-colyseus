import {Schema, ArraySchema, type} from "@colyseus/schema";

export class PlayerValue extends Schema {
    @type("string")
    name:string;
    @type("number")
    value:number;
    
    constructor(name:string, value:number){
        super();
        this.name = name;
        this.value = value;
    }
}

export class Classification extends Schema {
    @type([PlayerValue])
    playerValues = new ArraySchema<PlayerValue>();


    order(): PlayerValue[] {
        let pvalues = [...this.playerValues.values()].sort( (a ,b ) =>  b.value  - a.value);
        return pvalues;
    }
}