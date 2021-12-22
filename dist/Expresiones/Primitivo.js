"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var Primitivo = /** @class */ (function () {
    function Primitivo(valor, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
        this.isFlotante = false;
    }
    Primitivo.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        console.log("Traduciendo Primitivo");
        var tipo = this.getTipo(ent, arbol, []);
        temporales.ultimoTipo = tipo;
        if (tipo == Tipo_1.Tipo.STRING) {
            temporales.ultimoTemp += 1;
            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= H;\n';
            for (var i = 0; i < this.valor.length; i++) {
                var letra = this.valor.substr(i, 1);
                var valLet = letra.charCodeAt();
                resultado3d.codigo3D += '\theap[(int)H] = ' + valLet + ';\n';
                resultado3d.codigo3D += '\tH = H + 1;\n';
                console.log(valLet);
            }
            resultado3d.codigo3D += '\theap[(int)H] = -1;\n';
            resultado3d.codigo3D += '\tH = H + 1;\n';
            return 't' + temporales.ultimoTemp;
        }
        else if (tipo == Tipo_1.Tipo.BOOL) {
            if (this.valor == true) {
                return 1;
            }
            else {
                return 0;
            }
        }
        else {
            return this.valor;
        }
    };
    Primitivo.prototype.getTipo = function (ent, arbol, listaErrores) {
        var valor = this.getValorImplicito(ent, arbol, listaErrores);
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isFlotante) {
                return Tipo_1.Tipo.DOUBLE;
            }
            if (this.isInt(Number(valor))) {
                return Tipo_1.Tipo.INT;
            }
            return Tipo_1.Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo_1.Tipo.NULL;
        }
        return Tipo_1.Tipo.VOID;
    };
    Primitivo.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        return this.valor;
    };
    Primitivo.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Primitivo;
}());
exports.Primitivo = Primitivo;
