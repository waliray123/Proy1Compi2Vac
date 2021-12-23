"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entorno_1 = require("../AST/Entorno");
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
var ArrbegEnd_1 = require("../Expresiones/ArrbegEnd");
var Primitivo_1 = require("../Expresiones/Primitivo");
var Arreglo_1 = require("../Objetos/Arreglo");
var ErrorG_1 = require("../Objetos/ErrorG");
var Asignacion_1 = require("./Asignacion");
var CasoForIn;
(function (CasoForIn) {
    CasoForIn[CasoForIn["IDVAR"] = 0] = "IDVAR";
    CasoForIn[CasoForIn["ARRBEGEND"] = 1] = "ARRBEGEND";
    CasoForIn[CasoForIn["ARRAY"] = 2] = "ARRAY";
    CasoForIn[CasoForIn["NULL"] = 3] = "NULL";
})(CasoForIn = exports.CasoForIn || (exports.CasoForIn = {}));
var Forin = /** @class */ (function () {
    function Forin(linea, columna, instrucciones, expresion1, expresion2) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }
    Forin.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Forin.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var variable = this.expresion1;
        var condicion = this.expresion2;
        var entNuevo = new Entorno_1.Entorno(ent);
        var casoForIn = CasoForIn.NULL;
        //variables nulos 
        var condicionArreglo = [];
        //configurando la declaracion
        var tipoVariable = Tipo_1.Tipo.NULL;
        //IDVAR
        //[]
        //array[]
        if (condicion instanceof ArrbegEnd_1.ArrbegEnd) {
            //array[]
            casoForIn = CasoForIn.ARRBEGEND;
            condicion.isAlone = false;
            tipoVariable = condicion.getTipo(ent, arbol, listaErrores);
            condicion.isAlone = true;
        }
        else if (typeof (condicion) === 'string') {
            //IDVAR
            if (ent.existe(condicion)) {
                casoForIn = CasoForIn.IDVAR;
                var simbol = ent.getSimbolo(condicion);
                var valor = simbol.getValorImplicito(ent, arbol);
                if (valor instanceof Arreglo_1.Arreglo) {
                    tipoVariable = valor.tipo;
                }
                else {
                    tipoVariable = simbol.getTipo(ent, arbol);
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + condicion, this.linea, this.columna));
            }
        }
        else {
            //[]            
            condicionArreglo = condicion;
            if (condicionArreglo.length > 0) {
                casoForIn = CasoForIn.ARRAY;
                tipoVariable = condicionArreglo[0].getTipo(ent, arbol, listaErrores);
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'El arreglo esta vacio ', this.linea, this.columna));
            }
        }
        // //@ts-ignore
        // let declaraVariable: Declaracion = new Declaracion(variables,Tipo.STRING,this.linea,this.columna,null);
        if (!entNuevo.existeEnActual(variable)) {
            var simbol = new Simbolo_1.Simbolo(tipoVariable, variable, this.linea, this.columna, null);
            entNuevo.agregar(variable, simbol);
        }
        else {
            console.log('anda medio raro que si exista');
        }
        var isTerminado = false;
        switch (casoForIn) {
            case CasoForIn.ARRAY: {
                for (var _i = 0, condicionArreglo_1 = condicionArreglo; _i < condicionArreglo_1.length; _i++) {
                    var atributo = condicionArreglo_1[_i];
                    var valor = atributo.getValorImplicito(ent, arbol, listaErrores);
                    var expr = new Primitivo_1.Primitivo(valor, this.linea, this.columna);
                    var variables = [];
                    variables.push(variable);
                    var asignar = new Asignacion_1.Asignacion(variables, this.linea, this.columna, expr);
                    asignar.ejecutar(entNuevo, arbol, listaErrores);
                    for (var _a = 0, _b = this.instrucciones; _a < _b.length; _a++) {
                        var instruccion = _b[_a];
                        instruccion.ejecutar(entNuevo, arbol, listaErrores);
                    }
                }
                break;
            }
            case CasoForIn.IDVAR: {
                var simbol = ent.getSimbolo(condicion);
                var valor = simbol.getValorImplicito(ent, arbol);
                if (valor instanceof Arreglo_1.Arreglo) {
                    for (var _c = 0, _d = valor.contenido; _c < _d.length; _c++) {
                        atributo = _d[_c];
                        var valor_1 = atributo.getValorImplicito(ent, arbol, listaErrores);
                        var expr = new Primitivo_1.Primitivo(valor_1, this.linea, this.columna);
                        var variables = [];
                        variables.push(variable);
                        var asignar = new Asignacion_1.Asignacion(variables, this.linea, this.columna, expr);
                        asignar.ejecutar(entNuevo, arbol, listaErrores);
                        for (var _e = 0, _f = this.instrucciones; _e < _f.length; _e++) {
                            var instruccion = _f[_e];
                            instruccion.ejecutar(entNuevo, arbol, listaErrores);
                        }
                    }
                }
                else {
                    for (var i = 0; i < valor.length; i++) {
                        var letra = valor.substr(i, 1);
                        var variables = [];
                        variables.push(variable);
                        var expr = new Primitivo_1.Primitivo(letra, this.linea, this.columna);
                        var asignar = new Asignacion_1.Asignacion(variables, this.linea, this.columna, expr);
                        asignar.ejecutar(entNuevo, arbol, listaErrores);
                        for (var _g = 0, _h = this.instrucciones; _g < _h.length; _g++) {
                            var instruccion = _h[_g];
                            instruccion.ejecutar(entNuevo, arbol, listaErrores);
                        }
                    }
                }
                break;
            }
            case CasoForIn.ARRBEGEND: {
                if (condicion instanceof ArrbegEnd_1.ArrbegEnd) {
                    var content = condicion.getListaDatos(ent, arbol, listaErrores);
                    for (var _j = 0, content_1 = content; _j < content_1.length; _j++) {
                        var atributo = content_1[_j];
                        var valor = atributo.getValorImplicito(ent, arbol, listaErrores);
                        var expr = new Primitivo_1.Primitivo(valor, this.linea, this.columna);
                        var variables = [];
                        variables.push(variable);
                        var asignar = new Asignacion_1.Asignacion(variables, this.linea, this.columna, expr);
                        asignar.ejecutar(entNuevo, arbol, listaErrores);
                        for (var _k = 0, _l = this.instrucciones; _k < _l.length; _k++) {
                            var instruccion = _l[_k];
                            instruccion.ejecutar(entNuevo, arbol, listaErrores);
                        }
                    }
                }
                break;
            }
            default:
                break;
        }
    };
    Forin.prototype.getValDefault = function (tipo) {
        if (tipo == Tipo_1.Tipo.STRING) {
            return "undefined";
        }
        else if (tipo == Tipo_1.Tipo.BOOL) {
            return true;
        }
        else if (tipo == Tipo_1.Tipo.INT) {
            return 1;
        }
        else if (tipo == Tipo_1.Tipo.CHAR) {
            return 'a';
        }
        else if (tipo == Tipo_1.Tipo.DOUBLE) {
            return 1.0;
        }
        else {
            return null;
        }
    };
    return Forin;
}());
exports.Forin = Forin;
