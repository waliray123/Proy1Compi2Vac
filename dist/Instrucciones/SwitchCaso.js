"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchCaso = void 0;
var Break_1 = require("./Break");
// print("hola mundo");
var SwitchCaso = /** @class */ (function () {
    function SwitchCaso(id, lista_intstrucciones, linea, columna) {
        this.id = id;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
        this.isBreak = false;
    }
    SwitchCaso.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    SwitchCaso.prototype.ejecutar = function (ent, arbol) {
        for (var _i = 0, _a = this.lista_instrucciones; _i < _a.length; _i++) {
            var ints = _a[_i];
            if (ints instanceof Break_1.Break) {
                this.isBreak = true;
                break;
            }
            else {
                ints.ejecutar(ent, arbol);
            }
        }
    };
    SwitchCaso.prototype.getIsBreak = function () {
        return this.isBreak;
    };
    return SwitchCaso;
}());
exports.SwitchCaso = SwitchCaso;
