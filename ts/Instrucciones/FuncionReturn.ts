import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Instruccion } from "../Interfaces/Instruccion";
import { Parametro } from "../Instrucciones/Parametro";
import { Funcion } from "../Instrucciones/Funcion";
import { ParametroReturn } from "../Expresiones/ParametroReturn";
import { ErrorG } from "../Objetos/ErrorG";

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

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        const funciones = arbol.funciones;
        funciones.forEach((element:Funcion) => {
            if(this.nombrefuncion == element.nombrefuncion){
                element.setParametrosReturn(this.parametros);
                element.ejecutar(ent,arbol,listaErrores);
                return ; // Retornar el valor que retorna la funcion ejecutar
            }
        })
    }

}