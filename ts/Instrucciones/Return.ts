import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";
import { If } from "./If";

// print("hola mundo");

export class Return implements Instruccion {
    linea: number;
    columna: number;
    public expresion: Expresion;

    constructor(exp: Expresion, linea: number, columna: number) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST, resultado3d: Resultado3D, temporales: Temporales) {


    }

    ejecutar(ent: Entorno, arbol: AST, listaErrores: Array<ErrorG>) {
        // console.log('Ejecutando return');
        if(this.expresion != null){
            let valExpr = this.expresion.getValorImplicito(ent,arbol,listaErrores);            
            ent.valorReturn = valExpr;
            // console.log(ent.valorReturn);
        }
        return 'RETORNAR';
    }

}