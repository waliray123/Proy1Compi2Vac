"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
var Entorno_1 = require("../AST/Entorno");
var Declaracion_1 = require("./Declaracion");
var ErrorG_1 = require("../Objetos/ErrorG");
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
        this.instrucciones.forEach(function (element) {
            element.traducir(entornoGlobal, arbol, resultado3D, temporales, listaErrores);
        });
    };
    Funcion.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var entornoGlobal = new Entorno_1.Entorno(ent);
        //Declarar todos los parametros
        this.declararParametrosReturn(entornoGlobal, arbol, listaErrores);
        //recorro todas las raices  RECURSIVA
        this.instrucciones.forEach(function (element) {
            element.ejecutar(entornoGlobal, arbol, listaErrores);
        });
        // console.log(this.instrucciones);
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
                if (parametroR.getTipo(ent, arbol, listaErrores) == parametro.tipoParametro) {
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
    return Funcion;
}());
exports.Funcion = Funcion;
