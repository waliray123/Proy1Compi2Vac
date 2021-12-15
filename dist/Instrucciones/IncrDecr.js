"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// print("hola mundo");
var IncrDecr = /** @class */ (function () {
    function IncrDecr(operacion, linea, columna, idVar) {
        this.operacion = operacion;
        this.linea = linea;
        this.columna = columna;
        this.idVar = idVar;
    }
    IncrDecr.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    IncrDecr.prototype.ejecutar = function (ent, arbol) {
        var valorIns = this.operacion.getValorImplicito(ent, arbol);
        if (valorIns !== null) {
            if (ent.existe(this.idVar)) {
                var simbol = ent.getSimbolo(this.idVar);
                simbol.valor = valorIns;
            }
            else {
                console.log('Error semantico, no existe la variable ' + this.idVar + 'en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
        else {
            console.log("Ocurrio un error al realizar la operacion " + this.operacion.op_izquierda);
        }
    };
    return IncrDecr;
}());
exports.IncrDecr = IncrDecr;