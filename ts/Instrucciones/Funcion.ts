import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Instruccion } from "../Interfaces/Instruccion";
import { Parametro } from "../Instrucciones/Parametro";
import { ParametroReturn } from "../Expresiones/ParametroReturn";
import { Tipo } from "../AST/Tipo";
import { Declaracion } from "./Declaracion";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { ErrorG } from "../Objetos/ErrorG";
import { AccesoVariable } from "../Expresiones/AccesoVariable";
import { DeclaracionArray } from "./DeclaracionArray";
import { Arreglo } from "../Objetos/Arreglo";
import { Simbolo } from "../AST/Simbolo";

export class Funcion implements Instruccion{
    linea: number;
    columna: number;
    public nombrefuncion:String;
    public instrucciones:Array<Instruccion>;
    public tipoFuncion:Tipo;
    public parametros:Array<Parametro>;
    public parametrosR:Array<ParametroReturn>;

    constructor(nombrefuncion:String, tipoFuncion:Tipo,linea:number, columna:number,instrucciones:Array<Instruccion>,parametros:Array<Parametro>=[]){
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.tipoFuncion = tipoFuncion;
        this.parametros = parametros;
        this.parametrosR = [];
    }

    traducir(ent: Entorno, arbol: AST,resultado3D:Resultado3D,temporales:Temporales,listaErrores:Array<ErrorG>) {
        const entornoGlobal:Entorno = new Entorno(ent);        
        if(this.nombrefuncion == "main"){
            temporales.esFuncion = false;
            for(let element of this.instrucciones){
                element.traducir(entornoGlobal,arbol,resultado3D,temporales,listaErrores);
            }
        }else{
            //Traducir segun funcion
            temporales.esFuncion = true;
            temporales.cantidadParametrosFunc = this.parametros.length+1;
            //Traducir traer parametros
            for (const parametro of this.parametros) {
                
            }
            //Traducir completo
            for(let element of this.instrucciones){
                element.traducir(entornoGlobal,arbol,resultado3D,temporales,listaErrores);
            }
        }
        
        /*
        this.instrucciones.forEach((element:Instruccion) => {
            element.traducir(entornoGlobal,arbol,resultado3D,temporales,listaErrores);
        })
        */
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {        

        
        const entornoGlobal:Entorno = new Entorno(ent);
        console.log("Insertando nombreEntorno" + this.nombrefuncion);
        entornoGlobal.nombreEntorno = this.nombrefuncion;
        
        //Declarar todos los parametros
        this.declararParametrosReturn(entornoGlobal,arbol,listaErrores);

        //recorro todas las raices  RECURSIVA
        for(let element of this.instrucciones){
            let valR = element.ejecutar(entornoGlobal,arbol,listaErrores);            
            if(valR == 'RETORNAR'){        
                console.log('VAl return Funcion');   
                ent.valorReturn = entornoGlobal.valorReturn;
                console.log(ent.valorReturn);         
                break;
            }
        }
    }

    getTipo(){
        return "funcion";
    }

    setParametrosReturn(parametrosR:Array<ParametroReturn>){
        this.parametrosR = parametrosR;        
    }

    declararParametrosReturn(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>){
        try {
            for(let i = 0; i < this.parametros.length; i++){
                let parametro = this.parametros[i];
                let parametroR = this.parametrosR[i];
                let tipoR = parametroR.getTipo(ent,arbol,listaErrores);
                if (parametro.isArray) {                    
                    if (tipoR == Tipo.ARRAY) {
                        let paramR = parametroR.valor;
                        if (paramR instanceof AccesoVariable) {
                            paramR.isAlone = false;
                            let valorR:Arreglo = paramR.getValorImplicito(ent,arbol,listaErrores);
                            console.log(valorR);
                            paramR.isAlone = true;
                            
                            if (valorR.tipo == parametro.tipoParametro) {
                                //@ts-ignore
                                let declArr = new DeclaracionArray([parametro.id],parametro.tipoParametro,[],this.linea,this.columna,null);    
                                declArr.ejecutar(ent,arbol,listaErrores);
                                let simbol: Simbolo = ent.getSimbolo(parametro.id);
                                simbol.valor = valorR;
                            }else{
                                listaErrores.push(new ErrorG('semantico','No es del mismo tipo la variable del arreglo',this.linea,this.columna));
                            }                            
                        }
                    }else{
                        listaErrores.push(new ErrorG('semantico','Error, el tipo del parametro no es un arreglo',parametroR.linea,parametroR.columna));
                    }
                }else if(tipoR == parametro.tipoParametro  || (tipoR==Tipo.INT && parametro.tipoParametro == Tipo.DOUBLE) ){
                    //id:Array<string>,tipo:Tipo, linea:number, columna:number,expresion:Expresion                                        
                    let declPar = new Declaracion([parametro.id],parametro.tipoParametro,this.linea,this.columna,parametroR.valor);
                    declPar.ejecutar(ent,arbol,listaErrores);
                }
            }    
        } catch (error) {
            // console.log("Error al declarar un parametro");
            listaErrores.push(new ErrorG('semantico','Error al declarar un parametro',this.linea,this.columna));
        }
        
    }
}