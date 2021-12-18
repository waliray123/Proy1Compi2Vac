import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";

export class While implements Instruccion{
    linea: number;
    columna: number;    
    public instrucciones:Array<Instruccion>;        
    public expresion: Expresion;    


    constructor(linea:number, columna:number,instrucciones:Array<Instruccion>,expresion:Expresion){        
        this.linea = linea;
        this.columna = columna;        
        this.instrucciones = instrucciones;                
        this.expresion = expresion;
    }

    traducir(ent: Entorno, arbol: AST,resultado3D:Resultado3D,temporales:Temporales) {
        const entornolocal:Entorno = new Entorno(ent);    
        if(temporales.ultLiteral == 0){
            resultado3D.codigo3D += '\tL'+temporales.ultLiteral + ":\n";  
            temporales.ultLitEscr = 0;  
        }
        let ultEscrito = temporales.ultLitEscr;
        temporales.ultLiteral += 2;
        let ulLit = temporales.ultLiteral-1;
        let valAsign = this.expresion.traducir(entornolocal,arbol,resultado3D,temporales,0);
        resultado3D.codigo3D += '\tif('+valAsign+') goto L' + ulLit + ';\n';
        resultado3D.codigo3D += '\tgoto L'+(ulLit+1)+';\n';
        resultado3D.codigo3D += '\tL'+(ulLit)+':\n';
        //Traducir instrucciones
        this.instrucciones.forEach((element:Instruccion) => {
            element.traducir(entornolocal,arbol,resultado3D,temporales);
        });
        resultado3D.codigo3D += '\tgoto L'+(ultEscrito)+';\n';
        resultado3D.codigo3D += '\tL'+(ulLit+1)+':\n';        
        temporales.ultLitEscr = ulLit+1;

    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        const entornolocal:Entorno = new Entorno(ent);
        let realizar = this.expresion.getValorImplicito(entornolocal,arbol);
        let contSalir = 0;
        while(realizar){            
            this.instrucciones.forEach((element:Instruccion) => {
                element.ejecutar(entornolocal,arbol,listaErrores);
            });
            realizar = this.expresion.getValorImplicito(entornolocal,arbol);            
            if(contSalir == 5000){
                realizar = false;
            }
            contSalir++;
        }
                   
    }

}