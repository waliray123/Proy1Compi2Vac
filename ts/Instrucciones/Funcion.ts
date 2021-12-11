import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Instruccion } from "../Interfaces/Instruccion";
import { Parametro } from "../Instrucciones/Parametro";
import { Tipo } from "../AST/Tipo";

export class Funcion implements Instruccion{
    linea: number;
    columna: number;
    public nombrefuncion:String;
    public instrucciones:Array<Instruccion>;
    public tipoFuncion:Tipo;
    public parametros:Array<Parametro>;

    constructor(nombrefuncion:String, tipoFuncion:Tipo,linea:number, columna:number,instrucciones:Array<Instruccion>,parametros:Array<Parametro>=[]){
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
        console.log('ejecutado funcion ...'+ this.nombrefuncion);

        const ast:AST = new AST(this.instrucciones);
        const entornoGlobal:Entorno = new Entorno(null);
        //recorro todas las raices  RECURSIVA
        this.instrucciones.forEach((element:Instruccion) => {
            element.ejecutar(entornoGlobal,ast);
        })
        // console.log(this.instrucciones);
    }

}