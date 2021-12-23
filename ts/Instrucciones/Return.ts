import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";
import { If } from "./If";

// print("hola mundo");

export class Return implements Instruccion {
    linea: number;
    columna: number;
    public expresion: Expresion;

    constructor(exp: Expresion, linea: number, columna: number) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent: Entorno, arbol: AST, resultado3d: Resultado3D, temporales: Temporales) {
        let valAsign = this.expresion.traducir(ent,arbol,resultado3d,temporales,0);
        if(temporales.ultimoTipo == Tipo.BOOL){
            if(temporales.esFuncion){                
                temporales.ultLiteral += 3;
                let ultLit = temporales.ultLiteral-2;
                resultado3d.codigo3D += '\tif('+valAsign+') goto L'+ultLit+';\n';
                resultado3d.codigo3D += '\tgoto L'+(ultLit+1)+';\n';
                resultado3d.codigo3D += '\tL'+ultLit+':\n';
                resultado3d.codigo3D += '\tstack[(int)P] = 1;\n';
                resultado3d.codigo3D += '\treturn;\n';
                resultado3d.codigo3D += '\tgoto L'+(ultLit+2)+';\n';
                resultado3d.codigo3D += '\tL'+(ultLit+1)+':\n';
                resultado3d.codigo3D += '\tstack[(int)P] = 0;\n';
                resultado3d.codigo3D += '\treturn;\n';
                resultado3d.codigo3D += '\tL'+(ultLit+2)+':\n';
                temporales.ultLitEscr = (ultLit+2);
            }                                           
        }else{
            if(temporales.esFuncion){                       
                resultado3d.codigo3D += '\tstack[(int)P] ='+ valAsign  +';\n';
                resultado3d.codigo3D += '\treturn;\n';
            }                        
        }
    }

    ejecutar(ent: Entorno, arbol: AST, listaErrores: Array<ErrorG>) {
        // console.log('Ejecutando return');
        if(this.expresion != null){
            let valExpr = this.expresion.getValorImplicito(ent,arbol,listaErrores);            
            ent.valorReturn = valExpr;
            // console.log(ent.valorReturn);
        }
        return 'RETORNAR';
    }

}