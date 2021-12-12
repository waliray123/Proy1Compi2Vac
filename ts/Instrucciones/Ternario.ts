import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

export class Ternario implements Instruccion{
    linea: number;
    columna: number;
    public expresion1:Expresion;
    public expresion2:Expresion;
    public expresion3:Expresion;

    constructor(expr1:Expresion,expr2:Expresion,expr3:Expresion, linea:number, columna:number,expresion:Expresion){
        this.expresion1 = expr1;
        this.expresion2 = expr2;
        this.expresion3 = expr3;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemeted.");
    }

}