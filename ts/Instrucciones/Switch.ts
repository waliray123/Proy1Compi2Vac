import exp from "constants";
import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";
import { Declaracion } from "./Declaracion";
import { SwitchCaso } from "./SwitchCaso";

// print("hola mundo");

export class Switch implements Instruccion{
    linea: number;
    columna: number;
    public expresion:any;
    public lista_instrucciones: Array<SwitchCaso>;

    constructor(expresion:any,lista_intstrucciones:Array<SwitchCaso>, linea:number, columna:number){
        this.expresion = expresion;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST,resultado3D:Resultado3D,temporales:Temporales,listaErrores:Array<ErrorG>) {
        if (this.lista_instrucciones.length > 0) {
            let valAsign = this.expresion.traducir(ent, arbol, resultado3D, temporales, listaErrores);

            let ultL = temporales.ultLiteral + 1;
            let cantCase = this.lista_instrucciones.length;
            
            if (this.lista_instrucciones[this.lista_instrucciones.length - 1].id.getTipo(ent,arbol,listaErrores) == Tipo.NULL) {
                temporales.ultLiteral += ((cantCase-1)*2) + 1;
            }else{
                temporales.ultLiteral += cantCase*2;
            }
            
            let i = 0;
            for(var caso of this.lista_instrucciones){

                if (i != 0) {
                    resultado3D.codigo3D += '\tL'+ultL+':\n';
                    ultL += 1;
                }                

                if (caso.id.getTipo(ent,arbol,listaErrores) != Tipo.NULL) {
                    let valorCaso = caso.id.traducir(ent, arbol, resultado3D, temporales, 0);
                    resultado3D.codigo3D += '\tif('+valAsign+' == '+ valorCaso +') goto L'+ultL+';\n';            
                    resultado3D.codigo3D += '\tgoto L'+(ultL+1)+';\n';
                    resultado3D.codigo3D += '\tL'+ultL+':\n';
                    if (i+1 == this.lista_instrucciones.length) {
                        ultL += 1;
                    }
                }                
                caso.traducir(ent,arbol,resultado3D,temporales,listaErrores);  
                ultL += 1;
                i += 1;
            }
            ultL -= 1;
            resultado3D.codigo3D += '\tL'+(ultL)+':\n';
            temporales.ultLitEscr = ultL;
        }
        
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        let isFound = false;
        for(var caso of this.lista_instrucciones){
            if (this.expresion.getValorImplicito(ent,arbol) == caso.id.getValorImplicito(ent, arbol,listaErrores) || caso.id.getTipo(ent,arbol,listaErrores) == Tipo.NULL || isFound) {
                caso.ejecutar(ent,arbol,listaErrores);
                isFound = true;
                if (caso.getIsBreak()) {
                    break;
                }else if(caso.getIsContinue()) {
                    continue;
                }
            }
        }
    }

}