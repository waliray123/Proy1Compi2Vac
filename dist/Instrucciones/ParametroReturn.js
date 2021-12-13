"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParametroReturn = void 0;
var ParametroReturn = /** @class */ (function () {
    function ParametroReturn(valor, linea, columna) {
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    ParametroReturn.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    ParametroReturn.prototype.ejecutar = function (ent, arbol) {
    };
    return ParametroReturn;
}());
exports.ParametroReturn = ParametroReturn;
