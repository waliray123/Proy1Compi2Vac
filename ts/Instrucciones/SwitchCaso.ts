import exp from "constants";
import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";
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

    traducir(ent: Entorno, arbol: AST,resultado3D:Resultado3D,temporales:Temporales,listaErrores:Array<ErrorG>) {
        for (var ints of this.lista_instrucciones){
            ints.traducir(ent, arbol,resultado3D,temporales,listaErrores);           
        }
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        for (var ints of this.lista_instrucciones){
            if (ints instanceof Break) {
                this.isBreak = true;
                break;
            }else{
                ints.ejecutar(ent, arbol,listaErrores);
            }            
        }
    }

    getIsBreak(){
        return this.isBreak;
    }
}