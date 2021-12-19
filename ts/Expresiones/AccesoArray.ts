import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Simbolo } from "../AST/Simbolo";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Declaracion } from "../Instrucciones/Declaracion";
import { Expresion } from "../Interfaces/Expresion";
import { ErrorG } from "../Objetos/ErrorG";
import { AccesoVariable } from "./AccesoVariable";

export class AccesoArray implements Expresion {
    linea: number;
    columna: number;
    public contenido: Array<Expresion>;

    constructor(contenido: Array<Expresion>, linea:number, columna:number){
        this.contenido = contenido;
        this.linea = linea;
        this.columna = columna;
    }
    
    traducir(ent: Entorno, arbol: AST,resultado3d: Resultado3D, temporales: Temporales,recursivo: number) {
        temporales.ultimoTemp += 1;
        let tempAux = temporales.ultimoTemp;
        resultado3d.codigo3D += '\tt'+ tempAux + '= H;\n';

        temporales.ultimoTemp += 1;
        this.contenido.forEach((contenido:Expresion) => {
            let valor = contenido.traducir(ent,arbol,resultado3d,temporales,0);
            resultado3d.codigo3D += '\theap[(int)H] = '+valor+';\n'; 
            resultado3d.codigo3D += '\tH = H + 1;\n';
        });
        resultado3d.codigo3D += '\theap[(int)H] = -1;\n'; 
        resultado3d.codigo3D += '\tH = H + 1;\n';
        return 't'+tempAux;
    }

    getTipo(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>):Tipo {
        return Tipo.ARRAY;
    }

    getValorImplicito(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        try{
           return this.contenido;
        }catch(e){
            console.error("hubo un error en AccesoArray " + e);
            return null;
        }
    }
    
}