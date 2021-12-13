import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";

export class AccesoAtributo implements Expresion {
    linea: number;
    columna: number;
    public expr1: Expresion;
    public expr2:  Expresion;

    constructor(expr1:Expresion,expr2:Expresion, linea:number, columna:number){
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.linea = linea;
        this.columna = columna;
    }
    
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST):Tipo {
        return Tipo.NULL;
    }

    getValorImplicito(ent: Entorno, arbol: AST) {
        
    }
    
}