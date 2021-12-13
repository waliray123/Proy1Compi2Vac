"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionStruct = void 0;
var FuncionReturn_1 = require("./FuncionReturn");
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
    DeclaracionStruct.prototype.ejecutar = function (ent, arbol) {
        if (ent.existe(this.tipo)) {
            if (this.expresion instanceof FuncionReturn_1.FuncionReturn) { //evalua que se este haciendo una instancia de la estructura
                //verificar que tengan la misma cantidad de parametros
                var struct = ent.getSimbolo(this.tipo);
                var structVars = struct.getValorImplicito(ent, arbol);
                console.log(structVars.length);
                var parametros = this.expresion.parametros;
                console.log(parametros);
                console.log(parametros.length);
            }
            else {
                console.log('Error semantico, no se esta inicializando la estructura en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
        else {
            console.log('Error semantico, no exite la Estructura ' + this.tipo + ' en la linea ' + this.linea + ' y columna ' + this.columna);
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
    return DeclaracionStruct;
}());
exports.DeclaracionStruct = DeclaracionStruct;
