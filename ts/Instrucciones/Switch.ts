import exp from "constants";
import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";
import { Declaracion } from "./Declaracion";
import { SwitchCaso } from "./SwitchCaso";

// print("hola mundo");

export class Switch implements Instruccion{
    linea: number;
    columna: number;
    public expresion:any;
    public lista_instrucciones: Array<SwitchCaso>;

    constructor(expresion:any,lista_intstrucciones:Array<SwitchCaso>, linea:number, columna:number){
        this.expresion = expresion;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        for(var caso of this.lista_instrucciones){
            if (this.expresion.getValorImplicito(ent,arbol) == caso.id.getValorImplicito(ent, arbol) || caso.id.getTipo(ent,arbol) == Tipo.NULL) {
                caso.ejecutar(ent,arbol,listaErrores);
                if (caso.getIsBreak()) {
                    break;
                }
            }
        }
    }

}