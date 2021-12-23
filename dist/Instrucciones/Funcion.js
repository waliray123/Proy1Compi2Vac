"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entorno_1 = require("../AST/Entorno");
var Tipo_1 = require("../AST/Tipo");
var Declaracion_1 = require("./Declaracion");
var ErrorG_1 = require("../Objetos/ErrorG");
var AccesoVariable_1 = require("../Expresiones/AccesoVariable");
var DeclaracionArray_1 = require("./DeclaracionArray");
var Simbolo_1 = require("../AST/Simbolo");
var Primitivo_1 = require("../Expresiones/Primitivo");
var Funcion = /** @class */ (function () {
    function Funcion(nombrefuncion, tipoFuncion, linea, columna, instrucciones, parametros) {
        if (parametros === void 0) { parametros = []; }
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.tipoFuncion = tipoFuncion;
        this.parametros = parametros;
        this.parametrosR = [];
    }
    Funcion.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        var entornoGlobal = new Entorno_1.Entorno(ent);
        if (this.nombrefuncion == "main") {
            temporales.esFuncion = false;
            for (var _i = 0, _a = this.instrucciones; _i < _a.length; _i++) {
                var element = _a[_i];
                element.traducir(entornoGlobal, arbol, resultado3D, temporales, listaErrores);
            }
        }
        else {
            //Traducir segun funcion
            temporales.esFuncion = true;
            temporales.cantidadParametrosFunc = this.parametros.length + 1;
            //Traducir traer parametros
            this.declararParametrosTraducir(entornoGlobal, arbol, resultado3D, temporales, listaErrores);
            //Traducir completo
            for (var _b = 0, _c = this.instrucciones; _b < _c.length; _b++) {
                var element = _c[_b];
                element.traducir(entornoGlobal, arbol, resultado3D, temporales, listaErrores);
            }
        }
        /*
        this.instrucciones.forEach((element:Instruccion) => {
            element.traducir(entornoGlobal,arbol,resultado3D,temporales,listaErrores);
        })
        */
    };
    Funcion.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var entornoGlobal = new Entorno_1.Entorno(ent);
        console.log("Insertando nombreEntorno" + this.nombrefuncion);
        entornoGlobal.nombreEntorno = this.nombrefuncion;
        //Declarar todos los parametros
        this.declararParametrosReturn(entornoGlobal, arbol, listaErrores);
        //recorro todas las raices  RECURSIVA
        for (var _i = 0, _a = this.instrucciones; _i < _a.length; _i++) {
            var element = _a[_i];
            var valR = element.ejecutar(entornoGlobal, arbol, listaErrores);
            if (valR == 'RETORNAR') {
                console.log('VAl return Funcion');
                ent.valorReturn = entornoGlobal.valorReturn;
                console.log(ent.valorReturn);
                break;
            }
        }
    };
    Funcion.prototype.getTipo = function () {
        return "funcion";
    };
    Funcion.prototype.setParametrosReturn = function (parametrosR) {
        this.parametrosR = parametrosR;
    };
    Funcion.prototype.declararParametrosReturn = function (ent, arbol, listaErrores) {
        try {
            for (var i = 0; i < this.parametros.length; i++) {
                var parametro = this.parametros[i];
                var parametroR = this.parametrosR[i];
                var tipoR = parametroR.getTipo(ent, arbol, listaErrores);
                if (parametro.isArray) {
                    if (tipoR == Tipo_1.Tipo.ARRAY) {
                        var paramR = parametroR.valor;
                        if (paramR instanceof AccesoVariable_1.AccesoVariable) {
                            paramR.isAlone = false;
                            var valorR = paramR.getValorImplicito(ent, arbol, listaErrores);
                            console.log(valorR);
                            paramR.isAlone = true;
                            if (valorR.tipo == parametro.tipoParametro) {
                                //@ts-ignore
                                var declArr = new DeclaracionArray_1.DeclaracionArray([parametro.id], parametro.tipoParametro, [], this.linea, this.columna, null);
                                declArr.ejecutar(ent, arbol, listaErrores);
                                var simbol = ent.getSimbolo(parametro.id);
                                simbol.valor = valorR;
                            }
                            else {
                                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'No es del mismo tipo la variable del arreglo', this.linea, this.columna));
                            }
                        }
                    }
                    else {
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error, el tipo del parametro no es un arreglo', parametroR.linea, parametroR.columna));
                    }
                }
                else if (tipoR == parametro.tipoParametro || (tipoR == Tipo_1.Tipo.INT && parametro.tipoParametro == Tipo_1.Tipo.DOUBLE)) {
                    //id:Array<string>,tipo:Tipo, linea:number, columna:number,expresion:Expresion                                        
                    var declPar = new Declaracion_1.Declaracion([parametro.id], parametro.tipoParametro, this.linea, this.columna, parametroR.valor);
                    declPar.ejecutar(ent, arbol, listaErrores);
                }
            }
        }
        catch (error) {
            // console.log("Error al declarar un parametro");
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error al declarar un parametro', this.linea, this.columna));
        }
    };
    Funcion.prototype.declararParametrosReturnTraducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        try {
            for (var i = 0; i < this.parametros.length; i++) {
                var parametro = this.parametros[i];
                var exp = new Primitivo_1.Primitivo(0, parametro.linea, parametro.columna);
                if (parametro.tipoParametro == Tipo_1.Tipo.BOOL) {
                    exp = new Primitivo_1.Primitivo(true, parametro.linea, parametro.columna);
                }
                else if (parametro.tipoParametro == Tipo_1.Tipo.INT) {
                    exp = new Primitivo_1.Primitivo(0, parametro.linea, parametro.columna);
                }
                else if (parametro.tipoParametro == Tipo_1.Tipo.DOUBLE) {
                    exp = new Primitivo_1.Primitivo(0, parametro.linea, parametro.columna);
                }
                else if (parametro.tipoParametro == Tipo_1.Tipo.STRING) {
                    exp = new Primitivo_1.Primitivo('', parametro.linea, parametro.columna);
                }
                else if (parametro.tipoParametro == Tipo_1.Tipo.CHAR) {
                    exp = new Primitivo_1.Primitivo('', parametro.linea, parametro.columna);
                }
                var declPar = new Declaracion_1.Declaracion([parametro.id], parametro.tipoParametro, this.linea, this.columna, exp);
                declPar.traducir(ent, arbol, resultado3d, temporales, listaErrores);
            }
        }
        catch (error) {
            // console.log("Error al declarar un parametro");
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error al declarar un parametro', this.linea, this.columna));
        }
    };
    Funcion.prototype.declararParametrosTraducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        for (var i = 0; i < this.parametros.length; i++) {
            var parametro = this.parametros[i];
            var id = parametro.id;
            var simbol = new Simbolo_1.Simbolo(parametro.tipoParametro, id, parametro.linea, parametro.columna, (i + 1));
            ent.agregar(id, simbol);
        }
    };
    return Funcion;
}());
exports.Funcion = Funcion;
