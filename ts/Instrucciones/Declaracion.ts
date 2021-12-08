import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

// print("hola mundo");

export class Declaracion implements Instruccion{
    linea: number;
    columna: number;
    public id:Array<String>;
    public expresion:any;
    public tipo:String;

    constructor(id:Array<String>,tipo:String, linea:number, columna:number,expresion:any=null){
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
        console.log('ejecutado...'+ this.id);
    }

}