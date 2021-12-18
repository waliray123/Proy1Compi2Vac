"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var Print = /** @class */ (function () {
    function Print(exp, linea, columna, haysalto) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
        this.haysalto = haysalto;
    }
    Print.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Print.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
        if (valor !== null) {
            console.log('>', valor);
            var area = document.getElementById('consola');
            if (this.haysalto) {
                area.value = area.value + valor + "\n";
            }
            else {
                area.value = area.value + valor;
            }
        }
        else {
            console.log('>> Error, no se pueden imprimir valores nulos');
            listaErrores.push(new ErrorG_1.ErrorG('semantico', '>> Error, no se pueden imprimir valores nulos', this.linea, this.columna));
        }
    };
    return Print;
}());
exports.Print = Print;
