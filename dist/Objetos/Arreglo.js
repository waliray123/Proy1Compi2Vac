"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arreglo = void 0;
var Arreglo = /** @class */ (function () {
    function Arreglo(tipo, dimension, length, contenido, linea, columna) {
        this.tipo = tipo;
        this.dimension = dimension;
        this.length = length;
        this.contenido = contenido;
        this.linea = linea;
        this.columna = columna;
    }
    Arreglo.prototype.push = function (ent, arbol, nuevo, listaErrores) {
        if (nuevo.getTipo(ent, arbol, listaErrores) == this.tipo) {
            this.contenido.push(nuevo);
            this.length += 1;
            this.dimension += 1;
        }
        else {
            //no es del mismo tipo
        }
    };
    Arreglo.prototype.pop = function () {
        var pop = this.contenido.pop();
        var valor = this.contenido.length;
        this.length = valor;
        this.dimension = valor;
        return pop;
    };
    Arreglo.prototype.getLastContenido = function () {
        return this.contenido[this.length - 1];
    };
    Arreglo.prototype.comprobarTipo = function (ent, arbol, listaErrores) {
        var _this = this;
        var isFine = true;
        this.contenido.forEach(function (cont) {
            if (!(cont.getTipo(ent, arbol, listaErrores) == _this.tipo)) {
                isFine = false;
                console.log('Error semantico, el valor: ' + cont.getValorImplicito(ent, arbol, listaErrores) + ' no concuerda con el tipo del arreglo en la linea ' + _this.linea + ' y columna ' + _this.columna);
            }
        });
        return isFine;
    };
    return Arreglo;
}());
exports.Arreglo = Arreglo;
