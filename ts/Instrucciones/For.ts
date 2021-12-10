import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

export class For implements Instruccion{
    linea: number;
    columna: number;    
    public instrucciones:Array<Instruccion>;    
    public declAsign:any;
    public expresion1: Expresion;
    public expresion2: Expresion;


    constructor(linea:number, columna:number,instrucciones:Array<Instruccion>,declAsign:any,expresion1:Expresion,expresion2:Expresion){        
        this.linea = linea;
        this.columna = columna;        
        this.instrucciones = instrucciones;        
        this.declAsign = declAsign;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        console.log('ejecutado...fornormal');
    }

}