"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
var Tipo_1 = require("../AST/Tipo");
=======
exports.Return = void 0;
>>>>>>> eba1c10ce4a005ef5998fcc6f603de981eb96028
// print("hola mundo");
var Return = /** @class */ (function () {
    function Return(exp, linea, columna) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }
    Return.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        var valAsign = this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
        if (temporales.ultimoTipo == Tipo_1.Tipo.BOOL) {
            if (temporales.esFuncion) {
                temporales.ultLiteral += 3;
                var ultLit = temporales.ultLiteral - 2;
                resultado3d.codigo3D += '\tif(' + valAsign + ') goto L' + ultLit + ';\n';
                resultado3d.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
                resultado3d.codigo3D += '\tL' + ultLit + ':\n';
                resultado3d.codigo3D += '\tstack[(int)P] = 1;\n';
                resultado3d.codigo3D += '\treturn;\n';
                resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
                resultado3d.codigo3D += '\tL' + (ultLit + 1) + ':\n';
                resultado3d.codigo3D += '\tstack[(int)P] = 0;\n';
                resultado3d.codigo3D += '\treturn;\n';
                resultado3d.codigo3D += '\tL' + (ultLit + 2) + ':\n';
                temporales.ultLitEscr = (ultLit + 2);
            }
        }
        else {
            if (temporales.esFuncion) {
                resultado3d.codigo3D += '\tstack[(int)P] =' + valAsign + ';\n';
                resultado3d.codigo3D += '\treturn;\n';
            }
        }
    };
    Return.prototype.ejecutar = function (ent, arbol, listaErrores) {
        // console.log('Ejecutando return');
        if (this.expresion != null) {
            var valExpr = this.expresion.getValorImplicito(ent, arbol, listaErrores);
            ent.valorReturn = valExpr;
            // console.log(ent.valorReturn);
        }
        return 'RETORNAR';
    };
    return Return;
}());
exports.Return = Return;
