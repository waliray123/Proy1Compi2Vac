import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { AccesoArray } from "../Expresiones/AccesoArray";
import { ArrbegEnd } from "../Expresiones/ArrbegEnd";
import { Primitivo } from "../Expresiones/Primitivo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";
import { Asignacion } from "./Asignacion";
import { Declaracion } from "./Declaracion";

export enum CasoForIn{
    IDVAR,
    ARRBEGEND,
    ARRAY,
    NULL
}


export class Forin implements Instruccion{
    linea: number;
    columna: number;
    public instrucciones:Array<Instruccion>;
    public expresion1: string;
    public expresion2: any;


    constructor(linea:number, columna:number,instrucciones:Array<Instruccion>,expresion1:string,expresion2:any){        
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        let variable = this.expresion1;
        let condicion = this.expresion2;
        const entNuevo:Entorno = new Entorno(ent);
        let casoForIn:CasoForIn = CasoForIn.NULL;

        //variables nulos 
        let condicionArreglo:Array<Expresion> = []


        //configurando la declaracion
        let variables = [];
        variables.push(variable);
        
        let tipoVariable = Tipo.NULL;
        //IDVAR
        //[]
        //array[]
        if(condicion instanceof ArrbegEnd){

            //array[]
            casoForIn = CasoForIn.ARRBEGEND;
            condicion.isAlone = false;
            tipoVariable = condicion.getTipo(ent,arbol,listaErrores);
            condicion.isAlone = true;

        }else if(typeof(condicion) === 'string'){

            //IDVAR
            if(ent.existe(condicion)){
                casoForIn = CasoForIn.IDVAR;
                let simbol: Simbolo = ent.getSimbolo(condicion);
                tipoVariable = simbol.getTipo(ent,arbol);
            }else{
                listaErrores.push(new ErrorG('semantico','no existe la variable ' + condicion,this.linea,this.columna));
            }

        }else{

            //[]
            casoForIn = CasoForIn.ARRAY;
            condicionArreglo = condicion;
            tipoVariable = condicionArreglo[0].getTipo(ent,arbol,listaErrores);
        }

        // //@ts-ignore
        // let declaraVariable: Declaracion = new Declaracion(variables,Tipo.STRING,this.linea,this.columna,null);
        
        if (!entNuevo.existeEnActual(variable)) {
            let simbol = new Simbolo(tipoVariable,variable,this.linea,this.columna,null);
            entNuevo.agregar(variable,simbol);
        }else{
            console.log('anda medio raro que si exista');
        }


        let isTerminado = false;

        switch (casoForIn) {
            case CasoForIn.ARRAY:{

                break;
            }                
            case CasoForIn.IDVAR:{
                let simbol: Simbolo = ent.getSimbolo(condicion);
                let valor = simbol.getValorImplicito(ent,arbol);

                for (let i = 0; i < valor.length; i++) {                    
                    let letra = valor.substr(i,1);
                    let variables = [];
                    variables.push(variable);
                    let expr: Primitivo = new Primitivo(letra,this.linea,this.columna);
                    let asignar:Asignacion = new Asignacion(variables,this.linea,this.columna,expr);
                    asignar.ejecutar(entNuevo,arbol,listaErrores);
                    for(var instruccion of this.instrucciones){
                        instruccion.ejecutar(entNuevo,arbol,listaErrores);
                    }
                }
                break;
            }
            case CasoForIn.ARRBEGEND:{

                break;
            }
            default:
                break;
        }

    }

    getValDefault(tipo:Tipo):any {
        if (tipo == Tipo.STRING) {
            return "undefined";
        }else if (tipo == Tipo.BOOL){
            return true;
        }else if (tipo == Tipo.INT){
            return 1;
        }else if (tipo == Tipo.CHAR){
            return 'a';
        }else if (tipo == Tipo.DOUBLE) {
            return 1.0;
        }else{
            return null;
        }
    }
}