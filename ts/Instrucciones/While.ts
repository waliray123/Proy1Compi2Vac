import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

export class While implements Instruccion{
    linea: number;
    columna: number;    
    public instrucciones:Array<Instruccion>;        
    public expresion: Expresion;    


    constructor(linea:number, columna:number,instrucciones:Array<Instruccion>,expresion:Expresion){        
        this.linea = linea;
        this.columna = columna;        
        this.instrucciones = instrucciones;                
        this.expresion = expresion;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        console.log('ejecutado...fornormal');
    }

}