import exp from "constants";
import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion} from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Arreglo } from "../Objetos/Arreglo";
import { ErrorG } from "../Objetos/ErrorG";

// print("hola mundo");

export class Push implements Instruccion{
    linea: number;
    columna: number;
    public id:string;
    public expresion:Expresion;

    constructor(id:string,expresion:Expresion,linea:number, columna:number){
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        if (ent.existe(this.id)) {
            let simbol: Simbolo = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent,arbol) == Tipo.ARRAY) {
                let valor:Arreglo = simbol.getValorImplicito(ent,arbol);
                valor.push(ent,arbol,this.expresion,listaErrores);
            }else{
                //no es de tipo array
                listaErrores.push(new ErrorG('semantico','la variable no es del tipo array',this.linea,this.columna));
            }
        }else{
            //no existe el id
            listaErrores.push(new ErrorG('semantico','no existe la variable ' + this.id,this.linea,this.columna));
        }
    }

}