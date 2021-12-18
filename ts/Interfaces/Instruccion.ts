import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { ErrorG } from "../Objetos/ErrorG";

export interface Instruccion{
     linea:number;
     columna: number;
    
     ejecutar(ent:Entorno, arbol:AST,listaErrores:Array<ErrorG>):any ;
     traducir(ent:Entorno, arbol:AST,resultado3d:Resultado3D,temporales:Temporales,listaErrores:Array<ErrorG>):any ;
}