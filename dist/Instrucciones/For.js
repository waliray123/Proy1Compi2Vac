"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entorno_1 = require("../AST/Entorno");
var For = /** @class */ (function () {
    function For(linea, columna, instrucciones, declAsign, expresion1, expresion2) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.declAsign = declAsign;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }
    For.prototype.traducir = function (ent, arbol) {
    };
    For.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...fornormal');
        var entornolocal = new Entorno_1.Entorno(ent);
        this.declAsign.ejecutar(entornolocal, arbol);
        //expresion 1 es la que hay que validar 
        console.log("empezando el while  en for");
        while (this.expresion1.getValorImplicito(entornolocal, arbol) == true) {
            //Realizar instrucciones
            this.instrucciones.forEach(function (element) {
                element.ejecutar(entornolocal, arbol);
            });
            //Sumar o realizar la expresion2            
            //Primero se obtiene la operacion;
            console.log("Obteniendo la operacion  en for");
            console.log(this.expresion2);
            var valAsig = this.expresion2.getValorImplicito(entornolocal, arbol);
            console.log("Valor asignar" + valAsig);
            //Luego se obtiene el id de la operacion y se asigna el valor de la operacion; 
            console.log("Obteniendo el id  en for");
            var id = this.expresion2.op_izquierda.getId();
            console.log(id);
            if (entornolocal.existe(id)) {
                var simbol = entornolocal.getSimbolo(id);
                console.log(simbol);
                simbol.valor = valAsig;
            }
            else {
                console.log('Error semantico, no existe la variable ' + id + 'en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
    };
    return For;
}());
exports.For = For;
