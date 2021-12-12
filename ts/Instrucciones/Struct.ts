import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Declaracion } from "./Declaracion";

// print("hola mundo");

export class Struct implements Instruccion{
    linea: number;
    columna: number;
    public id:String;
    public lista_atributos: Array<Declaracion>;

    constructor(id:String,lista_atributos:Array<Declaracion>, linea:number, columna:number){
        this.id = id;
        this.lista_atributos = lista_atributos;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        console.log('ejecutado...'+ this.id);
    }

    getTipo(){
        return "struct";
    }

}