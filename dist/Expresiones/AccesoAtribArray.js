"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
var AccesoAtribArray = /** @class */ (function () {
    function AccesoAtribArray(id, posicion, linea, columna) {
        this.id = id;
        this.posicion = posicion;
        this.linea = linea;
        this.columna = columna;
    }
    AccesoAtribArray.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var pos = this.posicion.traducir(ent, arbol, resultado3d, temporales, 0);
                temporales.ultimoTemp += 1;
                var stackPos = temporales.ultimoTemp;
                resultado3d.codigo3D += '\tt' + stackPos + ' = stack[(int)' + simbol.valor + '];\n';
                temporales.ultimoTemp += 1;
                var posHeap = temporales.ultimoTemp;
                resultado3d.codigo3D += '\tt' + posHeap + ' = t' + stackPos + ' + ' + pos + ';\n';
                temporales.ultimoTemp += 1;
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = heap[(int) t' + posHeap + '];\n';
                return 't' + temporales.ultimoTemp;
            }
        }
        else {
        }
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
