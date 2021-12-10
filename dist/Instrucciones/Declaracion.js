"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
// print("hola mundo");
var Declaracion = /** @class */ (function () {
    function Declaracion(id, tipo, linea, columna, expresion) {
        if (expresion === void 0) { expresion = null; }
        this.id = id;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Declaracion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Declaracion.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...' + this.id);
    };
    return Declaracion;
}());
exports.Declaracion = Declaracion;
