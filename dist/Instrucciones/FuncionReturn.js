"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FuncionReturn = /** @class */ (function () {
    function FuncionReturn(nombrefuncion, linea, columna, parametros) {
        if (parametros === void 0) { parametros = []; }
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.parametros = parametros;
    }
    FuncionReturn.prototype.traducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        var funciones = arbol.funciones;
        var temporalReturn = '';
        for (var _i = 0, funciones_1 = funciones; _i < funciones_1.length; _i++) {
            var element = funciones_1[_i];
            if (this.nombrefuncion == element.nombrefuncion) {
                if (temporales.esFuncion) {
                    //Asignar parametros
                    var cont = 0;
                    for (var _a = 0, _b = this.parametros; _a < _b.length; _a++) {
                        var parametro = _b[_a];
                        var valAsign = parametro.valor.traducir(ent, arbol, resultado3d, temporales, 0);
                        if (cont == 0) {
                            temporales.ultimoTemp += 1;
                            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = P + ' + (temporales.ultstack + 4) + ';\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = ' + valAsign + ';\n';
                        }
                        else {
                            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = ' + temporales.ultimoTemp + ' + 1;\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = ' + valAsign + ';\n';
                        }
                    }
                    //Llamar a la funcion
                    resultado3d.codigo3D += '\tP = P + ' + (temporales.ultstack + 3) + ';\n';
                    resultado3d.codigo3D += '\t' + this.nombrefuncion + '();\n';
                    temporales.ultimoTemp += 1;
                    resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = stack[(int)P];\n';
                    resultado3d.codigo3D += '\tP = P - ' + (temporales.ultstack + 3) + ';\n'; // en P insertare el return y lo parametros en P +1
                    temporalReturn = 't' + temporales.ultimoTemp;
                }
                else {
                    //let ultTemp = temporales.ultimoTemp;
                    //Asignar parametros
                    var cont = 0;
                    for (var _c = 0, _d = this.parametros; _c < _d.length; _c++) {
                        var parametro = _d[_c];
                        var valAsign = parametro.valor.traducir(ent, arbol, resultado3d, temporales, 0);
                        if (cont == 0) {
                            temporales.ultimoTemp += 1;
                            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = P + ' + (temporales.ultstack + 2) + ';\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = ' + valAsign + ';\n';
                        }
                        else {
                            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = ' + temporales.ultimoTemp + ' + 1;\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = ' + valAsign + ';\n';
                        }
                    }
                    //Llamar a la funcion
                    resultado3d.codigo3D += '\tP = P + ' + (temporales.ultstack + 1) + ';\n';
                    resultado3d.codigo3D += '\t' + this.nombrefuncion + '();\n';
                    temporales.ultimoTemp += 1;
                    resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = stack[(int)P];\n';
                    resultado3d.codigo3D += '\tP = P - ' + (temporales.ultstack + 1) + ';\n'; // en P insertare el return y lo parametros en P +1
                    temporalReturn = 't' + temporales.ultimoTemp;
                }
                //resultado3d.codigo3D += '\tstack[(int)t'+temporales.ultimoTemp+'] = '+valAsign+';\n';
                break;
            }
        }
        return temporalReturn;
    };
    FuncionReturn.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var funciones = arbol.funciones;
        for (var _i = 0, funciones_2 = funciones; _i < funciones_2.length; _i++) {
            var element = funciones_2[_i];
            if (this.nombrefuncion == element.nombrefuncion) {
                element.setParametrosReturn(this.parametros);
                element.ejecutar(ent, arbol, listaErrores);
                return ent.valorReturn; // Retornar el valor que retorna la funcion ejecutar
            }
        }
    };
    FuncionReturn.prototype.getTipo = function (ent, arbol, listaErrores) {
        var funciones = arbol.funciones;
        for (var _i = 0, funciones_3 = funciones; _i < funciones_3.length; _i++) {
            var element = funciones_3[_i];
            if (this.nombrefuncion == element.nombrefuncion) {
                return element.tipoFuncion;
            }
        }
    };
    FuncionReturn.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        var funciones = arbol.funciones;
        for (var _i = 0, funciones_4 = funciones; _i < funciones_4.length; _i++) {
            var element = funciones_4[_i];
            if (this.nombrefuncion == element.nombrefuncion) {
                element.setParametrosReturn(this.parametros);
                element.ejecutar(ent, arbol, listaErrores);
                return ent.valorReturn; // Retornar el valor que retorna la funcion ejecutar
            }
        }
    };
    return FuncionReturn;
}());
exports.FuncionReturn = FuncionReturn;
