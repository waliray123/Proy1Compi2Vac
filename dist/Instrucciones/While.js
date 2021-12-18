"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
var Entorno_1 = require("../AST/Entorno");
var While = /** @class */ (function () {
    function While(linea, columna, instrucciones, expresion) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion = expresion;
    }
    While.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        var entornolocal = new Entorno_1.Entorno(ent);
        if (temporales.ultLiteral == 0) {
            resultado3D.codigo3D += '\tL' + temporales.ultLiteral + ":\n";
            temporales.ultLitEscr = 0;
        }
        var ultEscrito = temporales.ultLitEscr;
        temporales.ultLiteral += 2;
        var ulLit = temporales.ultLiteral - 1;
        var valAsign = this.expresion.traducir(entornolocal, arbol, resultado3D, temporales, 0);
        resultado3D.codigo3D += '\tif(' + valAsign + ') goto L' + ulLit + ';\n';
        resultado3D.codigo3D += '\tgoto L' + (ulLit + 1) + ';\n';
        resultado3D.codigo3D += '\tL' + (ulLit) + ':\n';
        //Traducir instrucciones
        this.instrucciones.forEach(function (element) {
            element.traducir(entornolocal, arbol, resultado3D, temporales, listaErrores);
        });
        resultado3D.codigo3D += '\tgoto L' + (ultEscrito) + ';\n';
        resultado3D.codigo3D += '\tL' + (ulLit + 1) + ':\n';
        temporales.ultLitEscr = ulLit + 1;
    };
    While.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var entornolocal = new Entorno_1.Entorno(ent);
        var realizar = this.expresion.getValorImplicito(entornolocal, arbol, listaErrores);
        var contSalir = 0;
        while (realizar) {
            this.instrucciones.forEach(function (element) {
                element.ejecutar(entornolocal, arbol, listaErrores);
            });
            realizar = this.expresion.getValorImplicito(entornolocal, arbol, listaErrores);
            if (contSalir == 5000) {
                realizar = false;
            }
            contSalir++;
        }
    };
    return While;
}());
exports.While = While;
