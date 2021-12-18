import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { ErrorG } from "../Objetos/ErrorG";

export interface Expresion{
     linea:number;
     columna: number;
    
     getTipo(ent:Entorno, arbol:AST,listaErrores:Array<ErrorG>):Tipo ;
     getValorImplicito(ent:Entorno, arbol:AST,listaErrores:Array<ErrorG>):any;
     traducir(ent:Entorno, arbol:AST,resultado3d:Resultado3D,temporales:Temporales,recursivo:number):any ;
     
}