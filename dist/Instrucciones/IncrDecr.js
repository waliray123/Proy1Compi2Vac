"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// print("hola mundo");
var IncrDecr = /** @class */ (function () {
    function IncrDecr(operacion, linea, columna) {
        this.operacion = operacion;
        this.linea = linea;
        this.columna = columna;
    }
    IncrDecr.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    IncrDecr.prototype.ejecutar = function (ent, arbol) {
        var valor = this.operacion.getValorImplicito(ent, arbol);
        if (valor !== null) {
            var id = this.operacion.op_izquierda;
            console.log(id);
            /*
            if (ent.existe(id)) {
                let simbol: Simbolo = ent.getSimbolo(id);
                let tipo: Tipo = simbol.getTipo(ent,arbol);
                if (tipo == this.expresion.getTipo(ent,arbol)) {
                    simbol.valor = this.expresion.getValorImplicito(ent,arbol);
                }else{
                    console.log('Error semantico, El tipo de la variable (' + tipo +') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent,arbol) + ') en la linea '+ this.linea + ' y columna ' + this.columna);
                }
            }else{
                console.log('Error semantico, no existe la variable ' + id +'en la linea '+ this.linea + ' y columna ' + this.columna);
            }
*/
        }
        else {
            console.log("Ocurrio un error al realizar la operacion " + this.operacion.op_izquierda);
        }
    };
    return IncrDecr;
}());
exports.IncrDecr = IncrDecr;
