"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var AccesoArray = /** @class */ (function () {
    function AccesoArray(contenido, linea, columna) {
        this.contenido = contenido;
        this.linea = linea;
        this.columna = columna;
    }
    AccesoArray.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        temporales.ultimoTemp += 1;
        var tempAux = temporales.ultimoTemp;
        resultado3d.codigo3D += '\tt' + tempAux + '= H;\n';
        temporales.ultimoTemp += 1;
        this.contenido.forEach(function (contenido) {
            var valor = contenido.traducir(ent, arbol, resultado3d, temporales, 0);
            resultado3d.codigo3D += '\theap[(int)H] = ' + valor + ';\n';
            resultado3d.codigo3D += '\tH = H + 1;\n';
        });
        resultado3d.codigo3D += '\theap[(int)H] = -1;\n';
        resultado3d.codigo3D += '\tH = H + 1;\n';
        return 't' + tempAux;
    };
    AccesoArray.prototype.getTipo = function (ent, arbol, listaErrores) {
        return Tipo_1.Tipo.ARRAY;
    };
    AccesoArray.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        try {
            return this.contenido;
        }
        catch (e) {
            console.error("hubo un error en AccesoArray " + e);
            return null;
        }
    };
    return AccesoArray;
}());
exports.AccesoArray = AccesoArray;
