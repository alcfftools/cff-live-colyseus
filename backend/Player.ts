export enum PlayerType {
    MASTER,
    PLAYER
}

export class Player {
    constructor(public readonly id: string, private _ready: boolean, private readonly _type: PlayerType) {
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