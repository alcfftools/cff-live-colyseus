export enum PlayerType {
    MASTER,
    PLAYER
}

export class Rider {

    constructor(properties:any){
        this.Name = properties.Name;
        this.Age = properties.Age;
        this.Stamina = properties.Stamina;
        this.Sprint = properties.Sprint;
        this.Climbing = properties.Climbing;
        this.Flat = properties.Flat;
        this.Cobblestone = properties.Cobblestone,
        this.Technique = properties.Technique;
        this.Downhill = properties.Downhill;
        this.Hills = properties.Hills;
        this.Aggressiveness = properties.Aggressiveness;
        this.TimeTrial  = properties.TimeTrial;
        this.Teamwork = properties.Teamwork;
        this.Experience = properties.Experience;
    }

    Name: string;
    Age: number;
    Stamina:number;
    Sprint:number;
    Climbing:number;
    Flat:number;
    Cobblestone:number;
    Technique:number;
    Downhill:number;
    Hills:number;
    Aggressiveness:number;
    TimeTrial:number;
    Teamwork:number;
    Experience:number;

}

export class Player {
    constructor(public readonly id: string, private _ready: boolean, private readonly _type: PlayerType, private readonly rider: Rider) {
    }

    public get isReady(): boolean {
        return this._ready
    }
    public set isReady(isReady: boolean) {
        this._ready = isReady;
    }
    public isMaster(): boolean {
        return this._type === PlayerType.MASTER;
    }
    public isPlayer(): boolean {
        return this._type === PlayerType.PLAYER;
    }
}