import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

export class For implements Instruccion{
    linea: number;
    columna: number;    
    public instrucciones:Array<Instruccion>;    
    public declAsign:any;
    public expresion1: Expresion;
    public expresion2: any;


    constructor(linea:number, columna:number,instrucciones:Array<Instruccion>,declAsign:any,expresion1:Expresion,expresion2:any){        
        this.linea = linea;
        this.columna = columna;        
        this.instrucciones = instrucciones;        
        this.declAsign = declAsign;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }

    traducir(ent: Entorno, arbol: AST) {
              


    }

    ejecutar(ent: Entorno, arbol: AST) {
        console.log('ejecutado...fornormal');
        const entornolocal:Entorno = new Entorno(ent);        
        this.declAsign.ejecutar(entornolocal,arbol);

        //expresion 1 es la que hay que validar 
        console.log("empezando el while  en for");

        
        
        while(this.expresion1.getValorImplicito(entornolocal,arbol) == true){
            
            //Realizar instrucciones
            this.instrucciones.forEach((element:Instruccion) => {
                element.ejecutar(entornolocal,arbol);
            });
            //Sumar o realizar la expresion2            
            //Primero se obtiene la operacion;            
            const valAsig = this.expresion2.getValorImplicito(entornolocal,arbol);
            //Luego se obtiene el id de la operacion y se asigna el valor de la operacion; 
            const id = this.expresion2.op_izquierda.getId();            
            if (entornolocal.existe(id)) {
                let simbol: Simbolo = entornolocal.getSimbolo(id);                
                simbol.valor = valAsig;
            }else{
                console.log('Error semantico, no existe la variable ' + id +'en la linea '+ this.linea + ' y columna ' + this.columna);
            }
                
            
        }  
        
    }
}