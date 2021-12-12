import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

// print("hola mundo");

export class DeclaracionStruct implements Instruccion{
    linea: number;
    columna: number;
    public id:string;
    public expresion:Expresion;
    public tipo:string;

    constructor(id:string,tipo:string, linea:number, columna:number,expresion:Expresion){
        this.id = id;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
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
    }

    getValDefault():any {
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
    }

}