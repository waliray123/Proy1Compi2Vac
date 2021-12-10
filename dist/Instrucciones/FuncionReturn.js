"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionReturn = void 0;
var FuncionReturn = /** @class */ (function () {
    function FuncionReturn(nombrefuncion, linea, columna, parametros) {
        if (parametros === void 0) { parametros = []; }
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.parametros = parametros;
    }
    FuncionReturn.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    FuncionReturn.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado funcion retorno ...' + this.nombrefuncion);
    };
    return FuncionReturn;
}());
exports.FuncionReturn = FuncionReturn;
