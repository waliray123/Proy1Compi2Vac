"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// print("hola mundo");
var Break = /** @class */ (function () {
    function Break(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
    Break.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        resultado3D.codigo3D += '\tgoto L' + temporales.ultLiteral + ';\n';
    };
    Break.prototype.ejecutar = function (ent, arbol, listaErrores) {
        return 'ROMPER';
    };
    return Break;
}());
exports.Break = Break;
