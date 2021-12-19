import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Simbolo } from "../AST/Simbolo";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Arreglo } from "../Objetos/Arreglo";
import { ErrorG } from "../Objetos/ErrorG";
import { Declaracion } from "./Declaracion";

export class AsignacionArray implements Instruccion{
    linea: number;
    columna: number;
    public id:string;
    public posicion: Expresion;
    public expresion:Expresion;

    constructor(id:string, posicion:Expresion, linea:number, columna:number,expresion:Expresion){
        this.id = id;
        this.posicion = posicion;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST,resultado3d: Resultado3D, temporales: Temporales,listaErrores:Array<ErrorG>) {

        if (ent.existe(this.id)) {
            let simbol:Simbolo = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent,arbol) ==  Tipo.ARRAY) {

                // let valor:Arreglo = simbol.getValorImplicito(ent,arbol);

                let pos = this.posicion.traducir(ent,arbol,resultado3d,temporales,0);
                let val = this.expresion.traducir(ent,arbol,resultado3d,temporales,0);
                temporales.ultimoTemp += 1;
                let stackPos = temporales.ultimoTemp;
                resultado3d.codigo3D += '\tt'+ stackPos +' = stack[(int)'+simbol.valor+'];\n';
                temporales.ultimoTemp += 1;
                resultado3d.codigo3D += '\tt'+temporales.ultimoTemp+' = t'+ stackPos + ' + ' + pos+';\n';
                resultado3d.codigo3D += '\theap[(int) t'+temporales.ultimoTemp+'] ='+ val  +';\n';

            }else{
                listaErrores.push(new ErrorG('semantico','la variable no es del tipo array',this.linea,this.columna));
            }
        }else{
            listaErrores.push(new ErrorG('semantico','no existe la variable',this.linea,this.columna));
        }
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        if (ent.existe(this.id)) {
            let simbol:Simbolo = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent,arbol) ==  Tipo.ARRAY) {
                let valor:Arreglo = simbol.getValorImplicito(ent,arbol);
                let pos = this.posicion.getValorImplicito(ent, arbol,listaErrores);
                if (typeof(pos) == 'number') {
                    if (pos >= 0 && pos < valor.length) {
                        if (this.expresion.getTipo(ent,arbol,listaErrores) == valor.tipo ) {
                            valor.contenido[pos] = this.expresion;
                        }else{
                            listaErrores.push(new ErrorG('semantico','no esta en el rango del arreglo',this.linea,this.columna));
                        }
                    }else{
                        listaErrores.push(new ErrorG('semantico','la posicion declarada no es un numero',this.linea,this.columna));
                    }
                }
            }else{
                listaErrores.push(new ErrorG('semantico','la variable no es del tipo array',this.linea,this.columna));
            }
        }else{
            listaErrores.push(new ErrorG('semantico','no existe la variable',this.linea,this.columna));
        }
    }
    getTipo(){
        return "asignacion";
    }

}