"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
// print("hola mundo");
var Break = /** @class */ (function () {
    function Break(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
    Break.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Break.prototype.ejecutar = function (ent, arbol) {
        // console.log('ejecutado...'+ this.id);
    };
    return Break;
}());
exports.Break = Break;
