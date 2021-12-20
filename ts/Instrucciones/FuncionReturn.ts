import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Instruccion } from "../Interfaces/Instruccion";
import { Parametro } from "../Instrucciones/Parametro";
import { Funcion } from "../Instrucciones/Funcion";
import { ParametroReturn } from "../Expresiones/ParametroReturn";
import { ErrorG } from "../Objetos/ErrorG";
import { Tipo } from "../AST/Tipo";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";

export class FuncionReturn implements Instruccion{
    linea: number;
    columna: number;
    public nombrefuncion:String;
    public parametros:Array<ParametroReturn>;

    constructor(nombrefuncion:String,linea:number, columna:number,parametros:Array<ParametroReturn>=[]){
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.parametros = parametros;
    }

    traducir(ent: Entorno, arbol: AST,resultado3d:Resultado3D,temporales:Temporales,listaErrores:Array<ErrorG>) {
        const funciones = arbol.funciones;
        for(let element of funciones){
            if(this.nombrefuncion == element.nombrefuncion){ 
                
                if(temporales.esFuncion){

                }else{                    
                    //let ultTemp = temporales.ultimoTemp;

                    //Asignar parametros
                    let cont = 0;
                    for (const parametro of this.parametros) {
                        let valAsign = parametro.valor.traducir(ent,arbol,resultado3d,temporales,0)
                        if(cont == 0){
                            temporales.ultimoTemp += 1;
                            resultado3d.codigo3D += '\tt'+temporales.ultimoTemp+' = P + '+ (temporales.ultstack+2)+';\n';
                            resultado3d.codigo3D += '\tstack[(int)t'+temporales.ultimoTemp+'] = '+valAsign+';\n'; 
                        }else{
                            resultado3d.codigo3D += '\tt'+temporales.ultimoTemp+' = '+temporales.ultimoTemp+' + 1;\n';
                            resultado3d.codigo3D += '\tstack[(int)t'+temporales.ultimoTemp+'] = '+valAsign+';\n';                             
                        }                   
                    }             
                    //Llamar a la funcion
                    resultado3d.codigo3D += '\tP = P + '+(temporales.ultstack+1)+';\n';
                    resultado3d.codigo3D += '\t'+this.nombrefuncion+'();\n';
                    temporales.ultimoTemp += 1;
                    resultado3d.codigo3D += '\tt'+temporales.ultimoTemp+' = stack[(int)P];\n';
                    resultado3d.codigo3D += '\tP = P - '+(temporales.ultstack+1)+';\n'; // en P insertare el return y lo parametros en P +1



                }
                
                //resultado3d.codigo3D += '\tstack[(int)t'+temporales.ultimoTemp+'] = '+valAsign+';\n';


                break;
            }
        }
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        const funciones = arbol.funciones;
        for(let element of funciones){
            if(this.nombrefuncion == element.nombrefuncion){                
                element.setParametrosReturn(this.parametros);
                element.ejecutar(ent,arbol,listaErrores);                
                return ent.valorReturn; // Retornar el valor que retorna la funcion ejecutar
            }
        }
    }

    getTipo(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>){
        const funciones = arbol.funciones;        
        for(let element of funciones){
            if(this.nombrefuncion == element.nombrefuncion){                
                return element.tipoFuncion;
            }
        }
    }

    getValorImplicito(ent:Entorno, arbol:AST,listaErrores:Array<ErrorG>){
        const funciones = arbol.funciones;
        for(let element of funciones){
            if(this.nombrefuncion == element.nombrefuncion){                
                element.setParametrosReturn(this.parametros);
                element.ejecutar(ent,arbol,listaErrores);                
                return ent.valorReturn; // Retornar el valor que retorna la funcion ejecutar
            }
        }
    }

}