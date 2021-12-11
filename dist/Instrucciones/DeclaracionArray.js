"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionArray = void 0;
var Tipo_1 = require("../AST/Tipo");
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
    DeclaracionArray.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    DeclaracionArray.prototype.ejecutar = function (ent, arbol) {
        // console.log('ejecutado...'+ this.id);
        this.id.forEach(function (id) {
            // if (ent.existe(id) ){
            //     console.log('Id '+ id +' ya existe');
            // }else{
            //     if(this.expresion == null){
            //         let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,this.getValDefault());
            //         ent.agregar(id,simbol);
            //     }else{
            //         let tipoExpr:Tipo = this.expresion.getTipo(ent,arbol);
            //         if(tipoExpr == this.tipo){
            //             let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,this.expresion.getValorImplicito(ent,arbol));
            //             ent.agregar(id,simbol);
            //         }else{
            //             console.log('Error semantico, El tipo declarado (' + this.tipo +') no concuerda con el tipo asignado (' + tipoExpr + ') en la linea '+ this.linea + ' y columna ' + this.columna);
            //         }                    
            //     }
            // }
            console.log(id + ' array');
        });
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
