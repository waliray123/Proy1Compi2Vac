import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Declaracion } from "../Instrucciones/Declaracion";
import { Expresion } from "../Interfaces/Expresion";
import { AccesoVariable } from "./AccesoVariable";

export class AccesoArray implements Expresion {
    linea: number;
    columna: number;
    public contenido: Array<Expresion>;

    constructor(contenido: Array<Expresion>, linea:number, columna:number){
        this.contenido = contenido;
        this.linea = linea;
        this.columna = columna;
    }
    
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST):Tipo {
        return Tipo.ARRAY;
    }

    getValorImplicito(ent: Entorno, arbol: AST) {
        try{
           return this.contenido;
        }catch(e){
            console.error("hubo un error en AccesoArray " + e);
            return null;
        }
    }
    
}