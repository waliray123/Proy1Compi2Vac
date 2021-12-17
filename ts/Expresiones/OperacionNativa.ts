import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Arreglo } from "../Objetos/Arreglo";
import { AccesoVariable } from "./AccesoVariable";
import { Operacion, Operador } from "./Operacion";
import { Primitivo } from "./Primitivo";

export enum OperadorNativa {
    PARSE,
    TOINT,
    TODOUBLE,
    STRING,
    TYPEOF
}

export class OperacionNativa implements Expresion {
    tipo:Tipo;
    expresion:Expresion;
    operadorNativa:OperadorNativa;
    linea: number;
    columna: number;
    private isEjecutar = true;

    constructor(operadorNativa:OperadorNativa,tipo:Tipo,expresion:Expresion,linea: number, columna: number){
        this.operadorNativa = operadorNativa;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        this.isEjecutar=false;
        const valor = this.getValorImplicito(ent, arbol);
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
    getValorImplicito(ent: Entorno, arbol: AST) {

        if (this.operadorNativa == OperadorNativa.PARSE) {
            let valor = this.expresion.getValorImplicito(ent, arbol);
            if (typeof(valor) === 'string') {
                if (this.tipo == Tipo.INT) {
                    return parseInt(valor);
                }else if (this.tipo == Tipo.DOUBLE){
                    return parseFloat(valor);
                } else if (this.tipo == Tipo.BOOL){
                    return Boolean(JSON.parse(valor));
                }else if (this.tipo == Tipo.CHAR){
                    return valor.charCodeAt(0);
                }else{
                    //es un error
                }
            }else{
                //no es de tipo string
            }
            
        }else if(this.operadorNativa === OperadorNativa.STRING){
            let valor = '';
            if (this.expresion instanceof Operacion) {
                valor = this.expresion.op_izquierda.getValorImplicito(ent, arbol) + this.getSignoTipo(this.expresion.operador) + this.expresion.op_derecha.getValorImplicito(ent, arbol)
            }else{
                valor = this.expresion.getValorImplicito(ent, arbol);
            }            
            if (valor === null) {
                return null;
            }else{
                return String(valor);
            }
        }else if(this.operadorNativa === OperadorNativa.TODOUBLE){
            let valor = this.expresion.getValorImplicito(ent, arbol);
            if (typeof(valor) === 'number') {
                return valor.toFixed(2);
            }else{
                //no es un numero
            }
        }else if(this.operadorNativa === OperadorNativa.TOINT){
            let valor = this.expresion.getValorImplicito(ent, arbol);
            if (typeof(valor) === 'number') {
                return Math.floor(valor);
            }else{
                //no es un numero
            }
        }else if(this.operadorNativa === OperadorNativa.TYPEOF){
            if (this.expresion instanceof AccesoVariable) {
                let tipo = this.expresion.getTipo(ent,arbol);
                if (tipo === Tipo.STRUCT || tipo === Tipo.TIPO_STRUCT) {
                    return "struct";
                }else if (tipo === Tipo.ARRAY){
                    return "array";
                }
            }
            let valor = this.expresion.getValorImplicito(ent, arbol);
            return typeof(valor);
        }
        return null;
    }
    traducir(ent: Entorno, arbol: AST, resultado3d: Resultado3D, temporales: Temporales, recursivo: number) {
        throw new Error("Method not implemented.");
    }

    isInt(n:number){
        return Number(n) === n && n % 1 === 0;
    }
    
    getSignoTipo(operador:Operador){
        if(operador == Operador.SUMA){
            return '+';
        }else if(operador == Operador.RESTA){
            return '-';
        }else if(operador == Operador.MULTIPLICACION){
            return '*';
        }else if(operador == Operador.DIVISION){
            return '/';
        }else if(operador == Operador.MAYOR_QUE){
            return '>';
        }else if(operador == Operador.MENOR_QUE){
            return '<';
        }
        return ' ';
    }
}