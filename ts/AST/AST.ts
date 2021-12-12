import { Instruccion } from "../Interfaces/Instruccion";
import { Struct } from "../Instrucciones/Struct";
import { Funcion } from "../Instrucciones/Funcion";

export class AST{
    
    public instrucciones:Array<Instruccion>
    public structs: Array<Struct>
    public funciones: Array<Funcion>

    constructor(instrucciones:Array<Instruccion>,structs: Array<Struct>,funciones: Array<Funcion>){
        this.instrucciones = instrucciones;
        this.structs = structs;
        this.funciones = funciones;        
    }
    
    



}