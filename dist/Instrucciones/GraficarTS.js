"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraficarTS = void 0;
var GraficarTS = /** @class */ (function () {
    function GraficarTS(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
    GraficarTS.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        //Traducri
    };
    GraficarTS.prototype.ejecutar = function (ent, arbol, listaErrores) {
        console.log('Ejecutando grafica');
        var tablaSimbolos = document.getElementById('tabla-simbolos');
        for (var e = ent; e != null; e = e.anterior) {
            var tabla = e.tabla;
            var cont_1 = 0;
            for (var key in tabla) {
                var simbolo = tabla[key];
                var tipoSim = simbolo.getTipo(ent, arbol);
                var entorno = e.nombreEntorno;
                if (entorno == '') {
                    entorno = 'global';
                }
                var valorfila = '<td>' + 'variable' + '</td><td>' + simbolo.indentificador + '</td><td>' + tipoSim + '</td><td>' + simbolo.linea + '</td><td>'
                    + simbolo.columna + '</td><td>' + cont_1 + '</td><td>' + entorno + '</td><td>' + simbolo.valor + '</td><td>';
                tablaSimbolos.insertRow(-1).innerHTML = valorfila;
                cont_1++;
            }
        }
        var funciones = arbol.funciones;
        var cont = 0;
        for (var _i = 0, funciones_1 = funciones; _i < funciones_1.length; _i++) {
            var funcion = funciones_1[_i];
            var valorfila = '<td>' + 'variable' + '</td><td>' + funcion.nombrefuncion + '</td><td>' + funcion.tipoFuncion + '</td><td>' + funcion.linea + '</td><td>'
                + funcion.columna + '</td><td>' + cont + '</td><td>' + 'global' + '</td><td>' + '' + '</td><td>';
            tablaSimbolos.insertRow(-1).innerHTML = valorfila;
            cont++;
        }
    };
    GraficarTS.prototype.getTipoFun = function () {
    };
    GraficarTS.prototype.getTipo = function () {
        return "graficarTS";
    };
    return GraficarTS;
}());
exports.GraficarTS = GraficarTS;
