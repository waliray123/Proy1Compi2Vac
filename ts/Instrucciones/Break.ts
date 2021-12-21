import exp from "constants";
import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";

// print("hola mundo");

export class Break implements Instruccion{
    linea: number;
    columna: number;

    constructor(linea:number, columna:number){
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST,resultado3D:Resultado3D,temporales:Temporales,listaErrores:Array<ErrorG>) {
        resultado3D.codigo3D += '\tgoto L'+temporales.ultLiteral+';\n';
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        return 'ROMPER';
    }

}