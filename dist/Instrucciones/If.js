"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
var Entorno_1 = require("../AST/Entorno");
var If = /** @class */ (function () {
    function If(linea, columna, condicion, instrucciones, sinos, tipo) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.condicion = condicion;
        this.sinos = sinos;
        this.tipo = tipo;
    }
    If.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        var entornolocal = new Entorno_1.Entorno(ent);
        var valAsign = this.condicion.traducir(entornolocal, arbol, resultado3D, temporales, 0);
        var ultLit = temporales.ultLiteral + 1;
        var cantidadSinos = this.sinos.length;
        temporales.ultLiteral += cantidadSinos + 2;
        resultado3D.codigo3D += '\tif(' + valAsign + ') goto L' + ultLit + ';\n';
        resultado3D.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
        resultado3D.codigo3D += '\tL' + ultLit + ':\n';
        this.instrucciones.forEach(function (element) {
            element.traducir(entornolocal, arbol, resultado3D, temporales, listaErrores);
        });
        resultado3D.codigo3D += '\tgoto L' + (ultLit + 1 + cantidadSinos) + ';\n';
        var cont = ultLit + 1;
        for (var i = cantidadSinos - 1; i >= 0; i--) {
            var sino = this.sinos[i];
            sino.traducirSinos(ent, arbol, resultado3D, temporales, cont, (ultLit + cantidadSinos + 1), listaErrores);
            cont += 1;
        }
        resultado3D.codigo3D += '\tL' + (ultLit + cantidadSinos + 1) + ':\n';
        temporales.ultLitEscr = ultLit + cantidadSinos + 1;
    };
    If.prototype.traducirSinos = function (ent, arbol, resultado3D, temporales, literalAsign, ultAsign, listaErrores) {
        if (this.tipo == "elseif") {
            var entornolocal_1 = new Entorno_1.Entorno(ent);
            var valAsign = this.condicion.traducir(entornolocal_1, arbol, resultado3D, temporales, 0);
            resultado3D.codigo3D += '\tif(' + valAsign + ') goto L' + literalAsign + ';\n';
            resultado3D.codigo3D += '\tgoto L' + (literalAsign + 1) + ';\n';
            resultado3D.codigo3D += '\tL' + literalAsign + ':\n';
            this.instrucciones.forEach(function (element) {
                element.traducir(entornolocal_1, arbol, resultado3D, temporales, listaErrores);
            });
            resultado3D.codigo3D += '\tgoto L' + ultAsign + ';\n';
        }
        else {
            var entornolocal_2 = new Entorno_1.Entorno(ent);
            resultado3D.codigo3D += '\tL' + literalAsign + ':\n';
            this.instrucciones.forEach(function (element) {
                element.traducir(entornolocal_2, arbol, resultado3D, temporales, listaErrores);
            });
            resultado3D.codigo3D += '\tgoto L' + ultAsign + ';\n';
        }
    };
    If.prototype.ejecutar = function (ent, arbol, listaErrores) {
        // console.log('ejecutado...ifnormal');
        //Revisar la condicion del if
        if (this.tipo == "if" || this.tipo == "elseif") {
            if (this.condicion.getValorImplicito(ent, arbol, listaErrores) == true) {
                var entornolocal = new Entorno_1.Entorno(ent);
                for (var _i = 0, _a = this.instrucciones; _i < _a.length; _i++) {
                    var element = _a[_i];
                    var valR = element.ejecutar(entornolocal, arbol, listaErrores);
                    if (valR == 'RETORNAR') {
                        ent.valorReturn = entornolocal.valorReturn;
                        return 'RETORNAR';
                    }
                    else if (valR == 'ROMPER') {
                        return 'ROMPER';
                    }
                    else if (valR == 'CONTINUAR') {
                        return 'CONTINUAR';
                    }
                }
            }
            else {
                var seEncontro = false;
                for (var i = 0; i < this.sinos.length; i++) {
                    var element = this.sinos[i];
                    if (element.tipo == "elseif") {
                        if (element.condicion.getValorImplicito(ent, arbol, listaErrores) == true) {
                            //Se encontro un elseif que cumple con la condicion
                            var entornolocal = new Entorno_1.Entorno(ent);
                            var valR = element.ejecutar(entornolocal, arbol, listaErrores);
                            if (valR == 'RETORNAR') {
                                ent.valorReturn = entornolocal.valorReturn;
                                return 'RETORNAR';
                            }
                            else if (valR == 'ROMPER') {
                                return 'ROMPER';
                            }
                            else if (valR == 'CONTINUAR') {
                                return 'CONTINUAR';
                            }
                            break;
                        }
                    }
                }
                if (seEncontro == false) {
                    for (var i = 0; i < this.sinos.length; i++) {
                        var element = this.sinos[i];
                        if (element.tipo == "else") {
                            //Se encontro un else  
                            var entornolocal = new Entorno_1.Entorno(ent);
                            var valR = element.ejecutar(entornolocal, arbol, listaErrores);
                            if (valR == 'RETORNAR') {
                                ent.valorReturn = entornolocal.valorReturn;
                                return 'RETORNAR';
                            }
                            else if (valR == 'ROMPER') {
                                return 'ROMPER';
                            }
                            else if (valR == 'CONTINUAR') {
                                return 'CONTINUAR';
                            }
                            break;
                        }
                    }
                }
            }
        }
        else {
            var entornolocal = new Entorno_1.Entorno(ent);
            for (var _b = 0, _c = this.instrucciones; _b < _c.length; _b++) {
                var element = _c[_b];
                var valR = element.ejecutar(entornolocal, arbol, listaErrores);
                if (valR == 'RETORNAR') {
                    ent.valorReturn = entornolocal.valorReturn;
                    console.log('VAl return');
                    console.log(ent.valorReturn);
                    return 'RETORNAR';
                }
                else if (valR == 'ROMPER') {
                    return 'ROMPER';
                }
                else if (valR == 'CONTINUAR') {
                    return 'CONTINUAR';
                }
            }
        }
    };
    return If;
}());
exports.If = If;
