import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Instruccion } from "../Interfaces/Instruccion";
import { Parametro } from "../Instrucciones/Parametro";
import { ParametroReturn } from "../Expresiones/ParametroReturn";
import { Tipo } from "../AST/Tipo";
import { Declaracion } from "./Declaracion";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";

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

    traducir(ent: Entorno, arbol: AST,resultado3D:Resultado3D,temporales:Temporales) {
        const entornoGlobal:Entorno = new Entorno(ent);

        this.instrucciones.forEach((element:Instruccion) => {
            element.traducir(entornoGlobal,arbol,resultado3D,temporales);
        })

    }

    ejecutar(ent: Entorno, arbol: AST) {        

        
        const entornoGlobal:Entorno = new Entorno(ent);
        
        //Declarar todos los parametros
        this.declararParametrosReturn(entornoGlobal,arbol);

        //recorro todas las raices  RECURSIVA
        this.instrucciones.forEach((element:Instruccion) => {
            element.ejecutar(entornoGlobal,arbol);
        })
        // console.log(this.instrucciones);
    }

    getTipo(){
        return "funcion";
    }

    setParametrosReturn(parametrosR:Array<ParametroReturn>){
        this.parametrosR = parametrosR;        
    }

    declararParametrosReturn(ent: Entorno, arbol: AST){
        try {
            for(let i = 0; i < this.parametros.length; i++){
                let parametro = this.parametros[i];
                let parametroR = this.parametrosR[i];
                if(parametroR.getTipo(ent,arbol) == parametro.tipoParametro){
                    //id:Array<string>,tipo:Tipo, linea:number, columna:number,expresion:Expresion                                        
                    let declPar = new Declaracion([parametro.id],parametro.tipoParametro,this.linea,this.columna,parametroR.valor);
                    declPar.ejecutar(ent,arbol);
                }
            }    
        } catch (error) {
            console.log("Error al declarar un parametro");
        }
        
    }
}