import { Instruccion } from "../Interfaces/Instruccion";
import { Struct } from "../Instrucciones/Struct";
import { Funcion } from "../Instrucciones/Funcion";
import { Expresion } from "../Interfaces/Expresion";
import { Tipo } from "../AST/Tipo";
import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";

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

    push(nuevo:Expresion){

    }

    pop(){

    }

    comprobarTipo(ent:Entorno, arbol: AST):boolean{
        let isFine:boolean = true;
        this.contenido.forEach((cont:Expresion) =>{
            if (!(cont.getTipo(ent,arbol) == this.tipo)) {
                isFine = false;
                console.log('Error semantico, el valor: ' + cont.getValorImplicito(ent, arbol) + ' no concuerda con el tipo del arreglo en la linea '+ this.linea + ' y columna ' + this.columna)
            }
        });
        return isFine;
    }

}