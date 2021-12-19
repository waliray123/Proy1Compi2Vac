import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Simbolo } from "../AST/Simbolo";
import { Temporales } from "../AST/Temporales";
import { Operacion, Operador } from "../Expresiones/Operacion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";

// print("hola mundo");

export class IncrDecr implements Instruccion{
    linea: number;
    columna: number;        
    public operacion:Operacion;
    public idVar: string;

    constructor(operacion:Operacion, linea:number, columna:number,idVar:string){
        this.operacion = operacion;
        this.linea = linea;
        this.columna = columna;        
        this.idVar = idVar;
    }

    traducir(ent: Entorno, arbol: AST, resultado3d: Resultado3D, temporales: Temporales) {
        if (ent.existe(this.idVar)) {
            let simbol: Simbolo = ent.getSimbolo(this.idVar);                
            temporales.ultimoTemp += 1;
            resultado3d.codigo3D += '\tt'+temporales.ultimoTemp+'= stack[(int)'+simbol.valor+'];\n';
            temporales.ultimoTemp += 1;
            if(this.operacion.operador == Operador.INCREMENTO){
                resultado3d.codigo3D += '\tt'+temporales.ultimoTemp+'= t'+(temporales.ultimoTemp-1)+'+1;\n';
            }else {
                resultado3d.codigo3D += '\tt'+temporales.ultimoTemp+'= t'+(temporales.ultimoTemp-1)+'-1;\n';
            }
            resultado3d.codigo3D +='\tstack[(int)'+simbol.valor+']' + '= t'+temporales.ultimoTemp +';\n';
        }else{
            //Error            
        }
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        const valorIns = this.operacion.getValorImplicito(ent, arbol,listaErrores);
        if(valorIns!==null){                                      
            if (ent.existe(this.idVar)) {
                let simbol: Simbolo = ent.getSimbolo(this.idVar);                
                simbol.valor = valorIns;
            }else{
                // console.log('Error semantico, no existe la variable ' + this.idVar +'en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG('semantico','no existe la variable ' + this.idVar,this.linea,this.columna));
            }                                                        
        }else{
            // console.log("Ocurrio un error al realizar la operacion " + this.operacion.op_izquierda);
            listaErrores.push(new ErrorG('semantico','ocurrio un error al realizar la operacion ' + this.operacion.op_izquierda,this.linea,this.columna));
        }
    }

}