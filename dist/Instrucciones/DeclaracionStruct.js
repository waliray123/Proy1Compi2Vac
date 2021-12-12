"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionStruct = void 0;
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
        // console.log('ejecutado...'+ this.id);
        // this.id.forEach((id:string)=>{
        //     if (ent.existe(id) ){
        //         console.log('Id '+ id +' ya existe');
        //     }else{
        //         if(this.expresion == null){
        //             let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,this.getValDefault());
        //             ent.agregar(id,simbol);
        //         }else{
        //             let tipoExpr:Tipo = this.expresion.getTipo(ent,arbol);
        //             if(tipoExpr == this.tipo){
        //                 let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,this.expresion.getValorImplicito(ent,arbol));
        //                 ent.agregar(id,simbol);
        //             }else{
        //                 console.log('Error semantico, El tipo declarado (' + this.tipo +') no concuerda con el tipo asignado (' + tipoExpr + ') en la linea '+ this.linea + ' y columna ' + this.columna);
        //             }                    
        //         }
        //     }
        // })
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
