"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// print("hola mundo");
var Struct = /** @class */ (function () {
    function Struct(id, lista_atributos, linea, columna) {
        this.id = id;
        this.lista_atributos = lista_atributos;
        this.linea = linea;
        this.columna = columna;
    }
    Struct.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Struct.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...' + this.id);
    };
    Struct.prototype.getTipo = function () {
        return "struct";
    };
    return Struct;
}());
exports.Struct = Struct;
