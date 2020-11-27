"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stage = exports.TERRAIN_TYPE = void 0;
var TERRAIN_TYPE;
(function (TERRAIN_TYPE) {
    TERRAIN_TYPE[TERRAIN_TYPE["FLAT"] = 0] = "FLAT";
    TERRAIN_TYPE[TERRAIN_TYPE["CLIMB"] = 1] = "CLIMB";
    TERRAIN_TYPE[TERRAIN_TYPE["HILL"] = 2] = "HILL";
    TERRAIN_TYPE[TERRAIN_TYPE["COBBLE"] = 3] = "COBBLE";
    TERRAIN_TYPE[TERRAIN_TYPE["DOWN"] = 4] = "DOWN";
})(TERRAIN_TYPE = exports.TERRAIN_TYPE || (exports.TERRAIN_TYPE = {}));
class Stage {
    constructor(properties) {
        this.Stamina = properties.Stamina ? properties.Stamina : 0;
        this.Sprint = properties.Sprint ? properties.Sprint : 0;
        this.Climbing = properties.Climbing ? properties.Climbing : 0;
        this.Flat = properties.Flat ? properties.Flat : 0;
        this.Cobblestone = properties.Cobblestone ? properties.Cobblestone : 0,
            this.Technique = properties.Technique ? properties.Technique : 0;
        this.Downhill = properties.Downhill ? properties.Downhill : 0;
        this.Hills = properties.Hills ? properties.Hills : 0;
        this.Aggressiveness = properties.Aggressiveness ? properties.Aggressiveness : 0;
        this.TimeTrial = properties.TimeTrial ? properties.TimeTrial : 0;
        this.Teamwork = properties.Teamwork ? properties.Teamwork : 0;
        this.Experience = properties.Experience ? properties.Experience : 0;
    }
}
exports.Stage = Stage;
//# sourceMappingURL=Stage.js.map