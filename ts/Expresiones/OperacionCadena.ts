import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Arreglo } from "../Objetos/Arreglo";
import { ErrorG } from "../Objetos/ErrorG";
import { AccesoVariable } from "./AccesoVariable";
import { Primitivo } from "./Primitivo";

export enum OperadorCadena {
    LENGTH,
    UPPERCASE,
    LOWERCASE,
    CHARPOS,
    SUBSTRING,
    POP
}

export class OperacionCadena implements Expresion {
    id:Expresion;
    expr1:Expresion;
    expr2:Expresion;
    operadorCadena:OperadorCadena;
    linea: number;
    columna: number;
    private isEjecutar = true;

    constructor(id:Expresion, expr1:Expresion,expr2:Expresion, operadorCadena:OperadorCadena,linea: number, columna: number){
        this.id = id;
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.operadorCadena = operadorCadena;
        this.linea = linea;
        this.columna = columna;
    }

    getTipo(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>): Tipo {
        this.isEjecutar=false;
        const valor = this.getValorImplicito(ent, arbol,listaErrores);
        this.isEjecutar = true;
        if (typeof(valor) === 'boolean')
        {
            return Tipo.BOOL;
        }
        else if (typeof(valor) === 'string')
        {
            return Tipo.STRING;
        }
        else if (typeof(valor) === 'number')
        {
            if(this.isInt(Number(valor))){
                return Tipo.INT;
            }
           return Tipo.DOUBLE;
        }
        else if(valor === null){
            return Tipo.NULL;
        }            
        return Tipo.VOID
    }
    getValorImplicito(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {

        if (this.operadorCadena == OperadorCadena.LENGTH) {
            if (this.id instanceof AccesoVariable) {
                this.id.isAlone = false;
                let valor = this.id.getValorImplicito(ent, arbol,listaErrores);
                if (this.id instanceof AccesoVariable) {
                    this.id.isAlone = true;
                }
                if (valor instanceof Arreglo) {
                    return valor.length;
                }else {
                    if (typeof(valor) === "string") {
                        return valor.length;
                    }else{
                        //no es de tipo string
                        listaErrores.push(new ErrorG('semantico','no es de tipo string',this.linea,this.columna));
                    }
                }
            }else if(this.id instanceof Primitivo){
                if (this.id.getTipo(ent,arbol,listaErrores) === Tipo.STRING ) {
                    return this.id.getValorImplicito(ent, arbol,listaErrores).length
                }else{
                    //no es un primitivo de string
                    listaErrores.push(new ErrorG('semantico','no es de tipo string',this.linea,this.columna));
                }
            }else{
                //error
            }
            
        }else if (this.operadorCadena == OperadorCadena.LOWERCASE){
            if (this.id instanceof AccesoVariable) {
                this.id.isAlone = false;
            }
            let valor = this.id.getValorImplicito(ent, arbol,listaErrores);
            if (this.id instanceof AccesoVariable) {
                this.id.isAlone = true;
            }
            if (typeof(valor)==='string') {
                return valor.toLocaleLowerCase();
            }else{
                //no es de tipo string
                listaErrores.push(new ErrorG('semantico','no tiene un valor del tipo string',this.linea,this.columna));
            }

        }else if (this.operadorCadena == OperadorCadena.UPPERCASE){
            if (this.id instanceof AccesoVariable) {
                this.id.isAlone = false;
            }
            let valor = this.id.getValorImplicito(ent, arbol,listaErrores);
            if (this.id instanceof AccesoVariable) {
                this.id.isAlone = true;
            }
            if (typeof(valor)==='string') {
                return valor.toLocaleUpperCase();
            }else{
                //no es de tipo string
                listaErrores.push(new ErrorG('semantico','no es de tipo string',this.linea,this.columna));
            }

        }else if (this.operadorCadena == OperadorCadena.CHARPOS){

            if (this.id instanceof AccesoVariable) {
                this.id.isAlone = false;
            }
            let valor = this.id.getValorImplicito(ent, arbol,listaErrores);
            if (this.id instanceof AccesoVariable) {
                this.id.isAlone = true;
            }
            if (typeof(valor)==='string') {
                let posChar = this.expr1.getValorImplicito(ent, arbol,listaErrores);
                if (typeof(posChar) ==='number') {
                    if(this.isInt(Number(posChar))){
                        return valor.charAt(posChar);
                    }else{
                        //no es un int
                        listaErrores.push(new ErrorG('semantico','no es de tipo int la posicion asignada',this.linea,this.columna));
                    }
                }else{
                    //no es un numero
                    listaErrores.push(new ErrorG('semantico','no es un numero en la posicion asignada',this.linea,this.columna));
                }
            }else{
                //no es de tipo string
                listaErrores.push(new ErrorG('semantico','no es de tipo string',this.linea,this.columna));
            }

        }else if (this.operadorCadena == OperadorCadena.SUBSTRING){
            if (this.id instanceof AccesoVariable) {
                this.id.isAlone = false;
            }
            let valor = this.id.getValorImplicito(ent, arbol,listaErrores);
            if (this.id instanceof AccesoVariable) {
                this.id.isAlone = true;
            }
            if (typeof(valor)==='string') {
                let inicial = this.expr1.getValorImplicito(ent, arbol,listaErrores);
                let final = this.expr2.getValorImplicito(ent, arbol,listaErrores);
                if (typeof(final) ==='number' && typeof(inicial) ==='number' ) {
                    if(this.isInt(Number(inicial)) && this.isInt(Number(final))){
                        return valor.substring(inicial, final);
                    }else{
                        //no es un int
                        listaErrores.push(new ErrorG('semantico','no es un dato de tipo int',this.linea,this.columna));
                    }
                }else{
                    //no es un numero
                    listaErrores.push(new ErrorG('semantico','no es un numero',this.linea,this.columna));
                }
            }else{
                //no es de tipo string
                listaErrores.push(new ErrorG('semantico','no es un string',this.linea,this.columna));
            }
        }else if(this.operadorCadena == OperadorCadena.POP){
            if (this.id instanceof AccesoVariable) {
                this.id.isAlone = false;
                let valor = this.id.getValorImplicito(ent, arbol,listaErrores);
                if (this.id instanceof AccesoVariable) {
                    this.id.isAlone = true;
                }
                if (valor instanceof Arreglo) {
                    if (this.isEjecutar) {
                        let val = valor.pop()?.getValorImplicito(ent, arbol,listaErrores);
                        return val;
                    }else{
                        return valor.getLastContenido().getValorImplicito(ent, arbol,listaErrores);
                    }                    
                }else {
                    //No es un arreglo
                    listaErrores.push(new ErrorG('semantico','no se puede realizar la operacion porque no es de tipo array',this.linea,this.columna));
                }
            }
        }
        return null;
    }
    traducir(ent: Entorno, arbol: AST, resultado3d: Resultado3D, temporales: Temporales, recursivo: number) {
        throw new Error("Method not implemented.");
    }

    isInt(n:number){
        return Number(n) === n && n % 1 === 0;
    }
    
}