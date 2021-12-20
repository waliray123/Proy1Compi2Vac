"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Resultado3D_1 = require("../AST/Resultado3D");
var GenerarNativas = /** @class */ (function () {
    function GenerarNativas() {
    }
    GenerarNativas.prototype.generar = function (temporales) {
        var resultado = '';
        if (temporales.usoPrintStrings) {
            resultado += 'void printString()\{\n';
            temporales.ultimoTemp += 1;
            resultado += '\tt' + temporales.ultimoTemp + '= P + 1;\n';
            temporales.ultimoTemp += 1;
            resultado += '\tt' + temporales.ultimoTemp + '= stack[(int)t' + (temporales.ultimoTemp - 1) + '];\n';
            temporales.ultLiteral += 1;
            resultado += '\tL' + temporales.ultLiteral + ':\n';
            temporales.ultimoTemp += 1;
            resultado += '\tt' + temporales.ultimoTemp + '= heap[(int)t' + (temporales.ultimoTemp - 1) + '];\n';
            temporales.ultLiteral += 1;
            resultado += '\tif (t' + temporales.ultimoTemp + '==-1) goto L' + temporales.ultLiteral + ';\n';
            resultado += '\tprintf("%c", (char)t' + temporales.ultimoTemp + ');\n';
            resultado += '\tt' + (temporales.ultimoTemp - 1) + '= t' + (temporales.ultimoTemp - 1) + '+1;\n';
            resultado += '\tgoto L' + (temporales.ultLiteral - 1) + ';\n';
            resultado += '\tL' + (temporales.ultLiteral) + ':\n';
            resultado += '\treturn; \n\}\n';
        }
        return resultado;
    };
    GenerarNativas.prototype.generarFunciones = function (ent, arbol, temporales, listaErrores) {
        var resultado = '';
        for (var _i = 0, _a = arbol.funciones; _i < _a.length; _i++) {
            var element = _a[_i];
            if (element.nombrefuncion != 'main') {
                var resultado3d = new Resultado3D_1.Resultado3D;
                //Abrir funcion
                resultado3d.codigo3D += 'void ' + element.nombrefuncion + '(){\n';
                element.traducir(ent, arbol, resultado3d, temporales, listaErrores);
                resultado3d.codigo3D += '}\n';
                resultado += resultado3d.codigo3D;
            }
        }
        return resultado;
    };
    return GenerarNativas;
}());
exports.GenerarNativas = GenerarNativas;