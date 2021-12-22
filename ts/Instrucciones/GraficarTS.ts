import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Instruccion } from "../Interfaces/Instruccion";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { ErrorG } from "../Objetos/ErrorG";
import { Tipo } from "../AST/Tipo";

export class GraficarTS implements Instruccion{
    linea: number;
    columna: number;


    constructor(linea:number, columna:number){
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST,resultado3D:Resultado3D,temporales:Temporales,listaErrores:Array<ErrorG>) {
        //Traducri
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {     
        // console.log('Ejecutando grafica');   
        const tablaSimbolos = document.getElementById('tabla-simbolos') as HTMLTableElement;

        for (let e:Entorno = ent; e != null; e = e.anterior)
        {   
            let tabla = e.tabla;        
            let cont = 0;
            for (let key in tabla) {
                let simbolo = tabla[key];
                let tipoSim = simbolo.getTipo(ent,arbol)
                let entorno = e.nombreEntorno;
                if(entorno == ''){
                    entorno = 'global';
                }
                let valorfila = '<td>'+'variable'+'</td><td>'+simbolo.indentificador+'</td><td>'+tipoSim+'</td><td>'+simbolo.linea+'</td><td>'
                +simbolo.columna+'</td><td>'+cont+'</td><td>'+entorno+'</td><td>'+simbolo.valor+'</td><td>';             

                tablaSimbolos.insertRow(-1).innerHTML = valorfila;

                cont++;
            } 
        }

        let funciones = arbol.funciones;
        let cont = 0;
        for (const funcion of funciones) {
            
            let valorfila = '<td>'+'variable'+'</td><td>'+funcion.nombrefuncion+'</td><td>'+funcion.tipoFuncion+'</td><td>'+funcion.linea+'</td><td>'
                +funcion.columna+'</td><td>'+cont+'</td><td>'+'global'+'</td><td>'+''+'</td><td>';             

            tablaSimbolos.insertRow(-1).innerHTML = valorfila;
            cont++;
        }

               
    }

    getTipoFun(){
        
    }

    getTipo(){
        return "graficarTS";
    }

    
}