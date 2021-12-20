import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Arreglo } from "../Objetos/Arreglo";
import { ErrorG } from "../Objetos/ErrorG";

export class ArrbegEnd implements Expresion {
    linea: number;
    columna: number;
    id: string;
    expresion1: Expresion;
    expresion2: Expresion;
    public isAlone: boolean;

    constructor(id:string, linea:number, columna:number,expresion1:Expresion,expresion2:Expresion){
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
        this.isAlone = true;
    }
    
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>): Tipo {
        if (this.isAlone) {
            return Tipo.ARRAY;    
        }
        if(ent.existe(this.id)){
            let simbol:Simbolo = ent.getSimbolo(this.id);
            let valor:Arreglo = simbol.getValorImplicito(ent,arbol);
            return valor.tipo;
        }   
        return Tipo.NULL;     
    }

    getValorImplicito(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
       
        if (ent.existe(this.id)) {
            let simbol:Simbolo = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent,arbol) ==  Tipo.ARRAY) {
                let valor:Arreglo = simbol.getValorImplicito(ent,arbol);

                let inicio = this.expresion1.getValorImplicito(ent, arbol,listaErrores);
                let final = this.expresion2.getValorImplicito(ent, arbol,listaErrores);

                let datosArray = this.devolverArreglo(inicio,final,valor,listaErrores);
                if (this.isAlone) {

                    let sendResultado = 'undefined'
                    if (datosArray.length > 0) {
                        sendResultado = '[';    
                    }     
                                   
                    let i = 0;
                    datosArray.forEach((expr:Expresion)=>{
                        sendResultado += expr.getValorImplicito(ent, arbol,listaErrores);//ahora veo si lo dejo asi
                        if (i == datosArray.length - 1) {
                            sendResultado += ']';
                        } else {
                            sendResultado += ',';
                        }
                        i++;
                    })
                    return sendResultado;

                }else{
                    return datosArray;
                }               
                
            }else{
                listaErrores.push(new ErrorG('semantico','la variable no es del tipo array',this.linea,this.columna));
            }
        }else{
            listaErrores.push(new ErrorG('semantico','no existe la variable ' + this.id,this.linea,this.columna));
        }
    }

    isInt(n:number){
        return Number(n) === n && n % 1 === 0;
    }

    verificarDimension(pos:number,max:number,listaErrores:Array<ErrorG>):boolean{
        if (pos >= 0 && pos < max) {
            return true;
        }else{
            listaErrores.push(new ErrorG('semantico','index ['+pos+'] fuera del limite del arreglo',this.linea,this.columna));
            return false;
        }
    }
    
    devolverArreglo(inicio:any,final:any,valor:Arreglo,listaErrores:Array<ErrorG>){

        if (inicio == 'begin' && final == 'end') {
            // begin end
            return valor.contenido;
            
        }else if (inicio == 'begin' && final != 'end'){
            // begin expresion            
            if (typeof(final)=='number') {
                let isFinal = this.verificarDimension(final,valor.length,listaErrores);
                if (isFinal) {
                    let datosArray = [];
                    for (let i = 0; i <= final; i++){
                        datosArray.push(valor.contenido[i]);
                    }
                    return datosArray;
                }
                
            }else{
                listaErrores.push(new ErrorG('semantico','la posicion final colocada no es numerico',this.linea,this.columna));
            }

        }else if (inicio != 'begin'  && final == 'end'){
            // expresion end
            if (typeof(inicio)=='number') {
                let isInicio = this.verificarDimension(inicio,valor.length,listaErrores);
                if (isInicio) {
                    let datosArray = [];
                    for (let i = inicio; i < valor.length; i++){
                        datosArray.push(valor.contenido[i]);
                    }
                    return datosArray;
                }
                
            }else{
                listaErrores.push(new ErrorG('semantico','la posicion final colocada no es numerico',this.linea,this.columna));
            }

        }else{
            // expresion expresion
            if (typeof(inicio) == 'number' && typeof(final) == 'number') {
                let isInicio = this.verificarDimension(inicio,final,listaErrores);
                let isFinal = this.verificarDimension(final,valor.length,listaErrores);

                if (isInicio && isFinal) {
                    let datosArray = [];
                    for (let i = inicio; i <= final; i++){
                        datosArray.push(valor.contenido[i]);
                    }
                    return datosArray;
                }

            }else{
                listaErrores.push(new ErrorG('semantico','las posiciones colocadas no son numericos',this.linea,this.columna));
            }

        }
        return [];
    }
}