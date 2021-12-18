import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";

export class ParametroReturn implements Expresion {
    linea: number;
    columna: number;
    public valor:Expresion;

    constructor(valor:Expresion,linea:number, columna:number){
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>): Tipo {
        return this.valor.getTipo(ent, arbol,listaErrores);
    }
    getValorImplicito(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        return this.valor.getValorImplicito(ent, arbol,listaErrores);
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        
    }

}