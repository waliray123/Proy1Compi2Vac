"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var AsignacionArray = /** @class */ (function () {
    function AsignacionArray(id, posicion, linea, columna, expresion) {
        this.id = id;
        this.posicion = posicion;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    AsignacionArray.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AsignacionArray.prototype.ejecutar = function (ent, arbol) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                var pos = this.posicion.getValorImplicito(ent, arbol);
                if (typeof (pos) == 'number') {
                    if (pos >= 0 && pos < valor.length) {
                        if (this.expresion.getTipo(ent, arbol) == valor.tipo) {
                            valor.contenido[pos] = this.expresion;
                        }
                        else {
                        }
                    }
                    else {
                    }
                }
            }
            else {
            }
        }
        else {
        }
    };
    AsignacionArray.prototype.getTipo = function () {
        return "asignacion";
    };
    return AsignacionArray;
}());
exports.AsignacionArray = AsignacionArray;
