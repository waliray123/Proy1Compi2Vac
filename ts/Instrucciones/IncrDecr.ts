import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Operacion } from "../Expresiones/Operacion";
import { Instruccion } from "../Interfaces/Instruccion";

// print("hola mundo");

export class IncrDecr implements Instruccion{
    linea: number;
    columna: number;        
    public operacion:Operacion;
    public idVar: string;

    constructor(operacion:Operacion, linea:number, columna:number,idVar:string){
        this.operacion = operacion;
        this.linea = linea;
        this.columna = columna;        
        this.idVar = idVar;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        const valorIns = this.operacion.getValorImplicito(ent, arbol);
        if(valorIns!==null){                                      
            if (ent.existe(this.idVar)) {
                let simbol: Simbolo = ent.getSimbolo(this.idVar);                
                simbol.valor = valorIns;
            }else{
                console.log('Error semantico, no existe la variable ' + this.idVar +'en la linea '+ this.linea + ' y columna ' + this.columna);
            }                                                        
        }else{
            console.log("Ocurrio un error al realizar la operacion " + this.operacion.op_izquierda);
        }
    }

}