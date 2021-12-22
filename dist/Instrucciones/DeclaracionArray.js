"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionArray = void 0;
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
var AccesoArray_1 = require("../Expresiones/AccesoArray");
var Arreglo_1 = require("../Objetos/Arreglo");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var DeclaracionArray = /** @class */ (function () {
    function DeclaracionArray(id, tipo, dimensiones, linea, columna, expresion) {
        this.id = id;
        this.tipo = tipo;
        this.dimensiones = dimensiones;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    DeclaracionArray.prototype.traducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        var _this = this;
        this.id.forEach(function (id) {
            if (!ent.existe(id)) {
                if (_this.dimensiones.length == 0) {
                    if (_this.expresion == null) {
                        // let valor:Arreglo = new Arreglo(this.tipo,0,0,[],this.linea,this.columna);
                        var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, temporales.ultstack);
                        temporales.ultstack += 1;
                        ent.agregar(id, simbol);
                        resultado3d.codigo3D += 'stack[(int)' + simbol.valor + '];\n';
                    }
                    else {
                        if (_this.expresion instanceof AccesoArray_1.AccesoArray) {
                            // let valor = this.expresion.getValorImplicito(ent, chejoharbol,listaErrores);
                            // if (valor == null) {
                            //     valor = [];
                            // }
                            //let valorSimbolo:Arreglo = new Arreglo(this.tipo,valor.length,valor.length, valor,this.linea,this.columna);
                            var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, temporales.ultstack);
                            temporales.ultstack += 1;
                            ent.agregar(id, simbol);
                            //asignar los valores al stack
                            var valor = _this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
                            console.log('temp array: ');
                            console.log(valor);
                            resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] =' + valor + ';\n';
                        }
                        else {
                            //    console.log('Error semantico, la asignacion no es un arreglo de datos en la linea '+ this.linea + ' y columna ' + this.columna); 
                            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la asignacion no es un arreglo de datos', _this.linea, _this.columna));
                        }
                    }
                }
            }
            else {
                // error, si existe
            }
        });
    };
    DeclaracionArray.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var _this = this;
        // console.log('ejecutado...'+ this.id);
        this.id.forEach(function (id) {
            if (!ent.existeEnActual(id)) {
                if (_this.dimensiones.length == 0) {
                    if (_this.expresion == null) {
                        var valor = new Arreglo_1.Arreglo(_this.tipo, 0, 0, [], _this.linea, _this.columna);
                        var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, valor);
                        ent.agregar(id, simbol);
                    }
                    else {
                        if (_this.expresion instanceof AccesoArray_1.AccesoArray) {
                            var valor = _this.expresion.getValorImplicito(ent, arbol, listaErrores);
                            if (valor == null) {
                                valor = [];
                            }
                            var valorSimbolo = new Arreglo_1.Arreglo(_this.tipo, valor.length, valor.length, valor, _this.linea, _this.columna);
                            if (valorSimbolo.comprobarTipo(ent, arbol, listaErrores)) {
                                var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, valorSimbolo);
                                ent.agregar(id, simbol);
                            }
                        }
                        else {
                            //    console.log('Error semantico, la asignacion no es un arreglo de datos en la linea '+ this.linea + ' y columna ' + this.columna); 
                            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la asignacion no es un arreglo de datos', _this.linea, _this.columna));
                        }
                    }
                }
                else if (_this.dimensiones.length == 1) {
                    if (_this.expresion == null) {
                        var valor = new Arreglo_1.Arreglo(_this.tipo, 0, 0, [], _this.linea, _this.columna);
                        var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, valor);
                        ent.agregar(id, simbol);
                    }
                    else {
                        if (_this.expresion instanceof AccesoArray_1.AccesoArray) {
                            var valor = _this.expresion.getValorImplicito(ent, arbol, listaErrores);
                            if (valor == null) {
                                valor = [];
                            }
                            var dim = _this.dimensiones[0].getValorImplicito(ent, arbol, listaErrores);
                            if (typeof (dim) === 'number') {
                                if (dim === valor.length) {
                                    var valorSimbolo = new Arreglo_1.Arreglo(_this.tipo, valor.length, valor.length, valor, _this.linea, _this.columna);
                                    if (valorSimbolo.comprobarTipo(ent, arbol, listaErrores)) {
                                        var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, valorSimbolo);
                                        ent.agregar(id, simbol);
                                    }
                                }
                                else {
                                    //no tienen las mismas dimensiones
                                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'las dimesiones declaradas no es lo mismo al contenido', _this.linea, _this.columna));
                                }
                            }
                            else {
                                //la dimension no es un numero
                                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la diemnsion declarada no es un numero', _this.linea, _this.columna));
                            }
                        }
                        else {
                            //    console.log('Error semantico, la asignacion no es un arreglo de datos en la linea '+ this.linea + ' y columna ' + this.columna); 
                            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la asignacion no es un arreglo de datos', _this.linea, _this.columna));
                        }
                    }
                }
                else {
                    // console.log('error semantico, dimension de la declaracion del arreglo no conocido, en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'dimension de la declaracion del arreglo no es una expresion conocida', _this.linea, _this.columna));
                }
            }
            else {
                // console.log('Error semantico, ya existe el id: '+ id + ' en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'ya existe el id: ' + id, _this.linea, _this.columna));
            }
        });
    };
    DeclaracionArray.prototype.getTipo = function () {
        return "declaracion";
    };
    DeclaracionArray.prototype.getValDefault = function () {
        if (this.tipo == Tipo_1.Tipo.STRING) {
            return "undefined";
        }
        else if (this.tipo == Tipo_1.Tipo.BOOL) {
            return true;
        }
        else if (this.tipo == Tipo_1.Tipo.INT) {
            return 1;
        }
        else if (this.tipo == Tipo_1.Tipo.CHAR) {
            return 'a';
        }
        else if (this.tipo == Tipo_1.Tipo.DOUBLE) {
            return 1.0;
        }
        else {
            return null;
        }
    };
    return DeclaracionArray;
}());
exports.DeclaracionArray = DeclaracionArray;
