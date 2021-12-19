"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParametroReturn = /** @class */ (function () {
    function ParametroReturn(valor, linea, columna) {
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    ParametroReturn.prototype.getTipo = function (ent, arbol, listaErrores) {
        return this.valor.getTipo(ent, arbol, listaErrores);
    };
    ParametroReturn.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        return this.valor.getValorImplicito(ent, arbol, listaErrores);
    };
    ParametroReturn.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    ParametroReturn.prototype.ejecutar = function (ent, arbol) {
    };
    return ParametroReturn;
}());
exports.ParametroReturn = ParametroReturn;
