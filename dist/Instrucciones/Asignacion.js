"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoArray_1 = require("../Expresiones/AccesoArray");
var AccesoVariable_1 = require("../Expresiones/AccesoVariable");
var Primitivo_1 = require("../Expresiones/Primitivo");
var ErrorG_1 = require("../Objetos/ErrorG");
var Asignacion = /** @class */ (function () {
    function Asignacion(id, linea, columna, expresion) {
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Asignacion.prototype.traducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        if (this.id.length == 1) {
            var id = this.id[0];
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                if (tipo == this.expresion.getTipo(ent, arbol, listaErrores) || (this.expresion.getTipo(ent, arbol, listaErrores) == Tipo_1.Tipo.INT && tipo == Tipo_1.Tipo.DOUBLE)) {
                    //Asignar al stack
                    var valAsign = this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
                    if (temporales.ultimoTipo == Tipo_1.Tipo.BOOL) {
                        if (temporales.esFuncion) {
                            temporales.ultimoTemp += 1;
                            resultado3d.codigo3D += 't' + temporales.ultimoTemp + '= P +' + (simbol.valor) + ';\n';
                            temporales.ultLiteral += 3;
                            var ultLit = temporales.ultLiteral - 2;
                            resultado3d.codigo3D += '\tif(' + valAsign + ') goto L' + ultLit + ';\n';
                            resultado3d.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
                            resultado3d.codigo3D += '\tL' + ultLit + ':\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = 1;\n';
                            resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
                            resultado3d.codigo3D += '\tL' + (ultLit + 1) + ':\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = 0;\n';
                            resultado3d.codigo3D += '\tL' + (ultLit + 2) + ':\n';
                            temporales.ultLitEscr = (ultLit + 2);
                        }
                        else {
                            temporales.ultLiteral += 3;
                            var ultLit = temporales.ultLiteral - 2;
                            resultado3d.codigo3D += '\tif(' + valAsign + ') goto L' + ultLit + ';\n';
                            resultado3d.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
                            resultado3d.codigo3D += '\tL' + ultLit + ':\n';
                            resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] = 1;\n';
                            resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
                            resultado3d.codigo3D += '\tL' + (ultLit + 1) + ':\n';
                            resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] = 0;\n';
                            resultado3d.codigo3D += '\tL' + (ultLit + 2) + ':\n';
                            temporales.ultLitEscr = (ultLit + 2);
                        }
                    }
                    else {
                        if (temporales.esFuncion) {
                            temporales.ultimoTemp += 1;
                            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= P +' + (simbol.valor) + ';\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] =' + valAsign + ';\n';
                        }
                        else {
                            resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] =' + valAsign + ';\n';
                        }
                    }
                }
                else {
                    console.log('Error semantico, El tipo de la variable (' + tipo + ') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent, arbol, listaErrores) + ') en la linea ' + this.linea + ' y columna ' + this.columna);
                }
            }
            else {
                console.log('Error semantico, no existe la variable ' + id + ' en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
        //TODO: traducir asignacion de array 
        else {
            for (var i = 0; i < (this.id.length - 1); i++) {
                var id = this.id[i];
                if (ent.existe(id)) {
                    var simbol = ent.getSimbolo(id);
                    var tipo = simbol.getTipo(ent, arbol);
                    if (tipo == Tipo_1.Tipo.TIPO_STRUCT) {
                        var atributos = simbol.getValorImplicito(ent, arbol);
                        var idSig = this.id[i + 1];
                        for (var _i = 0, atributos_1 = atributos; _i < atributos_1.length; _i++) {
                            var atributo = atributos_1[_i];
                            if (atributo.id[0] === idSig) {
                                atributo.expresion = this.expresion;
                                break;
                            }
                        }
                    }
                }
                else {
                    console.log('Error semantico, no existe ' + id + ' en la linea ' + this.linea + ' y columna ' + this.columna);
                }
            }
        }
    };
    Asignacion.prototype.ejecutar = function (ent, arbol, listaErrores) {
        if (this.id.length == 1) {
            var id = this.id[0];
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                var tipoExpr = this.expresion.getTipo(ent, arbol, listaErrores);
                if (tipo == tipoExpr || (tipoExpr == Tipo_1.Tipo.INT && tipo == Tipo_1.Tipo.DOUBLE)) {
                    if (tipo == Tipo_1.Tipo.ARRAY) {
                        var arreglo = simbol.valor;
                        arreglo.cambiarContenido(this.expresion.getValorImplicito(ent, arbol, listaErrores));
                    }
                    else {
                        simbol.valor = this.expresion.getValorImplicito(ent, arbol, listaErrores);
                    }
                }
                else {
                    // console.log('Error semantico, El tipo de la variable (' + tipo +') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent,arbol) + ') en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'El tipo de la variable (' + this.getNameTipo(tipo) + ') no concuerda con el tipo asignado', this.linea, this.columna));
                }
            }
            else {
                // console.log('Error semantico, no existe la variable ' + id +' en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + id, this.linea, this.columna));
            }
        }
        else {
            var i = 0;
            var id = this.id[i];
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                if (tipo == Tipo_1.Tipo.TIPO_STRUCT) {
                    var atributos = simbol.getValorImplicito(ent, arbol);
                    this.asignacionStruct(i, atributos, ent, arbol, listaErrores);
                }
                else {
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable ' + id + ' no es de tipo Struct', this.linea, this.columna));
                }
            }
            else {
                // console.log('Error semantico, no existe ' + id +' en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + id, this.linea, this.columna));
            }
        }
    };
    Asignacion.prototype.getTipo = function () {
        return "asignacion";
    };
    Asignacion.prototype.asignacionStruct = function (i, atributos, ent, arbol, listaErrores) {
        if ((i + 1) >= this.id.length) {
            // console.log("No se encontro");
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'No se encontro el atributo ' + this.id[i], this.linea, this.columna));
            return;
        }
        var idSig = this.id[i + 1];
        var _loop_1 = function () {
            if (atributo.id.toString() === idSig) {
                // console.log(atributo.tipo);
                var isStruct_1 = false;
                arbol.structs.forEach(function (struct) {
                    // console.log(struct.id);
                    if (struct.id === atributo.tipo.toString()) {
                        isStruct_1 = true;
                    }
                });
                if (isStruct_1) {
                    // console.log(atributo.expresion);
                    if (atributo.expresion instanceof AccesoVariable_1.AccesoVariable) {
                        atributo.expresion.isAlone = false;
                        // console.log(atributo.expresion.getValorImplicito(ent, arbol));
                        var val1 = atributo.expresion.getValorImplicito(ent, arbol, listaErrores);
                        atributo.expresion.isAlone = true;
                        this_1.asignacionStruct(i + 1, val1, ent, arbol, listaErrores);
                    }
                }
                else {
                    if (this_1.expresion instanceof Primitivo_1.Primitivo || this_1.expresion instanceof AccesoArray_1.AccesoArray) {
                        atributo.expresion = this_1.expresion;
                    }
                    else {
                        var valorC = this_1.expresion.getValorImplicito(ent, arbol, listaErrores);
                        var primitivo = new Primitivo_1.Primitivo(valorC, this_1.expresion.linea, this_1.expresion.columna);
                        atributo.expresion = primitivo;
                    }
                }
                return { value: void 0 };
            }
        };
        var this_1 = this;
        for (var _i = 0, atributos_2 = atributos; _i < atributos_2.length; _i++) {
            var atributo = atributos_2[_i];
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    Asignacion.prototype.getNameTipo = function (tipo) {
        if (tipo == Tipo_1.Tipo.STRING) {
            return "string";
        }
        else if (tipo == Tipo_1.Tipo.BOOL) {
            return 'boolean';
        }
        else if (tipo == Tipo_1.Tipo.INT) {
            return 'int';
        }
        else if (tipo == Tipo_1.Tipo.CHAR) {
            return 'char';
        }
        else if (tipo == Tipo_1.Tipo.DOUBLE) {
            return 'double';
        }
        else if (tipo == Tipo_1.Tipo.VOID) {
            return 'void';
        }
        else if (tipo == Tipo_1.Tipo.STRUCT) {
            return 'struct';
        }
        else if (tipo == Tipo_1.Tipo.ARRAY) {
            return 'array';
        }
        else if (tipo == Tipo_1.Tipo.TIPO_STRUCT) {
            return 'struct';
        }
        else {
            return 'null';
        }
    };
    return Asignacion;
}());
exports.Asignacion = Asignacion;
