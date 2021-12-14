import exp from "constants";
import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Break } from "./Break";
import { Declaracion } from "./Declaracion";

// print("hola mundo");

export class SwitchCaso implements Instruccion{
    linea: number;
    columna: number;
    public id:Expresion;
    public lista_instrucciones: Array<Instruccion>;
    private isBreak: boolean

    constructor(id:Expresion,lista_intstrucciones:Array<Instruccion>, linea:number, columna:number){
        this.id = id;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
        this.isBreak = false;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        for (var ints of this.lista_instrucciones){
            if (ints instanceof Break) {
                this.isBreak = true;
                break;
            }else{
                ints.ejecutar(ent, arbol);
            }            
        }
    }

    getIsBreak(){
        return this.isBreak;
    }
}