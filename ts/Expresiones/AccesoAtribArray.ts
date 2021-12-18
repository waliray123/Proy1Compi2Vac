import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Declaracion } from "../Instrucciones/Declaracion";
import { Expresion } from "../Interfaces/Expresion";
import { Arreglo } from "../Objetos/Arreglo";
import { ErrorG } from "../Objetos/ErrorG";
import { AccesoVariable } from "./AccesoVariable";

export class AccesoAtribArray implements Expresion {
    linea: number;
    columna: number;
    public id:string;
    public posicion: Expresion;

    constructor(id:string,posicion:Expresion, linea:number, columna:number){
        this.id = id;
        this.posicion = posicion;
        this.linea = linea;
        this.columna = columna;
    }
    
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>):Tipo {
        if (ent.existe(this.id)) {
            let simbol:Simbolo = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent,arbol) ==  Tipo.ARRAY) {
                let valor:Arreglo = simbol.getValorImplicito(ent,arbol);
                return valor.tipo;                
            }else{
                return Tipo.NULL;
            }
        }else{
            return Tipo.NULL;
        }
    }

    getValorImplicito(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        if (ent.existe(this.id)) {
            let simbol:Simbolo = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent,arbol) ==  Tipo.ARRAY) {
                let valor:Arreglo = simbol.getValorImplicito(ent,arbol);
                let pos = this.posicion.getValorImplicito(ent, arbol,listaErrores);
                if (typeof(pos) == 'number') {
                    if (pos >= 0 && pos < valor.length) {
                        return valor.contenido[pos].getValorImplicito(ent, arbol,listaErrores);
                    }else{
                        listaErrores.push(new ErrorG('semantico','index fuera del limite del arreglo',this.linea,this.columna));
                        return null;
                    }
                }
            }else{
                listaErrores.push(new ErrorG('semantico','la variable no es del tipo array',this.linea,this.columna));
            }
        }else{
            listaErrores.push(new ErrorG('semantico','no existe la variable ' + this.id,this.linea,this.columna));
        }
    }
    
}