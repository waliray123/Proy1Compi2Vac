import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Simbolo } from "../AST/Simbolo";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";

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

    traducir(ent: Entorno, arbol: AST,resultado3D:Resultado3D,temporales:Temporales,listaErrores:Array<ErrorG>) {
        const entornolocal:Entorno = new Entorno(ent);        

        if(temporales.ultLiteral == 0){
            resultado3D.codigo3D += '\tL'+temporales.ultLiteral + ":\n";    
            temporales.ultLitEscr = 0;
        }         
        
        this.declAsign.traducir(entornolocal,arbol,resultado3D,temporales);

        temporales.ultLiteral += 3; //Cuantos literales va a utilizar        
        let ulLit = temporales.ultLiteral-2;
        resultado3D.codigo3D += '\tL'+(ulLit)+':\n';

        let valAsign = this.expresion1.traducir(entornolocal,arbol,resultado3D,temporales,0); 

        resultado3D.codigo3D += '\tif('+valAsign+') goto L'+(ulLit+1)+';\n';
        resultado3D.codigo3D += '\tgoto L'+(ulLit+2)+';\n';
        resultado3D.codigo3D += '\tL'+(ulLit+1)+':\n';
        //Traducir instrucciones
        this.instrucciones.forEach((element:Instruccion) => {
            element.traducir(entornolocal,arbol,resultado3D,temporales,listaErrores);
        });
        //Traducir el incremento o decremento
        const id = this.expresion2.op_izquierda.getId();      

        if (entornolocal.existe(id)) {
            let simbol: Simbolo = entornolocal.getSimbolo(id);                
            resultado3D.codigo3D += '\tt'+temporales.ultimoTemp+'= '+'stack[(int)'+simbol.valor+']'+';\n';
            temporales.ultimoTemp += 1;
            resultado3D.codigo3D += '\tt'+(temporales.ultimoTemp-1)+'= '+'t'+(temporales.ultimoTemp-1)+' + 1;\n';
            resultado3D.codigo3D += '\tstack[(int)'+simbol.valor+'] = t'+ (temporales.ultimoTemp-1)  +';\n';
            simbol.valor;
        }else{
            console.log('Error semantico, no existe la variable ' + id +'en la linea '+ this.linea + ' y columna ' + this.columna);
        }

        //Traducir el regreso
        resultado3D.codigo3D += '\tgoto L'+(ulLit)+';\n';

        resultado3D.codigo3D += '\tL'+(ulLit+2)+':\n';
        temporales.ultLitEscr = ulLit+2;



    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        console.log('ejecutado...fornormal');
        const entornolocal:Entorno = new Entorno(ent);        
        this.declAsign.ejecutar(entornolocal,arbol);

        //expresion 1 es la que hay que validar 
        console.log("empezando el while  en for");

        
        let realizar = true;
        while(this.expresion1.getValorImplicito(entornolocal,arbol,listaErrores) == true){
            
            //Realizar instrucciones
            for(let element of this.instrucciones){
                let valR = element.ejecutar(entornolocal,arbol,listaErrores);            
                if(valR == 'RETORNAR'){                
                    ent.valorReturn = entornolocal.valorReturn;       
                    return 'RETORNAR';       
                }else if(valR == 'ROMPER'){
                    return;
                }else if(valR == 'CONTINUAR'){
                    break;
                }
            }           
            //Sumar o realizar la expresion2            
            //Primero se obtiene la operacion;            
            const valAsig = this.expresion2.getValorImplicito(entornolocal,arbol);
            //Luego se obtiene el id de la operacion y se asigna el valor de la operacion; 
            const id = this.expresion2.op_izquierda.getId();            
            if (entornolocal.existe(id)) {
                let simbol: Simbolo = entornolocal.getSimbolo(id);                
                simbol.valor = valAsig;
            }else{
                // console.log('Error semantico, no existe la variable ' + id +'en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG('semantico','no existe la variable ' + id,this.linea,this.columna));
            }
                
            
        }  
        
    }
}