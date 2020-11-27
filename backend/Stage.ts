
export enum TERRAIN_TYPE{
    FLAT,
    CLIMB,
    HILL,
    COBBLE,
    DOWN
}

export class Stage {

    constructor(properties:any){
        this.Stamina = properties.Stamina ? properties.Stamina : 0;
        this.Sprint = properties.Sprint ? properties.Sprint : 0;
        this.Climbing = properties.Climbing  ? properties.Climbing : 0;
        this.Flat = properties.Flat ? properties.Flat : 0;
        this.Cobblestone = properties.Cobblestone ? properties.Cobblestone : 0,
        this.Technique = properties.Technique ? properties.Technique : 0;
        this.Downhill = properties.Downhill ? properties.Downhill : 0;
        this.Hills = properties.Hills ? properties.Hills : 0;
        this.Aggressiveness = properties.Aggressiveness ? properties.Aggressiveness : 0;
        this.TimeTrial  = properties.TimeTrial ? properties.TimeTrial : 0;
        this.Teamwork = properties.Teamwork ? properties.Teamwork : 0;
        this.Experience = properties.Experience ? properties.Experience : 0;
    }

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
    Sectors: TERRAIN_TYPE[];

}