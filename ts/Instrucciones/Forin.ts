import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";

export class Forin implements Instruccion{
    linea: number;
    columna: number;
    public instrucciones:Array<Instruccion>;
    public expresion1: any;
    public expresion2: any;


    constructor(linea:number, columna:number,instrucciones:Array<Instruccion>,expresion1:any,expresion2:any){        
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        console.log('ejecutado...fornormal');
    }

}