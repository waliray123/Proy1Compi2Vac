"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
var Asignacion = /** @class */ (function () {
    function Asignacion(id, linea, columna, expresion) {
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Asignacion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Asignacion.prototype.ejecutar = function (ent, arbol) {
        var _this = this;
        this.id.forEach(function (id) {
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                if (tipo == _this.expresion.getTipo(ent, arbol)) {
                    simbol.valor = _this.expresion.getValorImplicito(ent, arbol);
                }
                else {
                    console.log('Error semantico, El tipo de la variable (' + tipo + ') no concuerda con el tipo asignado (' + _this.expresion.getTipo(ent, arbol) + ') en la linea ' + _this.linea + ' y columna ' + _this.columna);
                }
            }
            else {
                console.log('Error semantico, no existe la variable ' + id + 'en la linea ' + _this.linea + ' y columna ' + _this.columna);
            }
        });
    };
    return Asignacion;
}());
exports.Asignacion = Asignacion;
