import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Declaracion } from "./Declaracion";

// print("hola mundo");

export class Struct implements Instruccion{
    linea: number;
    columna: number;
    public id:string;
    public lista_atributos: Array<Declaracion>;

    constructor(id:string,lista_atributos:Array<Declaracion>, linea:number, columna:number){
        this.id = id;
        this.lista_atributos = lista_atributos;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        if (!ent.existe(this.id)) {
            let simbol = new Simbolo(Tipo.STRUCT,this.id,this.linea,this.columna,this.lista_atributos);
            ent.agregar(this.id,simbol);
        }else{
            console.log('error semantico, Ya existe el nombre de la estructura declarada en la linea '+ this.linea + ' y columna ' + this.columna);
        }
    }

    getTipo(){
        return "struct";
    }

}