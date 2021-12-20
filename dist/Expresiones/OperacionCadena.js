"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperacionCadena = exports.OperadorCadena = void 0;
var Tipo_1 = require("../AST/Tipo");
var Arreglo_1 = require("../Objetos/Arreglo");
var ErrorG_1 = require("../Objetos/ErrorG");
var AccesoVariable_1 = require("./AccesoVariable");
var Primitivo_1 = require("./Primitivo");
var OperadorCadena;
(function (OperadorCadena) {
    OperadorCadena[OperadorCadena["LENGTH"] = 0] = "LENGTH";
    OperadorCadena[OperadorCadena["UPPERCASE"] = 1] = "UPPERCASE";
    OperadorCadena[OperadorCadena["LOWERCASE"] = 2] = "LOWERCASE";
    OperadorCadena[OperadorCadena["CHARPOS"] = 3] = "CHARPOS";
    OperadorCadena[OperadorCadena["SUBSTRING"] = 4] = "SUBSTRING";
    OperadorCadena[OperadorCadena["POP"] = 5] = "POP";
})(OperadorCadena = exports.OperadorCadena || (exports.OperadorCadena = {}));
var OperacionCadena = /** @class */ (function () {
    function OperacionCadena(id, expr1, expr2, operadorCadena, linea, columna) {
        this.isEjecutar = true;
        this.id = id;
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.operadorCadena = operadorCadena;
        this.linea = linea;
        this.columna = columna;
    }
    OperacionCadena.prototype.getTipo = function (ent, arbol, listaErrores) {
        this.isEjecutar = false;
        var valor = this.getValorImplicito(ent, arbol, listaErrores);
        this.isEjecutar = true;
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
    OperacionCadena.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        var _a;
        if (this.operadorCadena == OperadorCadena.LENGTH) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
                var valor = this.id.getValorImplicito(ent, arbol, listaErrores);
                if (valor instanceof Arreglo_1.Arreglo) {
                    return valor.length;
                }
                else {
                    if (typeof (valor) === "string") {
                        return valor.length;
                    }
                    else {
                        //no es de tipo string
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es de tipo string', this.linea, this.columna));
                    }
                }
            }
            else if (this.id instanceof Primitivo_1.Primitivo) {
                if (this.id.getTipo(ent, arbol, listaErrores) === Tipo_1.Tipo.STRING) {
                    return this.id.getValorImplicito(ent, arbol, listaErrores).length;
                }
                else {
                    //no es un primitivo de string
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es de tipo string', this.linea, this.columna));
                }
            }
            else {
                //error
            }
        }
        else if (this.operadorCadena == OperadorCadena.LOWERCASE) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
            }
            var valor = this.id.getValorImplicito(ent, arbol, listaErrores);
            if (typeof (valor) === 'string') {
                return valor.toLocaleLowerCase();
            }
            else {
                //no es de tipo string
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no tiene un valor del tipo string', this.linea, this.columna));
            }
        }
        else if (this.operadorCadena == OperadorCadena.UPPERCASE) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
            }
            var valor = this.id.getValorImplicito(ent, arbol, listaErrores);
            if (typeof (valor) === 'string') {
                return valor.toLocaleUpperCase();
            }
            else {
                //no es de tipo string
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es de tipo string', this.linea, this.columna));
            }
        }
        else if (this.operadorCadena == OperadorCadena.CHARPOS) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
            }
            var valor = this.id.getValorImplicito(ent, arbol, listaErrores);
            if (typeof (valor) === 'string') {
                var posChar = this.expr1.getValorImplicito(ent, arbol, listaErrores);
                if (typeof (posChar) === 'number') {
                    if (this.isInt(Number(posChar))) {
                        return valor.charAt(posChar);
                    }
                    else {
                        //no es un int
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es de tipo int la posicion asignada', this.linea, this.columna));
                    }
                }
                else {
                    //no es un numero
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es un numero en la posicion asignada', this.linea, this.columna));
                }
            }
            else {
                //no es de tipo string
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es de tipo string', this.linea, this.columna));
            }
        }
        else if (this.operadorCadena == OperadorCadena.SUBSTRING) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
            }
            var valor = this.id.getValorImplicito(ent, arbol, listaErrores);
            if (typeof (valor) === 'string') {
                var inicial = this.expr1.getValorImplicito(ent, arbol, listaErrores);
                var final = this.expr2.getValorImplicito(ent, arbol, listaErrores);
                if (typeof (final) === 'number' && typeof (inicial) === 'number') {
                    if (this.isInt(Number(inicial)) && this.isInt(Number(final))) {
                        return valor.substring(inicial, final + 1);
                    }
                    else {
                        //no es un int
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es un dato de tipo int', this.linea, this.columna));
                    }
                }
                else {
                    //no es un numero
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es un numero', this.linea, this.columna));
                }
            }
            else {
                //no es de tipo string
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es un string', this.linea, this.columna));
            }
        }
        else if (this.operadorCadena == OperadorCadena.POP) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
                var valor = this.id.getValorImplicito(ent, arbol, listaErrores);
                if (valor instanceof Arreglo_1.Arreglo) {
                    if (this.isEjecutar) {
                        var val = (_a = valor.pop()) === null || _a === void 0 ? void 0 : _a.getValorImplicito(ent, arbol, listaErrores);
                        return val;
                    }
                    else {
                        return valor.getLastContenido().getValorImplicito(ent, arbol, listaErrores);
                    }
                }
                else {
                    //No es un arreglo
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no se puede realizar la operacion porque no es de tipo array', this.linea, this.columna));
                }
            }
        }
        return null;
    };
    OperacionCadena.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        throw new Error("Method not implemented.");
    };
    OperacionCadena.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return OperacionCadena;
}());
exports.OperacionCadena = OperacionCadena;
