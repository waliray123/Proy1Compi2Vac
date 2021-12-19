"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("./Tipo");
var Temporales = /** @class */ (function () {
    function Temporales() {
        this.ultimoTemp = 0;
        this.ultstack = 0;
        this.ultheap = 0;
        this.ultLiteral = 0;
        this.ultLitEscr = 0;
        this.usoConcatStrings = false;
        this.usoPrintStrings = false;
        this.ultimoTipo = Tipo_1.Tipo.NULL;
    }
    return Temporales;
}());
exports.Temporales = Temporales;
