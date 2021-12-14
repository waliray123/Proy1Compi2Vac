import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Declaracion } from "./Declaracion";
import { FuncionReturn } from "./FuncionReturn";
import { Parametro } from "./Parametro";
import { ParametroReturn } from "../Expresiones/ParametroReturn";

// print("hola mundo");

export class DeclaracionStruct implements Instruccion{
    linea: number;
    columna: number;
    public id:string;
    public expresion:Expresion;
    public tipo:string;

    constructor(id:string,tipo:string, linea:number, columna:number,expresion:Expresion){
        this.id = id;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST) {
        if (ent.existe(this.tipo)) {
            if (this.expresion instanceof FuncionReturn) { //evalua que se este haciendo una instancia de la estructura
                //verificar que tengan la misma cantidad de parametros
                let struct:Simbolo = ent.getSimbolo(this.tipo);
                if (struct.getTipo(ent,arbol) === Tipo.STRUCT){
                    let structVars:Array<Declaracion> = struct.getValorImplicito(ent, arbol);
                    let parametros:Array<ParametroReturn> = this.expresion.parametros;
                    //verificar
                    if  (!ent.existe(this.id)){
                        if (structVars.length == parametros.length) {
                            let error:boolean = false;
                            structVars.forEach((declaracion:Declaracion, index, array) =>{
                                let param: ParametroReturn = parametros[index];

                                // console.log("--index---------" + index);
                                // console.log(declaracion.tipo);
                                // console.log(param.getTipo(ent,arbol));
                                
                                if (declaracion.tipo === param.getTipo(ent,arbol) ||  param.getTipo(ent,arbol) === Tipo.NULL) {
                                    // console.log("Si son compatibles");
                                    declaracion.expresion = param;
                                }else{
                                    console.log('Error semantico, El parametro ' + param.getValorImplicito(ent, arbol)  + ' no coincide con el tipo del atributo de la estructura en la linea '+ this.linea + ' y columna ' + this.columna);
                                    error =  true;
                                }
                            })
                            if (!error) {//ingresamos la variable
                                //let entorno: Entorno = new Entorno(ent);//puede que no necesite esto
                                let simbol = new Simbolo(Tipo.TIPO_STRUCT,this.id,this.linea,this.columna,structVars);
                                simbol.setTipoStruct(this.tipo);
                                ent.agregar(this.id,simbol);
                            }else{
                                // console.log('No se ingreso la variable');
                            }
                        }else{
                            console.log('Error semantico, La cantidad de parametros no concuerdan con la estructura en la linea '+ this.linea + ' y columna ' + this.columna);
                        }
                    }else{
                        console.log('Error semantico, La variable '+ this.id +' ya existe en el entorno, en la linea '+ this.linea + ' y columna ' + this.columna)
                    }
                }else{
                    console.log('Error semantico, El tipo declarado no es un struct en la linea '+ this.linea + ' y columna ' + this.columna);
                }
            }else{
                console.log('Error semantico, no se esta inicializando la estructura en la linea '+ this.linea + ' y columna ' + this.columna);
            }
        }else{
            console.log('Error semantico, no exite la Estructura '+ this.tipo+' en la linea '+ this.linea + ' y columna ' + this.columna);
        }
    }

    getValDefault():any {
        // if (this.tipo == Tipo.STRING) {
        //     return "undefined";
        // }else if (this.tipo == Tipo.BOOL){
        //     return true;
        // }else if (this.tipo == Tipo.INT){
        //     return 1;
        // }else if (this.tipo == Tipo.CHAR){
        //     return 'a';
        // }else if (this.tipo == Tipo.DOUBLE) {
        //     return 1.0;
        // }else{
        //     return null;
        // }
    }

}