"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
var While = /** @class */ (function () {
    function While(linea, columna, instrucciones, expresion) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion = expresion;
    }
    While.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    While.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...fornormal');
    };
    return While;
}());
exports.While = While;
