"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classification = exports.PlayerValue = void 0;
const schema_1 = require("@colyseus/schema");
class PlayerValue extends schema_1.Schema {
    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
    }
}
__decorate([
    schema_1.type("string")
], PlayerValue.prototype, "name", void 0);
__decorate([
    schema_1.type("number")
], PlayerValue.prototype, "value", void 0);
exports.PlayerValue = PlayerValue;
class Classification extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.playerValues = new schema_1.ArraySchema();
    }
    order() {
        let pvalues = [...this.playerValues.values()].sort((a, b) => b.value - a.value);
        return pvalues;
    }
}
__decorate([
    schema_1.type([PlayerValue])
], Classification.prototype, "playerValues", void 0);
exports.Classification = Classification;
//# sourceMappingURL=Classification.js.map