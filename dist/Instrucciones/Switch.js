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
    Switch.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        if (this.lista_instrucciones.length > 0) {
            var valAsign = this.expresion.traducir(ent, arbol, resultado3D, temporales, listaErrores);
            var ultL = temporales.ultLiteral + 1;
            var cantCase = this.lista_instrucciones.length;
            if (this.lista_instrucciones[this.lista_instrucciones.length - 1].id.getTipo(ent, arbol, listaErrores) == Tipo_1.Tipo.NULL) {
                temporales.ultLiteral += ((cantCase - 1) * 2) + 1;
            }
            else {
                temporales.ultLiteral += cantCase * 2;
            }
            var i = 0;
            for (var _i = 0, _a = this.lista_instrucciones; _i < _a.length; _i++) {
                var caso = _a[_i];
                if (i != 0) {
                    resultado3D.codigo3D += '\tL' + ultL + ':\n';
                    ultL += 1;
                }
                if (caso.id.getTipo(ent, arbol, listaErrores) != Tipo_1.Tipo.NULL) {
                    var valorCaso = caso.id.traducir(ent, arbol, resultado3D, temporales, 0);
                    resultado3D.codigo3D += '\tif(' + valAsign + ' == ' + valorCaso + ') goto L' + ultL + ';\n';
                    resultado3D.codigo3D += '\tgoto L' + (ultL + 1) + ';\n';
                    resultado3D.codigo3D += '\tL' + ultL + ':\n';
                    if (i + 1 == this.lista_instrucciones.length) {
                        ultL += 1;
                    }
                }
                caso.traducir(ent, arbol, resultado3D, temporales, listaErrores);
                ultL += 1;
                i += 1;
            }
            ultL -= 1;
            resultado3D.codigo3D += '\tL' + (ultL) + ':\n';
            temporales.ultLitEscr = ultL;
        }
    };
    Switch.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var isFound = false;
        for (var _i = 0, _a = this.lista_instrucciones; _i < _a.length; _i++) {
            var caso = _a[_i];
            if (this.expresion.getValorImplicito(ent, arbol) == caso.id.getValorImplicito(ent, arbol, listaErrores) || caso.id.getTipo(ent, arbol, listaErrores) == Tipo_1.Tipo.NULL || isFound) {
                caso.ejecutar(ent, arbol, listaErrores);
                isFound = true;
                if (caso.getIsBreak()) {
                    break;
                }
                else if (caso.getIsContinue()) {
                    continue;
                }
            }
        }
    };
    return Switch;
}());
exports.Switch = Switch;
