"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var Struct = /** @class */ (function () {
    function Struct(id, lista_atributos, linea, columna) {
        this.id = id;
        this.lista_atributos = lista_atributos;
        this.linea = linea;
        this.columna = columna;
    }
    Struct.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Struct.prototype.ejecutar = function (ent, arbol, listaErrores) {
        if (!ent.existe(this.id)) {
            var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.STRUCT, this.id, this.linea, this.columna, this.lista_atributos);
            ent.agregar(this.id, simbol);
        }
        else {
            // console.log('error semantico, Ya existe el nombre de la estructura declarada en la linea '+ this.linea + ' y columna ' + this.columna);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'ya existe el nombre del estructura declarada', this.linea, this.columna));
        }
    };
    Struct.prototype.getTipo = function () {
        return "struct";
    };
    return Struct;
}());
exports.Struct = Struct;
