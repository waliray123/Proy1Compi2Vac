"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pop = void 0;
var Tipo_1 = require("../AST/Tipo");
// print("hola mundo");
var Pop = /** @class */ (function () {
    function Pop(id, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
    }
    Pop.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Pop.prototype.ejecutar = function (ent, arbol) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                valor.pop();
            }
            else {
                //no es de tipo array
            }
        }
        else {
            //no existe el id
        }
    };
    return Pop;
}());
exports.Pop = Pop;
