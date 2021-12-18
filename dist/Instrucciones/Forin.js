"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forin = void 0;
var Forin = /** @class */ (function () {
    function Forin(linea, columna, instrucciones, expresion1, expresion2) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }
    Forin.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Forin.prototype.ejecutar = function (ent, arbol, listaErrores) {
        console.log('ejecutado...fornormal');
    };
    return Forin;
}());
exports.Forin = Forin;
