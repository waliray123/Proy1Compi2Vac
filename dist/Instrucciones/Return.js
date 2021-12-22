"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
// print("hola mundo");
var Return = /** @class */ (function () {
    function Return(exp, linea, columna) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }
    Return.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
    };
    Return.prototype.ejecutar = function (ent, arbol, listaErrores) {
        // console.log('Ejecutando return');
        if (this.expresion != null) {
            var valExpr = this.expresion.getValorImplicito(ent, arbol, listaErrores);
            ent.valorReturn = valExpr;
            // console.log(ent.valorReturn);
        }
        return 'RETORNAR';
    };
    return Return;
}());
exports.Return = Return;
