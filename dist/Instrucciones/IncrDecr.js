"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Operacion_1 = require("../Expresiones/Operacion");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var IncrDecr = /** @class */ (function () {
    function IncrDecr(operacion, linea, columna, idVar) {
        this.operacion = operacion;
        this.linea = linea;
        this.columna = columna;
        this.idVar = idVar;
    }
    IncrDecr.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        if (ent.existe(this.idVar)) {
            var simbol = ent.getSimbolo(this.idVar);
            temporales.ultimoTemp += 1;
            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= stack[(int)' + simbol.valor + '];\n';
            temporales.ultimoTemp += 1;
            if (this.operacion.operador == Operacion_1.Operador.INCREMENTO) {
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= t' + (temporales.ultimoTemp - 1) + '+1;\n';
            }
            else {
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= t' + (temporales.ultimoTemp - 1) + '-1;\n';
            }
            resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + ']' + '= t' + temporales.ultimoTemp + ';\n';
        }
        else {
            //Error            
        }
    };
    IncrDecr.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var valorIns = this.operacion.getValorImplicito(ent, arbol, listaErrores);
        if (valorIns !== null) {
            if (ent.existe(this.idVar)) {
                var simbol = ent.getSimbolo(this.idVar);
                simbol.valor = valorIns;
            }
            else {
                // console.log('Error semantico, no existe la variable ' + this.idVar +'en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.idVar, this.linea, this.columna));
            }
        }
        else {
            // console.log("Ocurrio un error al realizar la operacion " + this.operacion.op_izquierda);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'ocurrio un error al realizar la operacion ' + this.operacion.op_izquierda, this.linea, this.columna));
        }
    };
    return IncrDecr;
}());
exports.IncrDecr = IncrDecr;
