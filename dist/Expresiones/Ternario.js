"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternario = void 0;
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
var Ternario = /** @class */ (function () {
    function Ternario(expr1, expr2, expr3, linea, columna, expresion) {
        this.expresion1 = expr1;
        this.expresion2 = expr2;
        this.expresion3 = expr3;
        this.linea = linea;
        this.columna = columna;
    }
    Ternario.prototype.getTipo = function (ent, arbol, listaErrores) {
        var valorExpr1 = this.expresion1.getValorImplicito(ent, arbol, listaErrores);
        if (typeof (valorExpr1) === 'boolean') {
            if (valorExpr1 == true) {
                return this.expresion2.getTipo(ent, arbol, listaErrores);
            }
            else {
                return this.expresion3.getTipo(ent, arbol, listaErrores);
            }
        }
        else {
            // console.log('Error semantico, el valor de la operacion ternaria no es un booleano en la linea '+ this.linea + ' y columna ' + this.columna);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'el valor de la operacion ternaria no es un booleano', this.linea, this.columna));
            return Tipo_1.Tipo.NULL;
        }
    };
    Ternario.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        var tipo = this.expresion1.getTipo(ent, arbol, listaErrores);
        if (tipo === Tipo_1.Tipo.BOOL) {
            var valorExpr1 = this.expresion1.getValorImplicito(ent, arbol, listaErrores);
            if (valorExpr1 == true) {
                return this.expresion2.getValorImplicito(ent, arbol, listaErrores);
            }
            else {
                return this.expresion3.getValorImplicito(ent, arbol, listaErrores);
            }
        }
        else {
            // console.log('Error semantico, el valor de la operacion ternaria no es un booleano en la linea '+ this.linea + ' y columna ' + this.columna);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'el valor de la operacion ternaria no es un booleano', this.linea, this.columna));
            return null;
        }
    };
    Ternario.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    return Ternario;
}());
exports.Ternario = Ternario;
