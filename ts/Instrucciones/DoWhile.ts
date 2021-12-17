import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

export class DoWhile implements Instruccion{
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
        }        
        let ulLit = temporales.ultLiteral;
        temporales.ultLiteral += 1;

        this.instrucciones.forEach((element:Instruccion) => {
            element.traducir(entornolocal,arbol,resultado3D,temporales);
        });                   
        
        let valAsign = this.expresion.traducir(entornolocal,arbol,resultado3D,temporales,0);
        resultado3D.codigo3D += '\tif('+valAsign+') goto L' + ulLit + ';\n';
    }

    ejecutar(ent: Entorno, arbol: AST) {
        const entornolocal:Entorno = new Entorno(ent);
        let realizar = this.expresion.getValorImplicito(entornolocal,arbol);
        let contSalir = 0;
        do{            
            this.instrucciones.forEach((element:Instruccion) => {
                element.ejecutar(entornolocal,arbol);
            });
            realizar = this.expresion.getValorImplicito(entornolocal,arbol);            
            if(contSalir == 5000){
                realizar = false;
            }
            contSalir++;
        }while(realizar);
    }

}