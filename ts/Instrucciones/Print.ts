import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";

// print("hola mundo");

export class Print implements Instruccion{
    linea: number;
    columna: number;
    public expresion:Expresion;
    public haysalto:boolean;

    constructor(exp:Expresion, linea:number, columna:number,haysalto:boolean){
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
        this.haysalto = haysalto;
    }

    traducir(ent: Entorno, arbol: AST,resultado3d:Resultado3D,temporales:Temporales) {
        let valAsign = this.expresion.traducir(ent,arbol,resultado3d,temporales,0);

        if(temporales.ultimoTipo == Tipo.STRING){   
            temporales.ultimoTemp += 1;
            resultado3d.codigo3D += '\tt'+temporales.ultimoTemp+' = P + '+ (temporales.ultstack+1)+';\n';
            resultado3d.codigo3D += '\tt'+temporales.ultimoTemp+' = t'+temporales.ultimoTemp+' + 1;\n';
            resultado3d.codigo3D += '\tstack[(int)t'+temporales.ultimoTemp+'] = '+valAsign+';\n';
            resultado3d.codigo3D += '\tP = P + '+(temporales.ultstack+1)+';\n';
            resultado3d.codigo3D += '\tprintString();\n';
            resultado3d.codigo3D += '\tP = P - '+(temporales.ultstack+1)+';\n';
            if(this.haysalto){
                resultado3d.codigo3D += '\tprintf("%c", (char)10);\n';
            }
            temporales.usoPrintStrings = true;            
        }else if(temporales.ultimoTipo == Tipo.BOOL){
            temporales.ultLiteral += 3;
            let ultLit = temporales.ultLiteral-2;
            resultado3d.codigo3D += '\tif('+valAsign+' == 1) goto L'+ultLit+';\n';
            resultado3d.codigo3D += '\tgoto L'+(ultLit+1)+';\n';
            resultado3d.codigo3D += '\tL'+ultLit+':\n';
            resultado3d.codigo3D += '\tprintf("%c", (char)116);\n\tprintf("%c", (char)114);\n\tprintf("%c", (char)117);\n\tprintf("%c", (char)101);\n';
            resultado3d.codigo3D += '\tgoto L'+(ultLit+2)+';\n';
            resultado3d.codigo3D += '\tL'+(ultLit+1)+':\n';
            resultado3d.codigo3D += '\tprintf("%c", (char)102);\n\tprintf("%c", (char)97);\n\tprintf("%c", (char)108);\n\tprintf("%c", (char)115);\n\tprintf("%c", (char)101);\n';
            resultado3d.codigo3D += '\tL'+(ultLit+2)+':\n';
            temporales.ultLitEscr = (ultLit+2);
            if(this.haysalto){
                resultado3d.codigo3D += '\tprintf("%c", (char)10);\n';
            }
        }else{            
            let parseo = '\"%f\"';
            let parseo2 = '(double)';            
            resultado3d.codigo3D += '\tprintf('+parseo + ' , '+parseo2+valAsign+');\n';
            if(this.haysalto){
                resultado3d.codigo3D += '\tprintf("%c", (char)10);\n';
            }
        }
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        const valor = this.expresion.getValorImplicito(ent, arbol,listaErrores);
        if(valor!==null){
            console.log('>',valor);
            const area = document.getElementById('consola') as HTMLTextAreaElement;

            if(this.haysalto){
                area.value = area.value + valor + "\n";
            }else{
                area.value = area.value + valor;
            }
            
            
        }else{
            console.log('>> Error, no se pueden imprimir valores nulos');
            listaErrores.push(new ErrorG('semantico','>> Error, no se pueden imprimir valores nulos',this.linea,this.columna));
        }
    }

}