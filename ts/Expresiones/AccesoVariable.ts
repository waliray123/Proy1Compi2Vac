import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";

export class AccesoVariable implements Expresion {
    linea: number;
    columna: number;
    id:string;

    constructor(id:string, linea:number, columna:number){
        this.id = id
        this.linea = linea;
        this.columna = columna;
    }
    
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        if (ent.existe(this.id)) {
            let simbol:Simbolo = ent.getSimbolo(this.id);
            return simbol.getTipo(ent,arbol);
        }else{
            console.log('No existe el id ' + this.id + ' no hay tipo');
        }
        return Tipo.NULL;
    }

    getValorImplicito(ent: Entorno, arbol: AST) {
        if (ent.existe(this.id)) {
            let simbol:Simbolo = ent.getSimbolo(this.id);
            return simbol.valor;
        }else{
            console.log('No existe el id ' + this.id);
        }
    }
    
}