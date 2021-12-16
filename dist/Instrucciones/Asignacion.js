"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoVariable_1 = require("../Expresiones/AccesoVariable");
var Asignacion = /** @class */ (function () {
    function Asignacion(id, linea, columna, expresion) {
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Asignacion.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        if (this.id.length == 1) {
            var id = this.id[0];
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                if (tipo == this.expresion.getTipo(ent, arbol)) {
                    //Asignar al stack
                    var valAsign = this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
                    resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] =' + valAsign + ';\n';
                }
                else {
                    console.log('Error semantico, El tipo de la variable (' + tipo + ') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent, arbol) + ') en la linea ' + this.linea + ' y columna ' + this.columna);
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
    Asignacion.prototype.ejecutar = function (ent, arbol) {
        if (this.id.length == 1) {
            var id = this.id[0];
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                if (tipo == this.expresion.getTipo(ent, arbol)) {
                    simbol.valor = this.expresion.getValorImplicito(ent, arbol);
                }
                else {
                    console.log('Error semantico, El tipo de la variable (' + tipo + ') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent, arbol) + ') en la linea ' + this.linea + ' y columna ' + this.columna);
                }
            }
            else {
                console.log('Error semantico, no existe la variable ' + id + ' en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
        else {
<<<<<<< HEAD
            for (var i = 0; i < (this.id.length - 1); i++) {
                var id = this.id[i];
                if (ent.existe(id)) {
                    var simbol = ent.getSimbolo(id);
                    var tipo = simbol.getTipo(ent, arbol);
                    if (tipo == Tipo_1.Tipo.TIPO_STRUCT) {
                        var atributos = simbol.getValorImplicito(ent, arbol);
                        var idSig = this.id[i + 1];
                        for (var _i = 0, atributos_2 = atributos; _i < atributos_2.length; _i++) {
                            var atributo = atributos_2[_i];
                            if (atributo.id[0] === idSig) {
                                atributo.expresion = this.expresion;
                                break;
                            }
                        }
                    }
                }
                else {
                    console.log('Error semantico, no existe ' + id + ' en la linea ' + this.linea + ' y columna ' + this.columna);
=======
            var i = 0;
            var id = this.id[i];
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                if (tipo == Tipo_1.Tipo.TIPO_STRUCT) {
                    var atributos = simbol.getValorImplicito(ent, arbol);
                    this.asignacionStruct(i, atributos, ent, arbol);
>>>>>>> ed7971aea1f1a8fccc72408a92558380c3e744ae
                }
            }
            else {
                console.log('Error semantico, no existe ' + id + ' en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
    };
    Asignacion.prototype.getTipo = function () {
        return "asignacion";
    };
    Asignacion.prototype.asignacionStruct = function (i, atributos, ent, arbol) {
        if ((i + 1) >= this.id.length) {
            console.log("No se encontro");
            return;
        }
        var idSig = this.id[i + 1];
        var _loop_1 = function () {
            if (atributo.id[0] === idSig) {
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
                        var val1 = atributo.expresion.getValorImplicito(ent, arbol);
                        atributo.expresion.isAlone = true;
                        this_1.asignacionStruct(i + 1, val1, ent, arbol);
                    }
                }
                else {
                    atributo.expresion = this_1.expresion;
                }
                return { value: void 0 };
            }
        };
        var this_1 = this;
        for (var _i = 0, atributos_1 = atributos; _i < atributos_1.length; _i++) {
            var atributo = atributos_1[_i];
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    return Asignacion;
}());
exports.Asignacion = Asignacion;
