"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoAtribArray = void 0;
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
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
    AccesoAtribArray.prototype.getTipo = function (ent, arbol, listaErrores) {
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
    AccesoAtribArray.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                var pos = this.posicion.getValorImplicito(ent, arbol, listaErrores);
                if (typeof (pos) == 'number') {
                    if (pos >= 0 && pos < valor.length) {
                        return valor.contenido[pos].getValorImplicito(ent, arbol, listaErrores);
                    }
                    else {
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'index fuera del limite del arreglo', this.linea, this.columna));
                        return null;
                    }
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable no es del tipo array', this.linea, this.columna));
            }
        }
        else {
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.id, this.linea, this.columna));
        }
    };
    return AccesoAtribArray;
}());
exports.AccesoAtribArray = AccesoAtribArray;
