"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoAtributo = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoVariable_1 = require("./AccesoVariable");
var AccesoAtributo = /** @class */ (function () {
    function AccesoAtributo(expr1, expr2, linea, columna) {
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.linea = linea;
        this.columna = columna;
        this.isAlone = false;
    }
    AccesoAtributo.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoAtributo.prototype.getTipo = function (ent, arbol) {
        var _this = this;
        try {
            var valor_1 = Tipo_1.Tipo.NULL;
            this.expr1.isAlone = false;
            var val1 = this.expr1.getValorImplicito(ent, arbol);
            val1.forEach(function (decl) {
                var nombre = decl.id[0];
                if (nombre == _this.expr2) {
                    // console.log('valor ' + decl.expresion.getValorImplicito(ent, arbol))
                    if (decl.expresion instanceof AccesoVariable_1.AccesoVariable) {
                        decl.expresion.isAlone = false;
                        valor_1 = decl.expresion.getValorImplicito(ent, arbol);
                        decl.expresion.isAlone = true;
                    }
                    else {
                        valor_1 = decl.expresion.getTipo(ent, arbol);
                    }
                }
            });
            this.expr1.isAlone = true;
            return valor_1;
        }
        catch (e) {
            console.error("hubo un error en AccesoAtributo " + e);
            return Tipo_1.Tipo.NULL;
        }
    };
    AccesoAtributo.prototype.getValorImplicito = function (ent, arbol) {
        var _this = this;
        try {
            var valor_2 = null;
            this.expr1.isAlone = false;
            var val1 = this.expr1.getValorImplicito(ent, arbol);
            val1.forEach(function (decl) {
                var nombre = decl.id[0];
                if (nombre == _this.expr2) {
                    // console.log('valor ' + decl.expresion.getValorImplicito(ent, arbol))
                    if (decl.expresion instanceof AccesoVariable_1.AccesoVariable) {
                        decl.expresion.isAlone = false;
                        valor_2 = decl.expresion.getValorImplicito(ent, arbol);
                        decl.expresion.isAlone = true;
                    }
                    else {
                        valor_2 = decl.expresion.getValorImplicito(ent, arbol);
                    }
                }
            });
            this.expr1.isAlone = true;
            return valor_2;
        }
        catch (e) {
            console.error("hubo un error en AccesoAtributo " + e);
            return null;
        }
    };
    return AccesoAtributo;
}());
exports.AccesoAtributo = AccesoAtributo;
