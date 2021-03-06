"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionArray = void 0;
var Tipo_1 = require("../AST/Tipo");
var Primitivo_1 = require("../Expresiones/Primitivo");
var ErrorG_1 = require("../Objetos/ErrorG");
var AsignacionArray = /** @class */ (function () {
    function AsignacionArray(id, posicion, linea, columna, expresion) {
        this.id = id;
        this.posicion = posicion;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    AsignacionArray.prototype.traducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                // let valor:Arreglo = simbol.getValorImplicito(ent,arbol);
                var pos = this.posicion.traducir(ent, arbol, resultado3d, temporales, 0);
                var val = this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
                temporales.ultimoTemp += 1;
                var stackPos = temporales.ultimoTemp;
                resultado3d.codigo3D += '\tt' + stackPos + ' = stack[(int)' + simbol.valor + '];\n';
                temporales.ultimoTemp += 1;
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = t' + stackPos + ' + ' + pos + ';\n';
                resultado3d.codigo3D += '\theap[(int) t' + temporales.ultimoTemp + '] =' + val + ';\n';
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable no es del tipo array', this.linea, this.columna));
            }
        }
        else {
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable', this.linea, this.columna));
        }
    };
    AsignacionArray.prototype.ejecutar = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                var pos = this.posicion.getValorImplicito(ent, arbol, listaErrores);
                if (typeof (pos) == 'number') {
                    if (pos >= 0 && pos < valor.length) {
                        if (this.expresion.getTipo(ent, arbol, listaErrores) == valor.tipo) {
                            if (this.expresion instanceof Primitivo_1.Primitivo) {
                                valor.contenido[pos] = this.expresion;
                            }
                            else {
                                var valorC = this.expresion.getValorImplicito(ent, arbol, listaErrores);
                                var primitivo = new Primitivo_1.Primitivo(valorC, this.expresion.linea, this.expresion.columna);
                                valor.contenido[pos] = primitivo;
                            }
                        }
                        else {
                            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no esta en el rango del arreglo', this.linea, this.columna));
                        }
                    }
                    else {
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la posicion declarada no es un numero', this.linea, this.columna));
                    }
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable no es del tipo array', this.linea, this.columna));
            }
        }
        else {
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable', this.linea, this.columna));
        }
    };
    AsignacionArray.prototype.getTipo = function () {
        return "asignacion";
    };
    return AsignacionArray;
}());
exports.AsignacionArray = AsignacionArray;
