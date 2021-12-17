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
    For.prototype.traducir = function (ent, arbol, resultado3D, temporales) {
        var entornolocal = new Entorno_1.Entorno(ent);
        if (temporales.ultLiteral == 0) {
            resultado3D.codigo3D += '\tL' + temporales.ultLiteral + ":\n";
            temporales.ultLitEscr = 0;
        }
        this.declAsign.traducir(entornolocal, arbol, resultado3D, temporales);
        temporales.ultLiteral += 3; //Cuantos literales va a utilizar        
        var ulLit = temporales.ultLiteral - 2;
        resultado3D.codigo3D += '\tL' + (ulLit) + ':\n';
        var valAsign = this.expresion1.traducir(entornolocal, arbol, resultado3D, temporales, 0);
        resultado3D.codigo3D += '\tif(' + valAsign + ') goto L' + (ulLit + 1) + ';\n';
        resultado3D.codigo3D += '\tgoto L' + (ulLit + 2) + ';\n';
        resultado3D.codigo3D += '\tL' + (ulLit + 1) + ':\n';
        //Traducir instrucciones
        this.instrucciones.forEach(function (element) {
            element.traducir(entornolocal, arbol, resultado3D, temporales);
        });
        //Traducir el incremento o decremento
        var id = this.expresion2.op_izquierda.getId();
        if (entornolocal.existe(id)) {
            var simbol = entornolocal.getSimbolo(id);
            resultado3D.codigo3D += '\tt' + temporales.ultimoTemp + '= ' + 'stack[(int)' + simbol.valor + ']' + ';\n';
            temporales.ultimoTemp += 1;
            resultado3D.codigo3D += '\tt' + (temporales.ultimoTemp - 1) + '= ' + 't' + (temporales.ultimoTemp - 1) + ' + 1;\n';
            resultado3D.codigo3D += '\tstack[(int)' + simbol.valor + '] = t' + (temporales.ultimoTemp - 1) + ';\n';
            simbol.valor;
        }
        else {
            console.log('Error semantico, no existe la variable ' + id + 'en la linea ' + this.linea + ' y columna ' + this.columna);
        }
        //Traducir el regreso
        resultado3D.codigo3D += '\tgoto L' + (ulLit) + ';\n';
        resultado3D.codigo3D += '\tL' + (ulLit + 2) + ':\n';
        temporales.ultLitEscr = ulLit + 2;
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
            var valAsig = this.expresion2.getValorImplicito(entornolocal, arbol);
            //Luego se obtiene el id de la operacion y se asigna el valor de la operacion; 
            var id = this.expresion2.op_izquierda.getId();
            if (entornolocal.existe(id)) {
                var simbol = entornolocal.getSimbolo(id);
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
