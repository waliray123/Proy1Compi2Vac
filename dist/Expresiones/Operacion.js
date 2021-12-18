"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
var Operador;
(function (Operador) {
    Operador[Operador["SUMA"] = 0] = "SUMA";
    Operador[Operador["RESTA"] = 1] = "RESTA";
    Operador[Operador["MULTIPLICACION"] = 2] = "MULTIPLICACION";
    Operador[Operador["AMPERSON"] = 3] = "AMPERSON";
    Operador[Operador["DIVISION"] = 4] = "DIVISION";
    Operador[Operador["MODULO"] = 5] = "MODULO";
    Operador[Operador["MENOS_UNARIO"] = 6] = "MENOS_UNARIO";
    Operador[Operador["ELEVADO"] = 7] = "ELEVADO";
    Operador[Operador["MAYOR_QUE"] = 8] = "MAYOR_QUE";
    Operador[Operador["MENOR_QUE"] = 9] = "MENOR_QUE";
    Operador[Operador["IGUAL_IGUAL"] = 10] = "IGUAL_IGUAL";
    Operador[Operador["DIFERENTE_QUE"] = 11] = "DIFERENTE_QUE";
    Operador[Operador["OR"] = 12] = "OR";
    Operador[Operador["AND"] = 13] = "AND";
    Operador[Operador["NOT"] = 14] = "NOT";
    Operador[Operador["MAYOR_IGUA_QUE"] = 15] = "MAYOR_IGUA_QUE";
    Operador[Operador["MENOR_IGUA_QUE"] = 16] = "MENOR_IGUA_QUE";
    Operador[Operador["INCREMENTO"] = 17] = "INCREMENTO";
    Operador[Operador["DECREMENTO"] = 18] = "DECREMENTO";
    Operador[Operador["POW"] = 19] = "POW";
    Operador[Operador["SQRT"] = 20] = "SQRT";
    Operador[Operador["SIN"] = 21] = "SIN";
    Operador[Operador["COS"] = 22] = "COS";
    Operador[Operador["TAN"] = 23] = "TAN";
    Operador[Operador["DESCONOCIDO"] = 24] = "DESCONOCIDO";
})(Operador = exports.Operador || (exports.Operador = {}));
var Operacion = /** @class */ (function () {
    function Operacion(op_izquierda, op_derecha, operacion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.op_izquierda = op_izquierda;
        this.op_derecha = op_derecha;
        this.operador = operacion;
    }
    Operacion.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        console.log("Traduciendo operacion");
        var resultado = "";
        if (this.operador !== Operador.MENOS_UNARIO && this.operador !== Operador.NOT
            && this.operador != Operador.SQRT && this.operador != Operador.SIN && this.operador != Operador.COS
            && this.operador != Operador.TAN && this.operador != Operador.INCREMENTO && this.operador != Operador.DECREMENTO) {
            var val1 = this.op_izquierda.traducir(ent, arbol, resultado3d, temporales, recursivo + 1);
            var val2 = this.op_derecha.traducir(ent, arbol, resultado3d, temporales, recursivo + 1);
            var valor = this.unirResultado(val1, val2);
            if (recursivo == 0) {
                return valor;
            }
            else {
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '=' + valor + ';\n';
                var valR = 't' + temporales.ultimoTemp;
                temporales.ultimoTemp += 1;
                return valR;
            }
        }
        else {
            var val1 = this.op_izquierda.traducir(ent, arbol, resultado3d, temporales, recursivo + 1);
            var valor = this.unirResultadoUnico(val1);
            if (recursivo == 0) {
                return valor;
            }
            else {
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '=' + valor + ';\n';
                var valR = 't' + temporales.ultimoTemp;
                temporales.ultimoTemp += 1;
                return valR;
            }
        }
    };
    Operacion.prototype.unirResultado = function (val1, val2) {
        var resultadoR = '';
        if (this.operador == Operador.SUMA) {
            resultadoR = val1 + "+" + val2;
        }
        else if (this.operador == Operador.RESTA) {
            resultadoR = val1 + "-" + val2;
        }
        else if (this.operador == Operador.MULTIPLICACION) {
            resultadoR = val1 + "*" + val2;
        }
        else if (this.operador == Operador.DIVISION) {
            resultadoR = val1 + "/" + val2;
        }
        else if (this.operador == Operador.MAYOR_QUE) {
            resultadoR = val1 + ">" + val2;
        }
        else if (this.operador == Operador.MENOR_QUE) {
            resultadoR = val1 + "<" + val2;
        }
        else if (this.operador == Operador.MAYOR_IGUA_QUE) {
            resultadoR = val1 + ">=" + val2;
        }
        else if (this.operador == Operador.MENOR_IGUA_QUE) {
            resultadoR = val1 + "<=" + val2;
        }
        else if (this.operador == Operador.IGUAL_IGUAL) {
            resultadoR = val1 + "<=" + val2;
        }
        else if (this.operador == Operador.MODULO) {
            resultadoR = 'fmod(' + val1 + ',' + val2 + ')';
        }
        return resultadoR;
    };
    Operacion.prototype.unirResultadoUnico = function (val1) {
        var resultadoR = '';
        if (this.operador == Operador.MENOS_UNARIO) {
            resultadoR = '-' + val1;
        }
        return resultadoR;
    };
    Operacion.prototype.getTipo = function (ent, arbol, listaErrores) {
        var valor = this.getValorImplicito(ent, arbol, listaErrores);
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
    Operacion.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        if (this.operador !== Operador.MENOS_UNARIO && this.operador !== Operador.NOT
            && this.operador != Operador.SQRT && this.operador != Operador.SIN && this.operador != Operador.COS
            && this.operador != Operador.TAN && this.operador != Operador.INCREMENTO && this.operador != Operador.DECREMENTO) {
            var op1 = this.op_izquierda.getValorImplicito(ent, arbol, listaErrores);
            var op2 = this.op_derecha.getValorImplicito(ent, arbol, listaErrores);
            //suma
            if (this.operador == Operador.SUMA) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 + op2;
                }
                else {
                    // console.log("Error de tipos de datos no permitidos realizando una suma");
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'error de tipos de datos no permitidos realizando una suma', this.linea, this.columna));
                    return null;
                }
            }
            //resta
            else if (this.operador == Operador.RESTA) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 - op2;
                }
                else {
                    // console.log("Error de tipos de datos no permitidos realizando una suma");
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'error al realizar una resta', this.linea, this.columna));
                    return null;
                }
            }
            //multiplicación
            else if (this.operador == Operador.MULTIPLICACION) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 * op2;
                }
                else {
                    // console.log("Error de tipos de datos no permitidos realizando una suma");
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'error al realizar la multiplicación', this.linea, this.columna));
                    return null;
                }
            }
            //division
            else if (this.operador == Operador.DIVISION) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    if (op2 === 0) {
                        // console.log("Resultado indefinido, no puede ejecutarse operación sobre cero.");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'resultado indefinido, no puede ejecutarse operacion sobre cero', this.linea, this.columna));
                        return null;
                    }
                    return op1 / op2;
                }
                else {
                    // console.log("Error de tipos de datos no permitidos realizando una suma");
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'error al realizar una division', this.linea, this.columna));
                    return null;
                }
            }
            //modulo
            else if (this.operador == Operador.MODULO) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    if (op2 === 0) {
                        // console.log("Resultado indefinido, no puede ejecutarse operación sobre cero.");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'resultado indefinido, no puede ejecutarsre operacion sobre cero', this.linea, this.columna));
                        return null;
                    }
                    return op1 % op2;
                }
                else {
                    // console.log("Error de tipos de datos no permitidos realizando una suma");
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'error al realizar la operacion de modulo', this.linea, this.columna));
                    return null;
                }
            }
            //AMPERSON
            else if (this.operador == Operador.AMPERSON) {
                if (typeof (op1 === 'string') && typeof (op2 === 'string')) {
                    return op1.concat(op2.toString());
                }
                else {
                    // console.log('Error semantico, Solo se puede concatenar (&) Strings en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Solo se puede concatenar (&) Strings', this.linea, this.columna));
                    return null;
                }
            }
            //ELEVADO
            else if (this.operador == Operador.ELEVADO) {
                if (this.op_izquierda.getTipo(ent, arbol, listaErrores) == Tipo_1.Tipo.STRING && this.op_derecha.getTipo(ent, arbol, listaErrores) == Tipo_1.Tipo.INT) {
                    return op1.repeat(Number(op2));
                }
                else {
                    // console.log('Error semantico, No se puede completar la accion ^ en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'No se puede completar la accion ^', this.linea, this.columna));
                    return null;
                }
            }
            try {
                //MAYOR QUE
                if (this.operador == Operador.MAYOR_QUE) {
                    return op1 > op2;
                }
                //MENOR QUE
                else if (this.operador == Operador.MENOR_QUE) {
                    return op1 < op2;
                }
                //Mayor o igual
                else if (this.operador == Operador.MAYOR_IGUA_QUE) {
                    return op1 >= op2;
                }
                //menor o igual
                else if (this.operador == Operador.MENOR_IGUA_QUE) {
                    return op1 <= op2;
                }
                //igualacion
                else if (this.operador == Operador.IGUAL_IGUAL) {
                    return op1 == op2;
                }
                //diferente que
                else if (this.operador == Operador.DIFERENTE_QUE) {
                    return op1 != op2;
                }
                //or
                else if (this.operador == Operador.OR) {
                    return op1 || op2;
                }
                //and
                else if (this.operador == Operador.AND) {
                    return op1 && op2;
                }
                //potencia
                else if (this.operador == Operador.POW) {
                    if (typeof (op1 === "number") && typeof (op2 === "number")) {
                        return Math.pow(op1, op2);
                    }
                    else {
                        // console.log("Error de tipos de datos no permitidos realizando una potencia");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error de tipos de datos no permitidos realizando una potencia', this.linea, this.columna));
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            try {
                var op1 = this.op_izquierda.getValorImplicito(ent, arbol, listaErrores);
                if (this.operador == Operador.MENOS_UNARIO) {
                    if (typeof (op1 === "number")) {
                        return -1 * op1;
                    }
                    else {
                        // console.log("Error de tipos de datos no permitidos realizando una operación unaria");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error de tipos de datos no permitidos realizando una operación unaria', this.linea, this.columna));
                        return null;
                    }
                }
                else if (this.operador == Operador.NOT) {
                    return !op1;
                }
                else if (this.operador == Operador.SIN) {
                    if (typeof (op1 === "number")) {
                        return Math.sin(this.gradosRadianes(op1));
                    }
                    else {
                        // console.log("Error de tipos de datos no permitidos realizando una operacion seno");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error de tipos de datos no permitidos realizando una operacion seno', this.linea, this.columna));
                    }
                }
                else if (this.operador == Operador.COS) {
                    if (typeof (op1 === "number")) {
                        return Math.cos(this.gradosRadianes(op1));
                    }
                    else {
                        // console.log("Error de tipos de datos no permitidos realizando una operacion coseno");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error de tipos de datos no permitidos realizando una operacion coseno', this.linea, this.columna));
                    }
                }
                else if (this.operador == Operador.TAN) {
                    if (typeof (op1 === "number")) {
                        return Math.tan(this.gradosRadianes(op1));
                    }
                    else {
                        // console.log("Error de tipos de datos no permitidos realizando una operacion tangente");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error de tipos de datos no permitidos realizando una operacion tangente', this.linea, this.columna));
                    }
                }
                else if (this.operador == Operador.SQRT) {
                    if (typeof (op1 === "number")) {
                        return Math.sqrt(op1);
                    }
                    else {
                        // console.log("Error de tipos de datos no permitidos realizando una raiz");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error de tipos de datos no permitidos realizando una raiz', this.linea, this.columna));
                    }
                }
                //incremento
                else if (this.operador == Operador.INCREMENTO) {
                    return op1 + 1;
                }
                else if (this.operador == Operador.DECREMENTO) {
                    return op1 - 1;
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        return null;
    };
    Operacion.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    Operacion.prototype.gradosRadianes = function (n) {
        return (n * (Math.PI / 180));
    };
    return Operacion;
}());
exports.Operacion = Operacion;
