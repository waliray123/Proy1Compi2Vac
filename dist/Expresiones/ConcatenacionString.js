"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcatenacionString = exports.ConcatenarTraduccion = void 0;
var Tipo_1 = require("../AST/Tipo");
var ConcatenarTraduccion = /** @class */ (function () {
    function ConcatenarTraduccion(valAsign, tipo) {
        this.valAsign = valAsign;
        this.tipo = tipo;
    }
    return ConcatenarTraduccion;
}());
exports.ConcatenarTraduccion = ConcatenarTraduccion;
var ConcatenacionString = /** @class */ (function () {
    function ConcatenacionString(expresiones, linea, columna) {
        this.expresiones = expresiones;
        this.linea = linea;
        this.columna = columna;
    }
    ConcatenacionString.prototype.getTipo = function (ent, arbol, listaErrores) {
        return Tipo_1.Tipo.STRING;
    };
    ConcatenacionString.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        var valorCompleto = '';
        this.expresiones.forEach(function (expresion) {
            valorCompleto += expresion.getValorImplicito(ent, arbol, listaErrores);
        });
        return valorCompleto;
    };
    ConcatenacionString.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        var temps = [];
        this.expresiones.forEach(function (expresion) {
            var valAsign = expresion.traducir(ent, arbol, resultado3d, temporales, recursivo);
            var tipo = temporales.ultimoTipo;
            temps.push(new ConcatenarTraduccion(valAsign, tipo));
        });
        return temps;
    };
    ConcatenacionString.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return ConcatenacionString;
}());
exports.ConcatenacionString = ConcatenacionString;
