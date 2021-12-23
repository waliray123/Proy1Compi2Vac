"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var Primitivo = /** @class */ (function () {
    function Primitivo(valor, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
        this.isFlotante = false;
    }
    Primitivo.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        console.log("Traduciendo Primitivo");
        var tipo = this.getTipo(ent, arbol, []);
        temporales.ultimoTipo = tipo;
        if (tipo == Tipo_1.Tipo.STRING) {
            temporales.ultimoTemp += 1;
            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= H;\n';
            for (var i = 0; i < this.valor.length; i++) {
                var letra = this.valor.substr(i, 1);
                var valLet = letra.charCodeAt();
                resultado3d.codigo3D += '\theap[(int)H] = ' + valLet + ';\n';
                resultado3d.codigo3D += '\tH = H + 1;\n';
                console.log(valLet);
            }
            resultado3d.codigo3D += '\theap[(int)H] = -1;\n';
            resultado3d.codigo3D += '\tH = H + 1;\n';
            return 't' + temporales.ultimoTemp;
        }
        else if (tipo == Tipo_1.Tipo.BOOL) {
            if (this.valor == true) {
                return 1;
            }
            else {
                return 0;
            }
        }
        else {
            return this.valor;
        }
    };
    Primitivo.prototype.getTipo = function (ent, arbol, listaErrores) {
        var valor = this.getValorImplicito(ent, arbol, listaErrores);
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isFlotante) {
                return Tipo_1.Tipo.DOUBLE;
            }
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
    Primitivo.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        if (typeof (this.valor) === 'string') {
            var gramatica = require('../../jison/compilerExpresion/stringExpresion');
            var continuar = false;
            var PAI = 0;
            var PAD = 0;
            var resultado = '';
            var resultados = [];
            var stringNormales = [];
            var ultCcharUsasdo = 0;
            for (var i_1 = 0; i_1 < this.valor.length; i_1++) {
                var letra = this.valor.charAt(i_1);
                if ((letra === '$' || continuar) && i_1 + 1 < this.valor.length) {
                    if (letra == '$') {
                        stringNormales.push(this.valor.substring(ultCcharUsasdo, i_1));
                    }
                    var sig = this.valor.charAt(i_1 + 1);
                    if (sig === '(') {
                        PAI += 1;
                        continuar = true;
                        resultado += sig;
                    }
                    else if (sig === ')') {
                        PAD += 1;
                        resultado += sig;
                        if (PAI === PAD) {
                            continuar = false;
                            resultados.push(resultado);
                            resultado = '';
                            ultCcharUsasdo = i_1 + 2;
                        }
                    }
                    else {
                        resultado += sig;
                        continuar = true;
                        if (PAI === PAD) {
                            if (i_1 + 2 < this.valor.length) {
                                if (this.valor.charAt(i_1 + 2) === ' ') {
                                    continuar = false;
                                    resultados.push(resultado);
                                    resultado = '';
                                    ultCcharUsasdo = i_1 + 2;
                                }
                            }
                            else {
                                continuar = false;
                                resultados.push(resultado);
                                resultado = '';
                                ultCcharUsasdo = i_1 + 2;
                            }
                        }
                    }
                }
                if (i_1 + 1 === this.valor.length) {
                    if (!(ultCcharUsasdo === 0)) {
                        stringNormales.push(this.valor.substring(ultCcharUsasdo, this.valor.length));
                    }
                }
            }
            if (resultados.length > 0) {
                var exprs = [];
                for (var i = 0; i < resultados.length; i++) {
                    var inst = gramatica.parse(resultados[i]);
                    exprs.push(inst);
                }
                var sendValor = '';
                for (var i = 0; i < exprs.length; i++) {
                    sendValor += stringNormales[i] + '' + exprs[i].getValorImplicito(ent, arbol, listaErrores);
                }
                sendValor += stringNormales[stringNormales.length - 1];
                // console.log(sendValor);
                return sendValor;
            }
        }
        return this.valor;
    };
    Primitivo.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Primitivo;
}());
exports.Primitivo = Primitivo;
