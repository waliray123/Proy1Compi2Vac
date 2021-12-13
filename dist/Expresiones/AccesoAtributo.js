"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var AccesoAtributo = /** @class */ (function () {
    function AccesoAtributo(expr1, expr2, linea, columna) {
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.linea = linea;
        this.columna = columna;
    }
    AccesoAtributo.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoAtributo.prototype.getTipo = function (ent, arbol) {
        return Tipo_1.Tipo.NULL;
    };
    AccesoAtributo.prototype.getValorImplicito = function (ent, arbol) {
    };
    return AccesoAtributo;
}());
exports.AccesoAtributo = AccesoAtributo;
