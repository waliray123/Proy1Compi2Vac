import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
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

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
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