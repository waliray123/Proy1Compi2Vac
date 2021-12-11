import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Instruccion } from "../Interfaces/Instruccion";
import { Parametro } from "../Instrucciones/Parametro";

export class FuncionReturn implements Instruccion{
    linea: number;
    columna: number;
    public nombrefuncion:String;
    public parametros:Array<Parametro>;

    constructor(nombrefuncion:String,linea:number, columna:number,parametros:Array<Parametro>=[]){
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.parametros = parametros;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        console.log('ejecutado funcion retorno ...'+ this.nombrefuncion);
    }

}