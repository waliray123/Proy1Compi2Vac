import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Arreglo } from "../Objetos/Arreglo";
import { Declaracion } from "./Declaracion";

export class AsignacionArray implements Instruccion{
    linea: number;
    columna: number;
    public id:string;
    public posicion: Expresion;
    public expresion:Expresion;

    constructor(id:string, posicion:Expresion, linea:number, columna:number,expresion:Expresion){
        this.id = id;
        this.posicion = posicion;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        if (ent.existe(this.id)) {
            let simbol:Simbolo = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent,arbol) ==  Tipo.ARRAY) {
                let valor:Arreglo = simbol.getValorImplicito(ent,arbol);
                let pos = this.posicion.getValorImplicito(ent, arbol);
                if (typeof(pos) == 'number') {
                    if (pos >= 0 && pos < valor.length) {
                        if (this.expresion.getTipo(ent,arbol) == valor.tipo ) {
                            valor.contenido[pos] = this.expresion;
                        }else{

                        }
                    }else{
                      
                    }
                }
            }else{

            }
        }else{
            
        }
    }
    getTipo(){
        return "asignacion";
    }

}