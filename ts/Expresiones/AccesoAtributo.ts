import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Declaracion } from "../Instrucciones/Declaracion";
import { Expresion } from "../Interfaces/Expresion";
import { AccesoVariable } from "./AccesoVariable";

export class AccesoAtributo implements Expresion {
    linea: number;
    columna: number;
    public expr1: Expresion;
    public expr2:  AccesoVariable;

    constructor(expr1:Expresion,expr2:AccesoVariable, linea:number, columna:number){
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.linea = linea;
        this.columna = columna;
    }
    
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST):Tipo {
        return Tipo.NULL;
    }

    getValorImplicito(ent: Entorno, arbol: AST) {
        try{
            let valor = null;
            let val1:Array<Declaracion> = this.expr1.getValorImplicito(ent, arbol);
            val1.forEach((decl:Declaracion)=>{
                let nombre = decl.id[0];      
                console.log( 'nombre '+ nombre);          
                if (this.expr2 instanceof AccesoVariable) {
                    let variableAcceder =  this.expr2.id;
                    console.log( 'variableAcceder ' + variableAcceder)
                    if (nombre == variableAcceder) {
                        console.log('valor ' + decl.expresion.getValorImplicito(ent, arbol))
                        valor =  decl.expresion.getValorImplicito(ent, arbol);
                    }
                }                
            })
            return valor;
        }catch(e){
            console.error("hubo un error en AccesoAtributo " + e);
            return null;
        }
    }
    
}