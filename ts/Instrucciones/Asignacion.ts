import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

export class Asignacion implements Instruccion{
    linea: number;
    columna: number;
    public id:Array<string>;
    public expresion:Expresion;

    constructor(id:Array<string>, linea:number, columna:number,expresion:Expresion){
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        this.id.forEach((id:string)=>{
            if (ent.existe(id)) {
                let simbol: Simbolo = ent.getSimbolo(id);
                let tipo: Tipo = simbol.getTipo(ent,arbol);
                if (tipo == this.expresion.getTipo(ent,arbol)) {
                    simbol.valor = this.expresion.getValorImplicito(ent,arbol);
                }else{
                    console.log('Error semantico, El tipo de la variable (' + tipo +') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent,arbol) + ') en la linea '+ this.linea + ' y columna ' + this.columna);
                }
            }else{
                console.log('Error semantico, no existe la variable ' + id +'en la linea '+ this.linea + ' y columna ' + this.columna);
            }
        })
    }
    getTipo(){
        return "asignacion";
    }

}