"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DoWhile = /** @class */ (function () {
    function DoWhile(linea, columna, instrucciones, expresion) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion = expresion;
    }
    DoWhile.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    DoWhile.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...fornormal');
    };
    return DoWhile;
}());
exports.DoWhile = DoWhile;
