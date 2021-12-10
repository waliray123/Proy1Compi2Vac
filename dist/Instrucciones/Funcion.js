"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
var AST_1 = require("../AST/AST");
var Entorno_1 = require("../AST/Entorno");
var Funcion = /** @class */ (function () {
    function Funcion(nombrefuncion, tipoFuncion, linea, columna, instrucciones, parametros) {
        if (parametros === void 0) { parametros = []; }
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.tipoFuncion = tipoFuncion;
        this.parametros = parametros;
    }
    Funcion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Funcion.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado funcion ...' + this.nombrefuncion);
        var ast = new AST_1.AST(this.instrucciones);
        var entornoGlobal = new Entorno_1.Entorno(null);
        //recorro todas las raices  RECURSIVA
        this.instrucciones.forEach(function (element) {
            element.ejecutar(entornoGlobal, ast);
        });
        // console.log(this.instrucciones);
    };
    return Funcion;
}());
exports.Funcion = Funcion;
