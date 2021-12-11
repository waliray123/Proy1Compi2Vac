import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

// print("hola mundo");

export class Declaracion implements Instruccion{
    linea: number;
    columna: number;
    public id:Array<string>;
    public expresion:Expresion;
    public tipo:Tipo;

    constructor(id:Array<string>,tipo:Tipo, linea:number, columna:number,expresion:Expresion){
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
        this.id.forEach((id:string)=>{
            if (ent.existe(id) ){
                console.log('Id '+ id +' ya existe');
            }else{
                if(this.expresion == null){
                    let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,this.getValDefault());
                    ent.agregar(id,simbol);
                }else{
                    let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,this.expresion.getValorImplicito(ent,arbol));
                    ent.agregar(id,simbol);
                }
            }
        })
    }

    getValDefault():any {
        if (this.tipo == Tipo.STRING) {
            return "undefined";
        }else if (this.tipo == Tipo.BOOL){
            return true;
        }else if (this.tipo == Tipo.INT){
            return 1;
        }else if (this.tipo == Tipo.CHAR){
            return 'a';
        }else if (this.tipo == Tipo.DOUBLE) {
            return 1.0;
        }else{
            return null;
        }
    }

}