import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";

export class Ternario implements Expresion{
    linea: number;
    columna: number;
    public expresion1:Expresion;
    public expresion2:Expresion;
    public expresion3:Expresion;

    constructor(expr1:Expresion,expr2:Expresion,expr3:Expresion, linea:number, columna:number,expresion:Expresion){
        this.expresion1 = expr1;
        this.expresion2 = expr2;
        this.expresion3 = expr3;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>): Tipo {
        let valorExpr1 = this.expresion1.getValorImplicito(ent,arbol,listaErrores);
        if (typeof(valorExpr1) === 'boolean') {            
            if (valorExpr1 == true) {
                return this.expresion2.getTipo(ent,arbol,listaErrores);
            }else{
                return this.expresion3.getTipo(ent,arbol,listaErrores);
            }
        }else{
            // console.log('Error semantico, el valor de la operacion ternaria no es un booleano en la linea '+ this.linea + ' y columna ' + this.columna);
            listaErrores.push(new ErrorG('semantico','el valor de la operacion ternaria no es un booleano',this.linea,this.columna));
            return Tipo.NULL;
        }
    }
    getValorImplicito(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        let tipo = this.expresion1.getTipo(ent,arbol,listaErrores);
        if (tipo === Tipo.BOOL) {
            let valorExpr1 = this.expresion1.getValorImplicito(ent,arbol,listaErrores);
            if (valorExpr1 == true) {
                return this.expresion2.getValorImplicito(ent,arbol,listaErrores);
            }else{
                return this.expresion3.getValorImplicito(ent,arbol,listaErrores);
            }
        }else{
            // console.log('Error semantico, el valor de la operacion ternaria no es un booleano en la linea '+ this.linea + ' y columna ' + this.columna);
            listaErrores.push(new ErrorG('semantico','el valor de la operacion ternaria no es un booleano',this.linea,this.columna));
            return null;
        }
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

}