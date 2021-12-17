"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var AccesoAtribArray = /** @class */ (function () {
    function AccesoAtribArray(id, posicion, linea, columna) {
        this.id = id;
        this.posicion = posicion;
        this.linea = linea;
        this.columna = columna;
    }
    AccesoAtribArray.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoAtribArray.prototype.getTipo = function (ent, arbol) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                return valor.tipo;
            }
            else {
                return Tipo_1.Tipo.NULL;
            }
        }
        else {
            return Tipo_1.Tipo.NULL;
        }
    };
    AccesoAtribArray.prototype.getValorImplicito = function (ent, arbol) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                var pos = this.posicion.getValorImplicito(ent, arbol);
                if (typeof (pos) == 'number') {
                    if (pos >= 0 && pos < valor.length) {
                        return valor.contenido[pos].getValorImplicito(ent, arbol);
                    }
                    else {
                        return null;
                    }
                }
            }
            else {
            }
        }
        else {
        }
    };
    return AccesoAtribArray;
}());
exports.AccesoAtribArray = AccesoAtribArray;
