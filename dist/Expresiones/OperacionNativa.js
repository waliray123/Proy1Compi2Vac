"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperacionNativa = exports.OperadorNativa = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoArray_1 = require("./AccesoArray");
var AccesoVariable_1 = require("./AccesoVariable");
var Operacion_1 = require("./Operacion");
var OperadorNativa;
(function (OperadorNativa) {
    OperadorNativa[OperadorNativa["PARSE"] = 0] = "PARSE";
    OperadorNativa[OperadorNativa["TOINT"] = 1] = "TOINT";
    OperadorNativa[OperadorNativa["TODOUBLE"] = 2] = "TODOUBLE";
    OperadorNativa[OperadorNativa["STRING"] = 3] = "STRING";
    OperadorNativa[OperadorNativa["TYPEOF"] = 4] = "TYPEOF";
})(OperadorNativa = exports.OperadorNativa || (exports.OperadorNativa = {}));
var OperacionNativa = /** @class */ (function () {
    function OperacionNativa(operadorNativa, tipo, expresion, linea, columna) {
        this.isEjecutar = true;
        this.operadorNativa = operadorNativa;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    OperacionNativa.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (this.isEjecutar === false) {
            this.isEjecutar = true;
            return Tipo_1.Tipo.DOUBLE;
        }
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo_1.Tipo.INT;
            }
            return Tipo_1.Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo_1.Tipo.NULL;
        }
        return Tipo_1.Tipo.VOID;
    };
    OperacionNativa.prototype.getValorImplicito = function (ent, arbol) {
        if (this.operadorNativa == OperadorNativa.PARSE) {
            var valor = this.expresion.getValorImplicito(ent, arbol);
            if (typeof (valor) === 'string') {
                if (this.tipo == Tipo_1.Tipo.INT) {
                    return parseInt(valor);
                }
                else if (this.tipo == Tipo_1.Tipo.DOUBLE) {
                    return parseFloat(valor);
                }
                else if (this.tipo == Tipo_1.Tipo.BOOL) {
                    return Boolean(JSON.parse(valor));
                }
                else if (this.tipo == Tipo_1.Tipo.CHAR) {
                    return valor.charCodeAt(0);
                }
                else {
                    //es un error
                }
            }
            else {
                //no es de tipo string
            }
        }
        else if (this.operadorNativa === OperadorNativa.STRING) {
            var valor_1 = '';
            if (this.expresion instanceof Operacion_1.Operacion) {
                valor_1 = this.expresion.op_izquierda.getValorImplicito(ent, arbol) + this.getSignoTipo(this.expresion.operador) + this.expresion.op_derecha.getValorImplicito(ent, arbol);
            }
            else if (this.expresion instanceof AccesoArray_1.AccesoArray) {
                var contenido_1 = this.expresion.contenido;
                valor_1 = '[';
                var i_1 = 0;
                contenido_1.forEach(function (expr) {
                    valor_1 += expr.getValorImplicito(ent, arbol);
                    if (i_1 == contenido_1.length - 1) {
                        valor_1 += ']';
                    }
                    else {
                        valor_1 += ',';
                    }
                    i_1++;
                });
                return valor_1;
            }
            else {
                valor_1 = this.expresion.getValorImplicito(ent, arbol);
            }
            if (valor_1 === null) {
                return null;
            }
            else {
                return String(valor_1);
            }
        }
        else if (this.operadorNativa === OperadorNativa.TODOUBLE) {
            var valor = this.expresion.getValorImplicito(ent, arbol);
            if (typeof (valor) === 'number') {
                this.isEjecutar = false;
                return valor.toFixed(2);
            }
            else {
                //no es un numero
            }
        }
        else if (this.operadorNativa === OperadorNativa.TOINT) {
            var valor = this.expresion.getValorImplicito(ent, arbol);
            if (typeof (valor) === 'number') {
                return Math.floor(valor);
            }
            else {
                //no es un numero
            }
        }
        else if (this.operadorNativa === OperadorNativa.TYPEOF) {
            if (this.expresion instanceof AccesoVariable_1.AccesoVariable) {
                var tipo = this.expresion.getTipo(ent, arbol);
                if (tipo === Tipo_1.Tipo.STRUCT || tipo === Tipo_1.Tipo.TIPO_STRUCT) {
                    return "struct";
                }
                else if (tipo === Tipo_1.Tipo.ARRAY) {
                    return "array";
                }
            }
            var valor = this.expresion.getValorImplicito(ent, arbol);
            return typeof (valor);
        }
        return null;
    };
    OperacionNativa.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        throw new Error("Method not implemented.");
    };
    OperacionNativa.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    OperacionNativa.prototype.getSignoTipo = function (operador) {
        if (operador == Operacion_1.Operador.SUMA) {
            return '+';
        }
        else if (operador == Operacion_1.Operador.RESTA) {
            return '-';
        }
        else if (operador == Operacion_1.Operador.MULTIPLICACION) {
            return '*';
        }
        else if (operador == Operacion_1.Operador.DIVISION) {
            return '/';
        }
        else if (operador == Operacion_1.Operador.MAYOR_QUE) {
            return '>';
        }
        else if (operador == Operacion_1.Operador.MENOR_QUE) {
            return '<';
        }
        return ' ';
    };
    return OperacionNativa;
}());
exports.OperacionNativa = OperacionNativa;
