"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.Rider = exports.PlayerType = void 0;
var PlayerType;
(function (PlayerType) {
    PlayerType[PlayerType["MASTER"] = 0] = "MASTER";
    PlayerType[PlayerType["PLAYER"] = 1] = "PLAYER";
})(PlayerType = exports.PlayerType || (exports.PlayerType = {}));
class Rider {
    constructor(properties) {
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
        this.TimeTrial = properties.TimeTrial;
        this.Teamwork = properties.Teamwork;
        this.Experience = properties.Experience;
    }
}
exports.Rider = Rider;
class Player {
    constructor(id, _ready, _type, rider) {
        this.id = id;
        this._ready = _ready;
        this._type = _type;
        this.rider = rider;
    }
    get isReady() {
        return this._ready;
    }
    set isReady(isReady) {
        this._ready = isReady;
    }
    isMaster() {
        return this._type === PlayerType.MASTER;
    }
    isPlayer() {
        return this._type === PlayerType.PLAYER;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map