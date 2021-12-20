"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Push = void 0;
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var Push = /** @class */ (function () {
    function Push(id, expresion, linea, columna) {
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Push.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Push.prototype.ejecutar = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                valor.push(ent, arbol, this.expresion, listaErrores);
            }
            else {
                //no es de tipo array
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable no es del tipo array', this.linea, this.columna));
            }
        }
        else {
            //no existe el id
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.id, this.linea, this.columna));
        }
    };
    return Push;
}());
exports.Push = Push;
