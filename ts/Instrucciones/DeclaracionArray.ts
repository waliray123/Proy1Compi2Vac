import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { AccesoArray } from "../Expresiones/AccesoArray";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Arreglo } from "../Objetos/Arreglo";

// print("hola mundo");

export class DeclaracionArray implements Instruccion{
    linea: number;
    columna: number;
    public id:Array<string>;
    public expresion:Expresion;
    public tipo:Tipo;
    public dimensiones:Array<Expresion>;

    constructor(id:Array<string>,tipo:Tipo,dimensiones:Array<Expresion>, linea:number, columna:number,expresion:Expresion){
        this.id = id;
        this.tipo = tipo;
        this.dimensiones = dimensiones;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        // console.log('ejecutado...'+ this.id);
        this.id.forEach((id:string)=>{
            if(!ent.existe(id)){
                if (this.dimensiones.length == 0) {
                    
                    if (this.expresion == null) {
                        let valor:Arreglo = new Arreglo(this.tipo,0,0,[],this.linea,this.columna);
                        let simbol:Simbolo = new Simbolo(Tipo.ARRAY,id,this.linea,this.columna,valor);
                        ent.agregar(id,simbol);
                    }else{
                        if (this.expresion instanceof AccesoArray) {
                            let valor = this.expresion.getValorImplicito(ent, arbol);
                            if (valor == null) {
                                valor = [];
                            }
                            let valorSimbolo:Arreglo = new Arreglo(this.tipo,valor.length,valor.length, valor,this.linea,this.columna);
                    
                            if (valorSimbolo.comprobarTipo(ent,arbol)) {

                                let simbol:Simbolo = new Simbolo(Tipo.ARRAY,id,this.linea,this.columna,valorSimbolo);
                                ent.agregar(id,simbol);
                            }

                        }else{
                           console.log('Error semantico, la asignacion no es un arreglo de datos en la linea '+ this.linea + ' y columna ' + this.columna); 
                        }
                    }
                }else if (this.dimensiones.length == 1) {
                    if (this.expresion == null) {
                        let valor:Arreglo = new Arreglo(this.tipo,0,0,[],this.linea,this.columna);
                        let simbol:Simbolo = new Simbolo(Tipo.ARRAY,id,this.linea,this.columna,valor);
                        ent.agregar(id,simbol);
                    }else{
                        if (this.expresion instanceof AccesoArray) {
                            let valor = this.expresion.getValorImplicito(ent, arbol);
                            if (valor == null) {
                                valor = [];
                            }
                            let dim = this.dimensiones[0].getValorImplicito(ent, arbol);
                            if (typeof(dim) === 'number') {
                                if (dim === valor.length) {
                                    let valorSimbolo:Arreglo = new Arreglo(this.tipo,valor.length,valor.length, valor,this.linea,this.columna);                    
                                    if (valorSimbolo.comprobarTipo(ent,arbol)) {
                                        let simbol:Simbolo = new Simbolo(Tipo.ARRAY,id,this.linea,this.columna,valorSimbolo);
                                        ent.agregar(id,simbol);
                                    }
                                }else{
                                    //no tienen las mismas dimensiones
                                }
                            }else{
                                //la dimension no es un numero
                            }   
                        }else{
                           console.log('Error semantico, la asignacion no es un arreglo de datos en la linea '+ this.linea + ' y columna ' + this.columna); 
                        }
                    }
                }else{
                    console.log('error semantico, dimension de la declaracion del arreglo no conocido, en la linea '+ this.linea + ' y columna ' + this.columna);
                }
                
            }else{
                console.log('Error semantico, ya existe el id: '+ id + ' en la linea '+ this.linea + ' y columna ' + this.columna);
            }
        })
    }

    getValDefault():any {
        if (this.tipo == Tipo.STRING) {
            return "undefined";
        }else if (this.tipo == Tipo.BOOL){
            return true;
        }else if (this.tipo == Tipo.INT){
            return 1;
        }else if (this.tipo == Tipo.CHAR){
            return 'a';
        }else if (this.tipo == Tipo.DOUBLE) {
            return 1.0;
        }else{
            return null;
        }
    }

}