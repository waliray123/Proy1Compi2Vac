"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var AccesoVariable_1 = require("./AccesoVariable");
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
        var _this = this;
        try {
            var valor_1 = null;
            var val1 = this.expr1.getValorImplicito(ent, arbol);
            val1.forEach(function (decl) {
                var nombre = decl.id[0];
                console.log('nombre ' + nombre);
                if (_this.expr2 instanceof AccesoVariable_1.AccesoVariable) {
                    var variableAcceder = _this.expr2.id;
                    console.log('variableAcceder ' + variableAcceder);
                    if (nombre == variableAcceder) {
                        console.log('valor ' + decl.expresion.getValorImplicito(ent, arbol));
                        valor_1 = decl.expresion.getValorImplicito(ent, arbol);
                    }
                }
            });
            return valor_1;
        }
        catch (e) {
            console.error("hubo un error en AccesoAtributo " + e);
            return null;
        }
    };
    return AccesoAtributo;
}());
exports.AccesoAtributo = AccesoAtributo;
