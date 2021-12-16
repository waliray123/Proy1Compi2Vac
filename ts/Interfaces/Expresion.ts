import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";

export interface Expresion{
     linea:number;
     columna: number;
    
     getTipo(ent:Entorno, arbol:AST):Tipo ;
     getValorImplicito(ent:Entorno, arbol:AST):any;
     traducir(ent:Entorno, arbol:AST,resultado3d:Resultado3D,temporales:Temporales,recursivo:number):any ;
     
}