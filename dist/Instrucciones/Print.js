"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var Print = /** @class */ (function () {
    function Print(exp, linea, columna, haysalto) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
        this.haysalto = haysalto;
    }
    Print.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        var valAsign = this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
        if (temporales.ultimoTipo != Tipo_1.Tipo.STRING) {
            var parseo = '\"%f\"';
            var parseo2 = '(double)';
            resultado3d.codigo3D += '\tprintf(' + parseo + ' , ' + parseo2 + valAsign + ');\n';
            if (this.haysalto) {
                resultado3d.codigo3D += '\tprintf("%c", (char)10);\n';
            }
        }
        else {
            temporales.ultimoTemp += 1;
            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = P + ' + (temporales.ultstack + 1) + ';\n';
            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = t' + temporales.ultimoTemp + ' + 1;\n';
            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = ' + valAsign + ';\n';
            resultado3d.codigo3D += '\tP = P + ' + (temporales.ultstack + 1) + ';\n';
            resultado3d.codigo3D += '\tprintString();\n';
            resultado3d.codigo3D += '\tP = P - ' + (temporales.ultstack + 1) + ';\n';
            if (this.haysalto) {
                resultado3d.codigo3D += '\tprintf("%c", (char)10);\n';
            }
            temporales.usoPrintStrings = true;
        }
    };
    Print.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var valor = this.expresion.getValorImplicito(ent, arbol, listaErrores);
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
