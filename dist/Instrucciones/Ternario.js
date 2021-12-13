"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternario = void 0;
var Ternario = /** @class */ (function () {
    function Ternario(expr1, expr2, expr3, linea, columna, expresion) {
        this.expresion1 = expr1;
        this.expresion2 = expr2;
        this.expresion3 = expr3;
        this.linea = linea;
        this.columna = columna;
    }
    Ternario.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Ternario.prototype.ejecutar = function (ent, arbol) {
        throw new Error("Method not implemeted.");
    };
    return Ternario;
}());
exports.Ternario = Ternario;
