"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchCaso = void 0;
var Break_1 = require("./Break");
var Continue_1 = require("./Continue");
// print("hola mundo");
var SwitchCaso = /** @class */ (function () {
    function SwitchCaso(id, lista_intstrucciones, linea, columna) {
        this.id = id;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
        this.isBreak = false;
        this.IsContinue = false;
    }
    SwitchCaso.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        for (var _i = 0, _a = this.lista_instrucciones; _i < _a.length; _i++) {
            var ints = _a[_i];
            ints.traducir(ent, arbol, resultado3D, temporales, listaErrores);
        }
    };
    SwitchCaso.prototype.ejecutar = function (ent, arbol, listaErrores) {
        for (var _i = 0, _a = this.lista_instrucciones; _i < _a.length; _i++) {
            var ints = _a[_i];
            if (ints instanceof Break_1.Break) {
                this.isBreak = true;
                break;
            }
            else if (ints instanceof Continue_1.Continue) {
                this.IsContinue = true;
                continue;
            }
            else {
                ints.ejecutar(ent, arbol, listaErrores);
            }
        }
    };
    SwitchCaso.prototype.getIsBreak = function () {
        return this.isBreak;
    };
    SwitchCaso.prototype.getIsContinue = function () {
        return this.IsContinue;
    };
    return SwitchCaso;
}());
exports.SwitchCaso = SwitchCaso;
