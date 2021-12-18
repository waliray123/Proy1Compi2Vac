import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { ErrorG } from "../Objetos/ErrorG";

export class ArrbegEnd implements Expresion {
    linea: number;
    columna: number;
    id: string;
    expresion1: Expresion;
    expresion2: Expresion;

    constructor(id:string, linea:number, columna:number,expresion1:Expresion,expresion2:Expresion){
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }
    
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>): Tipo {
        const valor = this.getValorImplicito(ent, arbol,listaErrores);
        if (typeof(valor) === 'boolean')
        {
            return Tipo.BOOL;
        }
        else if (typeof(valor) === 'string')
        {
            return Tipo.STRING;
        }
        else if (typeof(valor) === 'number')
        {
            if(this.isInt(Number(valor))){
                return Tipo.INT;
            }
           return Tipo.DOUBLE;
        }
        else if(valor === null){
            return Tipo.NULL;
        }
            
        return Tipo.VOID;
    }

    getValorImplicito(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        return this.id;
    }

    isInt(n:number){
        return Number(n) === n && n % 1 === 0;
    }
    
}