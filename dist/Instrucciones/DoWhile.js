"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entorno_1 = require("../AST/Entorno");
var DoWhile = /** @class */ (function () {
    function DoWhile(linea, columna, instrucciones, expresion) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion = expresion;
    }
    DoWhile.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        var entornolocal = new Entorno_1.Entorno(ent);
        if (temporales.ultLiteral == 0) {
            resultado3D.codigo3D += '\tL' + temporales.ultLiteral + ":\n";
        }
        var ulLit = temporales.ultLiteral;
        temporales.ultLiteral += 1;
        this.instrucciones.forEach(function (element) {
            element.traducir(entornolocal, arbol, resultado3D, temporales, listaErrores);
        });
        var valAsign = this.expresion.traducir(entornolocal, arbol, resultado3D, temporales, 0);
        resultado3D.codigo3D += '\tif(' + valAsign + ') goto L' + ulLit + ';\n';
    };
    DoWhile.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var entornolocal = new Entorno_1.Entorno(ent);
        var realizar = this.expresion.getValorImplicito(entornolocal, arbol, listaErrores);
        var contSalir = 0;
        do {
            for (var _i = 0, _a = this.instrucciones; _i < _a.length; _i++) {
                var element = _a[_i];
                var valR = element.ejecutar(entornolocal, arbol, listaErrores);
                if (valR == 'RETORNAR') {
                    ent.valorReturn = entornolocal.valorReturn;
                    return 'RETORNAR';
                }
            }
            realizar = this.expresion.getValorImplicito(entornolocal, arbol, listaErrores);
            if (contSalir == 5000) {
                realizar = false;
            }
            contSalir++;
        } while (realizar);
    };
    return DoWhile;
}());
exports.DoWhile = DoWhile;
