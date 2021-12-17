"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var Ternario = /** @class */ (function () {
    function Ternario(expr1, expr2, expr3, linea, columna, expresion) {
        this.expresion1 = expr1;
        this.expresion2 = expr2;
        this.expresion3 = expr3;
        this.linea = linea;
        this.columna = columna;
    }
    Ternario.prototype.getTipo = function (ent, arbol) {
        var valorExpr1 = this.expresion1.getValorImplicito(ent, arbol);
        if (typeof (valorExpr1) === 'boolean') {
            if (valorExpr1 == true) {
                return this.expresion2.getTipo(ent, arbol);
            }
            else {
                return this.expresion3.getTipo(ent, arbol);
            }
        }
        else {
            console.log('Error semantico, el valor de la operacion ternaria no es un booleano en la linea ' + this.linea + ' y columna ' + this.columna);
            return Tipo_1.Tipo.NULL;
        }
    };
    Ternario.prototype.getValorImplicito = function (ent, arbol) {
        var tipo = this.expresion1.getTipo(ent, arbol);
        if (tipo === Tipo_1.Tipo.BOOL) {
            var valorExpr1 = this.expresion1.getValorImplicito(ent, arbol);
            if (valorExpr1 == true) {
                return this.expresion2.getValorImplicito(ent, arbol);
            }
            else {
                return this.expresion3.getValorImplicito(ent, arbol);
            }
        }
        else {
            console.log('Error semantico, el valor de la operacion ternaria no es un booleano en la linea ' + this.linea + ' y columna ' + this.columna);
            return null;
        }
    };
    Ternario.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    return Ternario;
}());
exports.Ternario = Ternario;
