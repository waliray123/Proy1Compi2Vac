import { Instruccion } from "../Interfaces/Instruccion";
import { Struct } from "../Instrucciones/Struct";
import { Funcion } from "../Instrucciones/Funcion";
import { Expresion } from "../Interfaces/Expresion";
import { Tipo } from "../AST/Tipo";
import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { ErrorG } from "./ErrorG";

export class Arreglo{
    
    public dimension:number;
    public length: number;
    public contenido: Array<Expresion>;
    public tipo:Tipo;
    linea: number;
    columna: number

    constructor(tipo:Tipo, dimension:number, length:number, contenido:Array<Expresion>, linea:number, columna:number){
        this.tipo = tipo;
        this.dimension = dimension;
        this.length = length;
        this.contenido = contenido;
        this.linea = linea;
        this.columna = columna;
    }

    push(ent:Entorno, arbol: AST,nuevo:Expresion,listaErrores:Array<ErrorG>){
        if (nuevo.getTipo(ent,arbol,listaErrores) == this.tipo) {
            this.contenido.push(nuevo);
            this.length += 1;
            this.dimension += 1;
        }else{
            //no es del mismo tipo
        }
    }

    pop(){
        let pop = this.contenido.pop();
        let valor = this.contenido.length;
        if (valor == null) {
            this.length = 0;
            this.dimension = 0;
        }else{
            this.length = valor;
            this.dimension = valor;
        }
        
        return pop;
    }

    getLastContenido(){
        return this.contenido[this.length-1];
    }

    cambiarContenido(contenido: Array<Expresion>){
        this.contenido = contenido;
        this.length =  this.contenido.length;
        this.dimension = this.length;
    }

    comprobarTipo(ent:Entorno, arbol: AST,listaErrores:Array<ErrorG>):boolean{
        let isFine:boolean = true;
        this.contenido.forEach((cont:Expresion) =>{
            if (!(cont.getTipo(ent,arbol,listaErrores) == this.tipo)) {
                isFine = false;
                console.log('Error semantico, el valor: ' + cont.getValorImplicito(ent, arbol,listaErrores) + ' no concuerda con el tipo del arreglo en la linea '+ this.linea + ' y columna ' + this.columna)
            }
        });
        return isFine;
    }

}