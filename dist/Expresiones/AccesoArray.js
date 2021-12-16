"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoArray = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoArray = /** @class */ (function () {
    function AccesoArray(contenido, linea, columna) {
        this.contenido = contenido;
        this.linea = linea;
        this.columna = columna;
    }
    AccesoArray.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoArray.prototype.getTipo = function (ent, arbol) {
        return Tipo_1.Tipo.ARRAY;
    };
    AccesoArray.prototype.getValorImplicito = function (ent, arbol) {
        try {
            return this.contenido;
        }
        catch (e) {
            console.error("hubo un error en AccesoArray " + e);
            return null;
        }
    };
    return AccesoArray;
}());
exports.AccesoArray = AccesoArray;
