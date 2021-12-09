import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Instruccion } from "../Interfaces/Instruccion";
import { Parametro } from "../Instrucciones/Parametro";

export class Funcion implements Instruccion{
    linea: number;
    columna: number;
    public nombrefuncion:String;
    public instrucciones:Array<Instruccion>;
    public tipoFuncion:String;
    public parametros:Array<Parametro>;

    constructor(nombrefuncion:String, tipoFuncion:String,linea:number, columna:number,instrucciones:Array<Instruccion>,parametros:Array<Parametro>){
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.tipoFuncion = tipoFuncion;
        this.parametros = parametros;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        console.log('ejecutado...'+ this.nombrefuncion);
    }

}