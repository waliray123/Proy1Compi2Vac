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
    FuncionReturn.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var funciones = arbol.funciones;
        for (var _i = 0, funciones_1 = funciones; _i < funciones_1.length; _i++) {
            var element = funciones_1[_i];
            if (this.nombrefuncion == element.nombrefuncion) {
                element.setParametrosReturn(this.parametros);
                element.ejecutar(ent, arbol, listaErrores);
                return ent.valorReturn; // Retornar el valor que retorna la funcion ejecutar
            }
        }
    };
    FuncionReturn.prototype.getTipo = function (ent, arbol, listaErrores) {
        var funciones = arbol.funciones;
        for (var _i = 0, funciones_2 = funciones; _i < funciones_2.length; _i++) {
            var element = funciones_2[_i];
            if (this.nombrefuncion == element.nombrefuncion) {
                return element.tipoFuncion;
            }
        }
    };
    FuncionReturn.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        var funciones = arbol.funciones;
        for (var _i = 0, funciones_3 = funciones; _i < funciones_3.length; _i++) {
            var element = funciones_3[_i];
            if (this.nombrefuncion == element.nombrefuncion) {
                element.setParametrosReturn(this.parametros);
                element.ejecutar(ent, arbol, listaErrores);
                return ent.valorReturn; // Retornar el valor que retorna la funcion ejecutar
            }
        }
    };
    return FuncionReturn;
}());
exports.FuncionReturn = FuncionReturn;
