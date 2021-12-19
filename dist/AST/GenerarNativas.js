"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    return GenerarNativas;
}());
exports.GenerarNativas = GenerarNativas;
