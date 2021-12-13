import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Operacion } from "../Expresiones/Operacion";
import { Instruccion } from "../Interfaces/Instruccion";

// print("hola mundo");

export class IncrDecr implements Instruccion{
    linea: number;
    columna: number;        
    public operacion:Operacion;

    constructor(operacion:Operacion, linea:number, columna:number){
        this.operacion = operacion;
        this.linea = linea;
        this.columna = columna;        
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        const valor = this.operacion.getValorImplicito(ent, arbol);
        if(valor!==null){
            const id = this.operacion.op_izquierda;    
            console.log(id);        
            /*
            if (ent.existe(id)) {
                let simbol: Simbolo = ent.getSimbolo(id);
                let tipo: Tipo = simbol.getTipo(ent,arbol);
                if (tipo == this.expresion.getTipo(ent,arbol)) {
                    simbol.valor = this.expresion.getValorImplicito(ent,arbol);
                }else{
                    console.log('Error semantico, El tipo de la variable (' + tipo +') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent,arbol) + ') en la linea '+ this.linea + ' y columna ' + this.columna);
                }
            }else{
                console.log('Error semantico, no existe la variable ' + id +'en la linea '+ this.linea + ' y columna ' + this.columna);
            }
*/
            
            
        }else{
            console.log("Ocurrio un error al realizar la operacion " + this.operacion.op_izquierda);
        }
    }

}