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

        for(let element of this.instrucciones){
            element.traducir(entornoGlobal,arbol,resultado3D,temporales,listaErrores);
        }
        /*
        this.instrucciones.forEach((element:Instruccion) => {
            element.traducir(entornoGlobal,arbol,resultado3D,temporales,listaErrores);
        })
        */
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {        

        
        const entornoGlobal:Entorno = new Entorno(ent);
        
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
        /*
        this.instrucciones.forEach((element:Instruccion) => {
            element.ejecutar(entornoGlobal,arbol,listaErrores);
        })
        */
        // console.log(this.instrucciones);
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
                if(parametroR.getTipo(ent,arbol,listaErrores) == parametro.tipoParametro){
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