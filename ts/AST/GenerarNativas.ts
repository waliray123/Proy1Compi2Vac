
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { ErrorG } from "../Objetos/ErrorG";
import { AST } from "./AST";
import { Entorno } from "./Entorno";


export class GenerarNativas{

    generar(temporales:Temporales){
        let resultado = '';
        if(temporales.usoPrintStrings){
            resultado += 'void printString()\{\n';
            temporales.ultimoTemp += 1;
            resultado += '\tt'+temporales.ultimoTemp + '= P + 1;\n';
            temporales.ultimoTemp += 1;
            resultado += '\tt'+temporales.ultimoTemp + '= stack[(int)t'+(temporales.ultimoTemp-1)+'];\n';
            temporales.ultLiteral += 1;
            resultado += '\tL'+temporales.ultLiteral+':\n';
            temporales.ultimoTemp += 1;
            resultado += '\tt'+temporales.ultimoTemp + '= heap[(int)t'+(temporales.ultimoTemp-1)+'];\n';
            temporales.ultLiteral += 1;
            resultado += '\tif (t'+temporales.ultimoTemp+'==-1) goto L'+temporales.ultLiteral+';\n';
            resultado += '\tprintf("%c", (char)t'+temporales.ultimoTemp+');\n';
            resultado += '\tt'+(temporales.ultimoTemp-1)+'= t'+(temporales.ultimoTemp-1)+'+1;\n';
            resultado += '\tgoto L'+(temporales.ultLiteral-1)+';\n';
            resultado += '\tL'+(temporales.ultLiteral)+':\n';
            resultado += '\treturn; \n\}\n';
        }
        return resultado;
    }

    generarFunciones(ent: Entorno, arbol: AST,temporales:Temporales,listaErrores:Array<ErrorG>){

        let resultado = '';
        
        for (const element of arbol.funciones) {    
            
            if(element.nombrefuncion != 'main'){
                let resultado3d = new Resultado3D;
                //Abrir funcion
                resultado3d.codigo3D += 'void '+element.nombrefuncion +'(){\n';
                element.traducir(ent,arbol,resultado3d,temporales,listaErrores);
                resultado3d.codigo3D += '}\n';
                resultado += resultado3d.codigo3D;
            }
            
        }
        return resultado;
    }
    
}