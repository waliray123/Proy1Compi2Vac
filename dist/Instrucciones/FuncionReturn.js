"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        var _this = this;
        var funciones = arbol.funciones;
        funciones.forEach(function (element) {
            if (_this.nombrefuncion == element.nombrefuncion) {
                element.setParametrosReturn(_this.parametros);
                element.ejecutar(ent, arbol);
                return; // Retornar el valor que retorna la funcion ejecutar
            }
        });
    };
    return FuncionReturn;
}());
exports.FuncionReturn = FuncionReturn;
