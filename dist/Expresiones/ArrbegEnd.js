"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrbegEnd = void 0;
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
var ArrbegEnd = /** @class */ (function () {
    function ArrbegEnd(id, linea, columna, expresion1, expresion2) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
        this.isAlone = true;
    }
    ArrbegEnd.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    ArrbegEnd.prototype.getTipo = function (ent, arbol, listaErrores) {
        if (this.isAlone) {
            return Tipo_1.Tipo.ARRAY;
        }
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            var valor = simbol.getValorImplicito(ent, arbol);
            return valor.tipo;
        }
        return Tipo_1.Tipo.NULL;
    };
    ArrbegEnd.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                var inicio = this.expresion1.getValorImplicito(ent, arbol, listaErrores);
                var final = this.expresion2.getValorImplicito(ent, arbol, listaErrores);
                var datosArray_1 = this.devolverArreglo(inicio, final, valor, listaErrores);
                if (this.isAlone) {
                    var sendResultado_1 = 'undefined';
                    if (datosArray_1.length > 0) {
                        sendResultado_1 = '[';
                    }
                    var i_1 = 0;
                    datosArray_1.forEach(function (expr) {
                        sendResultado_1 += expr.getValorImplicito(ent, arbol, listaErrores); //ahora veo si lo dejo asi
                        if (i_1 == datosArray_1.length - 1) {
                            sendResultado_1 += ']';
                        }
                        else {
                            sendResultado_1 += ',';
                        }
                        i_1++;
                    });
                    return sendResultado_1;
                }
                else {
                    return datosArray_1;
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable no es del tipo array', this.linea, this.columna));
            }
        }
        else {
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.id, this.linea, this.columna));
        }
        return null;
    };
    ArrbegEnd.prototype.getListaDatos = function (ent, arbol, listaErrores) {
        this.isAlone = false;
        var valor = this.getValorImplicito(ent, arbol, listaErrores);
        this.isAlone = true;
        if (valor === null) {
            return [];
        }
        if (typeof (valor) === 'string') {
            return [];
        }
        return valor;
    };
    ArrbegEnd.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    ArrbegEnd.prototype.verificarDimension = function (pos, max, listaErrores) {
        if (pos >= 0 && pos < max) {
            return true;
        }
        else {
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'index [' + pos + '] fuera del limite del arreglo', this.linea, this.columna));
            return false;
        }
    };
    ArrbegEnd.prototype.devolverArreglo = function (inicio, final, valor, listaErrores) {
        if (inicio == 'begin' && final == 'end') {
            // begin end
            return valor.contenido;
        }
        else if (inicio == 'begin' && final != 'end') {
            // begin expresion            
            if (typeof (final) == 'number') {
                var isFinal = this.verificarDimension(final, valor.length, listaErrores);
                if (isFinal) {
                    var datosArray = [];
                    for (var i = 0; i <= final; i++) {
                        datosArray.push(valor.contenido[i]);
                    }
                    return datosArray;
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la posicion final colocada no es numerico', this.linea, this.columna));
            }
        }
        else if (inicio != 'begin' && final == 'end') {
            // expresion end
            if (typeof (inicio) == 'number') {
                var isInicio = this.verificarDimension(inicio, valor.length, listaErrores);
                if (isInicio) {
                    var datosArray = [];
                    for (var i = inicio; i < valor.length; i++) {
                        datosArray.push(valor.contenido[i]);
                    }
                    return datosArray;
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la posicion final colocada no es numerico', this.linea, this.columna));
            }
        }
        else {
            // expresion expresion
            if (typeof (inicio) == 'number' && typeof (final) == 'number') {
                var isInicio = this.verificarDimension(inicio, final, listaErrores);
                var isFinal = this.verificarDimension(final, valor.length, listaErrores);
                if (isInicio && isFinal) {
                    var datosArray = [];
                    for (var i = inicio; i <= final; i++) {
                        datosArray.push(valor.contenido[i]);
                    }
                    return datosArray;
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'las posiciones colocadas no son numericos', this.linea, this.columna));
            }
        }
        return [];
    };
    return ArrbegEnd;
}());
exports.ArrbegEnd = ArrbegEnd;
