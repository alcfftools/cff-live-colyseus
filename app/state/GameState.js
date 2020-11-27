"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
const schema_1 = require("@colyseus/schema");
const Classification_1 = require("./Classification");
class GameState extends schema_1.Schema {
    constructor(init_clock) {
        super();
        this.classification = new schema_1.ArraySchema();
        this.turn_time = init_clock;
        this.sector = 0;
        this.running = false;
        this.players = new schema_1.MapSchema();
        this.classification = new schema_1.ArraySchema();
    }
}
__decorate([
    schema_1.type({ map: "string" })
], GameState.prototype, "players", void 0);
__decorate([
    schema_1.type("number")
], GameState.prototype, "turn_time", void 0);
__decorate([
    schema_1.type("number")
], GameState.prototype, "sector", void 0);
__decorate([
    schema_1.type("boolean")
], GameState.prototype, "running", void 0);
__decorate([
    schema_1.type([Classification_1.Classification])
], GameState.prototype, "classification", void 0);
exports.GameState = GameState;
//# sourceMappingURL=GameState.js.map