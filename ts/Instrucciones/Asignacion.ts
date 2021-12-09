import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

export class Asignacion implements Instruccion{
    linea: number;
    columna: number;
    public id:Array<String>;
    public expresion:Expresion;

    constructor(id:Array<String>, linea:number, columna:number,expresion:Expresion){
        this.id = id;
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