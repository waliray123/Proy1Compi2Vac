import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { ErrorG } from "../Objetos/ErrorG";

export class Primitivo implements Expresion {
    linea: number;
    columna: number;
    public valor: any;
    public isFlotante:boolean;

    constructor(valor:any, linea:number, columna:number){
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
        this.isFlotante = false;
    }
    
    traducir(ent: Entorno, arbol: AST,resultado3d:Resultado3D,temporales:Temporales) {
        // console.log("Traduciendo Primitivo");
        
        let tipo = this.getTipo(ent,arbol,[]);
        temporales.ultimoTipo = tipo;
        if(tipo == Tipo.STRING){            
            temporales.ultimoTemp += 1;
            resultado3d.codigo3D += '\tt'+temporales.ultimoTemp + '= H;\n';

            
            for(let i = 0; i < this.valor.length ;i++){
                let letra = this.valor.substr(i,1);
                let valLet = letra.charCodeAt();
                resultado3d.codigo3D += '\theap[(int)H] = '+valLet+';\n'; 
                resultado3d.codigo3D += '\tH = H + 1;\n';
                // console.log(valLet);
            }
            resultado3d.codigo3D += '\theap[(int)H] = -1;\n'; 
            resultado3d.codigo3D += '\tH = H + 1;\n';
            return 't'+temporales.ultimoTemp;            
        }else if(tipo == Tipo.BOOL){            
            if(this.valor == true){
                return 1;
            }else{
                return 0;
            }            
        }else{
            return this.valor;
        }
        
    }

    getTipo(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>): Tipo {
        const valor = this.getValorImplicito(ent, arbol,listaErrores);
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
            if (this.isFlotante) {
                return Tipo.DOUBLE;
            }
            if(this.isInt(Number(valor))){
                return Tipo.INT;
            }
           return Tipo.DOUBLE;
        }
        else if(valor === null){
            return Tipo.NULL;
        }
            
        return Tipo.VOID;
    }

    getValorImplicito(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        if(typeof(this.valor) === 'string'){
            const gramatica = require('../../jison/compilerExpresion/stringExpresion');
            let continuar = false;
            let PAI = 0;
            let PAD = 0;
            let resultado = '';
            let resultados = [];
            let stringNormales = [];
            let ultCcharUsasdo = 0;
            for(let i = 0; i < this.valor.length ;i++){
                let letra = this.valor.charAt(i);
                 if( (letra === '$' || continuar) && i+1 < this.valor.length){
                     if (letra == '$'){
                         stringNormales.push(this.valor.substring(ultCcharUsasdo,i));
                     }
                    let sig = this.valor.charAt(i+1);
                    if (sig === '(') {
                        PAI += 1;
                        continuar =  true;
                        resultado += sig;
                    }else if(sig === ')') {
                        PAD += 1;
                        resultado += sig;
                        if (PAI === PAD) {
                            continuar = false;
                            resultados.push(resultado);
                            resultado = '';
                            ultCcharUsasdo = i+2;
                        }
                    }else{
                        resultado += sig;
                        continuar =  true;
                        if (PAI === PAD) {
                            if (i+2 < this.valor.length) {
                                if (this.valor.charAt(i+2) === ' ') {
                                    continuar = false;
                                    resultados.push(resultado);
                                    resultado = '';
                                    ultCcharUsasdo = i+2;
                                }
                            }else{
                                continuar = false;
                                resultados.push(resultado);
                                resultado = '';
                                ultCcharUsasdo = i+2;
                            }                            
                        }
                    }
                 }
                 if (i+1 === this.valor.length) {
                     if (!(ultCcharUsasdo === 0)) {
                        stringNormales.push(this.valor.substring(ultCcharUsasdo,this.valor.length));
                     }
                 }

            }
            if (resultados.length > 0) {
                let exprs: Array<Expresion>= []
                for (var i = 0; i <resultados.length;i++ ){
                    let inst = gramatica.parse(resultados[i]);
                    exprs.push(inst);
                }
                let sendValor = '';
                for(var i = 0; i < exprs.length;i++){
                    sendValor += stringNormales[i] + '' + exprs[i].getValorImplicito(ent, arbol,listaErrores);
                }
                sendValor += stringNormales[stringNormales.length - 1];
                // console.log(sendValor);
                return sendValor;
            }
        }
        return this.valor;
    }

    isInt(n:number){
        return Number(n) === n && n % 1 === 0;
    }
    
}