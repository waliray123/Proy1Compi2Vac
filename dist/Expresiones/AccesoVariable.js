"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoVariable = void 0;
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
var AccesoVariable = /** @class */ (function () {
    function AccesoVariable(id, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.isAlone = true;
    }
    AccesoVariable.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        if (temporales.esFuncion == true) {
            if (ent.existe(this.id)) {
                var simbol = ent.getSimbolo(this.id);
                temporales.ultimoTemp += 1;
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= P +' + simbol.valor + ';\n';
                var valor = 'stack[(int)t' + temporales.ultimoTemp + ']';
                temporales.ultimoTemp += 1;
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '=' + valor + ';\n';
                var valR = 't' + temporales.ultimoTemp;
                temporales.ultimoTipo = this.getTipo(ent, arbol, []);
                return valR;
            }
            else {
                console.log('No existe el id ' + this.id + ' no hay tipo');
            }
        }
        else {
            if (ent.existe(this.id)) {
                var simbol = ent.getSimbolo(this.id);
                var valor = 'stack[(int)' + simbol.valor + ']';
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '=' + valor + ';\n';
                var valR = 't' + temporales.ultimoTemp;
                temporales.ultimoTemp += 1;
                temporales.ultimoTipo = this.getTipo(ent, arbol, []);
                return valR;
            }
            else {
                console.log('No existe el id ' + this.id + ' no hay tipo');
            }
        }
    };
    AccesoVariable.prototype.getTipo = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            return simbol.getTipo(ent, arbol);
        }
        else {
            // console.log('No existe el id ' + this.id + ' no hay tipo');
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.id, this.linea, this.columna));
        }
        return Tipo_1.Tipo.NULL;
    };
    AccesoVariable.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.TIPO_STRUCT && this.isAlone) {
                var sendResultado_1 = simbol.getTipoStruct(ent, arbol) + '(';
                var atributos_1 = simbol.getValorImplicito(ent, arbol);
                var i_1 = 0;
                atributos_1.forEach(function (atributo) {
                    sendResultado_1 += atributo.expresion.getValorImplicito(ent, arbol, listaErrores);
                    if (i_1 == atributos_1.length - 1) {
                        sendResultado_1 += ')';
                    }
                    else {
                        sendResultado_1 += ' , ';
                    }
                    i_1++;
                });
                return sendResultado_1;
            }
            else if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY && this.isAlone) {
                var sendResultado_2 = '[';
                var valor = simbol.getValorImplicito(ent, arbol);
                var exprs_1 = valor.contenido;
                var i_2 = 0;
                exprs_1.forEach(function (expr) {
                    sendResultado_2 += expr.getValorImplicito(ent, arbol, listaErrores);
                    if (i_2 == exprs_1.length - 1) {
                        sendResultado_2 += ']';
                    }
                    else {
                        sendResultado_2 += ',';
                    }
                    i_2++;
                });
                return sendResultado_2;
            }
            else {
                return simbol.valor;
            }
        }
        else {
            // console.log('No existe el id ' + this.id);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.id, this.linea, this.columna));
        }
    };
    AccesoVariable.prototype.getId = function () {
        return this.id;
    };
    return AccesoVariable;
}());
exports.AccesoVariable = AccesoVariable;
