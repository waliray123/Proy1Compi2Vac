"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
var Tipo_1 = require("../AST/Tipo");
// print("hola mundo");
var Switch = /** @class */ (function () {
    function Switch(expresion, lista_intstrucciones, linea, columna) {
        this.expresion = expresion;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    Switch.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Switch.prototype.ejecutar = function (ent, arbol, listaErrores) {
        for (var _i = 0, _a = this.lista_instrucciones; _i < _a.length; _i++) {
            var caso = _a[_i];
            if (this.expresion.getValorImplicito(ent, arbol) == caso.id.getValorImplicito(ent, arbol, listaErrores) || caso.id.getTipo(ent, arbol, listaErrores) == Tipo_1.Tipo.NULL) {
                caso.ejecutar(ent, arbol, listaErrores);
                if (caso.getIsBreak()) {
                    break;
                }
            }
        }
    };
    return Switch;
}());
exports.Switch = Switch;
