"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
var FuncionReturn_1 = require("./FuncionReturn");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var DeclaracionStruct = /** @class */ (function () {
    function DeclaracionStruct(id, tipo, linea, columna, expresion) {
        this.id = id;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    DeclaracionStruct.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    DeclaracionStruct.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var _this = this;
        if (ent.existe(this.tipo)) {
            if (this.expresion instanceof FuncionReturn_1.FuncionReturn) { //evalua que se este haciendo una instancia de la estructura
                //verificar que tengan la misma cantidad de parametros
                var struct = ent.getSimbolo(this.tipo);
                if (struct.getTipo(ent, arbol) === Tipo_1.Tipo.STRUCT) {
                    var structVars = struct.getValorImplicito(ent, arbol);
                    var parametros_1 = this.expresion.parametros;
                    //verificar
                    if (!ent.existe(this.id)) {
                        if (structVars.length == parametros_1.length) {
                            var error_1 = false;
                            structVars.forEach(function (declaracion, index, array) {
                                var param = parametros_1[index];
                                // console.log("--index---------" + index);
                                // console.log(declaracion.tipo);
                                // console.log(param.getTipo(ent,arbol));
                                var tipoParam = param.getTipo(ent, arbol, listaErrores);
                                if (tipoParam == Tipo_1.Tipo.TIPO_STRUCT) {
                                    declaracion.expresion = param.valor;
                                }
                                else if (declaracion.tipo === tipoParam || tipoParam === Tipo_1.Tipo.NULL) {
                                    // console.log("Si son compatibles");
                                    declaracion.expresion = param;
                                }
                                else {
                                    // console.log('Error semantico, El parametro ' + param.getValorImplicito(ent, arbol)  + ' no coincide con el tipo del atributo de la estructura en la linea '+ this.linea + ' y columna ' + this.columna);
                                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'El parametro ' + param.getValorImplicito(ent, arbol, listaErrores) + ' no coincide con el tipo del atributo de la estructura', _this.linea, _this.columna));
                                    error_1 = true;
                                }
                            });
                            if (!error_1) { //ingresamos la variable
                                //let entorno: Entorno = new Entorno(ent);//puede que no necesite esto
                                var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.TIPO_STRUCT, this.id, this.linea, this.columna, structVars);
                                simbol.setTipoStruct(this.tipo);
                                ent.agregar(this.id, simbol);
                            }
                            else {
                                // console.log('No se ingreso la variable');
                            }
                        }
                        else {
                            // console.log('Error semantico, La cantidad de parametros no concuerdan con la estructura en la linea '+ this.linea + ' y columna ' + this.columna);
                            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'La cantidad de parametros no concuerdan con la estructura', this.linea, this.columna));
                        }
                    }
                    else {
                        // console.log('Error semantico, La variable '+ this.id +' ya existe en el entorno, en la linea '+ this.linea + ' y columna ' + this.columna)
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'La variable ' + this.id + ' ya existe en el entorno', this.linea, this.columna));
                    }
                }
                else {
                    // console.log('Error semantico, El tipo declarado no es un struct en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'El tipo declarado no es un struct', this.linea, this.columna));
                }
            }
            else {
                // console.log('Error semantico, no se esta inicializando la estructura en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no se esta inicializando la estructura', this.linea, this.columna));
            }
        }
        else {
            // console.log('Error semantico, no exite la Estructura '+ this.tipo+' en la linea '+ this.linea + ' y columna ' + this.columna);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no exite la Estructura ' + this.tipo, this.linea, this.columna));
        }
    };
    DeclaracionStruct.prototype.getValDefault = function () {
        // if (this.tipo == Tipo.STRING) {
        //     return "undefined";
        // }else if (this.tipo == Tipo.BOOL){
        //     return true;
        // }else if (this.tipo == Tipo.INT){
        //     return 1;
        // }else if (this.tipo == Tipo.CHAR){
        //     return 'a';
        // }else if (this.tipo == Tipo.DOUBLE) {
        //     return 1.0;
        // }else{
        //     return null;
        // }
    };
    DeclaracionStruct.prototype.getTipo = function () {
        return "declaracion";
    };
    return DeclaracionStruct;
}());
exports.DeclaracionStruct = DeclaracionStruct;
