import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Instruccion } from "../Interfaces/Instruccion";
import { Parametro } from "../Instrucciones/Parametro";
import { Funcion } from "../Instrucciones/Funcion";
import { ParametroReturn } from "./ParametroReturn";

export class FuncionReturn implements Instruccion{
    linea: number;
    columna: number;
    public nombrefuncion:String;
    public parametros:Array<ParametroReturn>;

    constructor(nombrefuncion:String,linea:number, columna:number,parametros:Array<ParametroReturn>=[]){
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.parametros = parametros;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        const funciones = arbol.funciones;
        funciones.forEach((element:Funcion) => {
            if(this.nombrefuncion == element.nombrefuncion){
                element.ejecutar(ent,arbol);
                return ; // Retornar el valor que retorna la funcion ejecutar
            }
        })
    }

}