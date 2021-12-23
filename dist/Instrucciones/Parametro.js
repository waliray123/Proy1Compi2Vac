"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parametro = void 0;
var Parametro = /** @class */ (function () {
    function Parametro(id, tipoParametro, linea, columna, isArray) {
        if (isArray === void 0) { isArray = false; }
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.tipoParametro = tipoParametro;
        this.isArray = isArray;
    }
    Parametro.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Parametro.prototype.ejecutar = function (ent, arbol, listaErrores) {
        console.log('ejecutado...' + this.id);
    };
    return Parametro;
}());
exports.Parametro = Parametro;
