import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Simbolo } from "../AST/Simbolo";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Declaracion } from "../Instrucciones/Declaracion";
import { Expresion } from "../Interfaces/Expresion";
import { Arreglo } from "../Objetos/Arreglo";
import { ErrorG } from "../Objetos/ErrorG";
import { AccesoVariable } from "./AccesoVariable";

export class AccesoAtribArray implements Expresion {
    linea: number;
    columna: number;
    public id:string;
    public posicion: Expresion;

    constructor(id:string,posicion:Expresion, linea:number, columna:number){
        this.id = id;
        this.posicion = posicion;
        this.linea = linea;
        this.columna = columna;
    }
    
    traducir(ent: Entorno, arbol: AST,resultado3d: Resultado3D, temporales: Temporales,recursivo: number) {
        if (ent.existe(this.id)) {
            let simbol:Simbolo = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent,arbol) == Tipo.ARRAY) {

                let pos = this.posicion.traducir(ent,arbol,resultado3d,temporales,0);
                temporales.ultimoTemp += 1;
                let stackPos = temporales.ultimoTemp;
                resultado3d.codigo3D += '\tt'+ stackPos +' = stack[(int)'+simbol.valor+'];\n';
                temporales.ultimoTemp += 1;
                let posHeap = temporales.ultimoTemp;
                resultado3d.codigo3D += '\tt'+posHeap+' = t'+ stackPos + ' + ' + pos+';\n';
                temporales.ultimoTemp += 1;
                resultado3d.codigo3D += '\tt'+temporales.ultimoTemp+' = heap[(int) t'+posHeap+'];\n';

                return 't'+ temporales.ultimoTemp;
            }
        }else{

        }
    }

    getTipo(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>):Tipo {
        if (ent.existe(this.id)) {
            let simbol:Simbolo = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent,arbol) ==  Tipo.ARRAY) {
                let valor:Arreglo = simbol.getValorImplicito(ent,arbol);
                return valor.tipo;                
            }else{
                return Tipo.NULL;
            }
        }else{
            return Tipo.NULL;
        }
    }

    getValorImplicito(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        if (ent.existe(this.id)) {
            let simbol:Simbolo = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent,arbol) ==  Tipo.ARRAY) {
                let valor:Arreglo = simbol.getValorImplicito(ent,arbol);
                let pos = this.posicion.getValorImplicito(ent, arbol,listaErrores);
                if (typeof(pos) == 'number') {
                    if (pos >= 0 && pos < valor.length) {
                        return valor.contenido[pos].getValorImplicito(ent, arbol,listaErrores);
                    }else{
                        listaErrores.push(new ErrorG('semantico','index fuera del limite del arreglo',this.linea,this.columna));
                        return null;
                    }
                }
            }else{
                listaErrores.push(new ErrorG('semantico','la variable no es del tipo array',this.linea,this.columna));
            }
        }else{
            listaErrores.push(new ErrorG('semantico','no existe la variable ' + this.id,this.linea,this.columna));
        }
    }
    
}