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
    public expr1: AccesoVariable;
    public expr2:  string;
    public isAlone: boolean;

    constructor(expr1:AccesoVariable,expr2:string, linea:number, columna:number){
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.linea = linea;
        this.columna = columna;
        this.isAlone = false;
    }
    
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST):Tipo {
        try{
            let valor = Tipo.NULL;
            this.expr1.isAlone = false;
            let val1:Array<Declaracion> = this.expr1.getValorImplicito(ent, arbol);
            val1.forEach((decl:Declaracion)=>{
                let nombre = decl.id[0];
                if (nombre == this.expr2) {
                    // console.log('valor ' + decl.expresion.getValorImplicito(ent, arbol))
                    if (decl.expresion instanceof AccesoVariable) {
                        decl.expresion.isAlone = false;  
                        valor =  decl.expresion.getValorImplicito(ent, arbol);
                        decl.expresion.isAlone = true;                      
                    }else{
                        valor =  decl.expresion.getTipo(ent,arbol);
                    }                    
                }             
            })
            this.expr1.isAlone =  true;
            return valor;
        }catch(e){
            console.error("hubo un error en AccesoAtributo " + e);
            return Tipo.NULL;
        }
    }

    getValorImplicito(ent: Entorno, arbol: AST) {
        try{
            let valor = null;
            this.expr1.isAlone = false;
            let val1:Array<Declaracion> = this.expr1.getValorImplicito(ent, arbol);
            val1.forEach((decl:Declaracion)=>{
                let nombre = decl.id[0];
                if (nombre == this.expr2) {
                    // console.log('valor ' + decl.expresion.getValorImplicito(ent, arbol))
                    if (decl.expresion instanceof AccesoVariable) {
                        decl.expresion.isAlone = false;  
                        valor =  decl.expresion.getValorImplicito(ent, arbol);
                        decl.expresion.isAlone = true;                      
                    }else{
                        valor =  decl.expresion.getValorImplicito(ent, arbol);
                    }                    
                }             
            })
            this.expr1.isAlone =  true;
            return valor;
        }catch(e){
            console.error("hubo un error en AccesoAtributo " + e);
            return null;
        }
    }
    
}