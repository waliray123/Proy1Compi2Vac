import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Tipo } from "../AST/Tipo";
import { Instruccion } from "../Interfaces/Instruccion";

export class Parametro implements Instruccion{
    linea: number;
    columna: number;
    public id:String;
    public tipoParametro:Tipo;

    constructor(id:String, tipoParametro:Tipo,linea:number, columna:number){
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.tipoParametro = tipoParametro;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        console.log('ejecutado...'+ this.id);
    }

}