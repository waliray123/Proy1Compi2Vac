import exp from "constants";
import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion} from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Arreglo } from "../Objetos/Arreglo";

// print("hola mundo");

export class Pop implements Instruccion{
    linea: number;
    columna: number;
    public id:string;

    constructor(id:string,linea:number, columna:number){
        this.id = id;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        if (ent.existe(this.id)) {
            let simbol: Simbolo = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent,arbol) == Tipo.ARRAY) {
                let valor:Arreglo = simbol.getValorImplicito(ent,arbol);
                valor.pop();
            }else{
                //no es de tipo array
            }
        }else{
            //no existe el id
        }
    }

}