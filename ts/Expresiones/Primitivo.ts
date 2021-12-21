import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { ErrorG } from "../Objetos/ErrorG";

export class Primitivo implements Expresion {
    linea: number;
    columna: number;
    public valor: any;
    public isFlotante:boolean;

    constructor(valor:any, linea:number, columna:number){
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
        this.isFlotante = false;
    }
    
    traducir(ent: Entorno, arbol: AST,resultado3d:Resultado3D,temporales:Temporales) {
        console.log("Traduciendo Primitivo");
        
        let tipo = this.getTipo(ent,arbol,[]);
        temporales.ultimoTipo = tipo;
        if(tipo == Tipo.STRING){            
            temporales.ultimoTemp += 1;
            resultado3d.codigo3D += '\tt'+temporales.ultimoTemp + '= H;\n';

            
            for(let i = 0; i < this.valor.length ;i++){
                let letra = this.valor.substr(i,1);
                let valLet = letra.charCodeAt();
                resultado3d.codigo3D += '\theap[(int)H] = '+valLet+';\n'; 
                resultado3d.codigo3D += '\tH = H + 1;\n';
                console.log(valLet);
            }
            resultado3d.codigo3D += '\theap[(int)H] = -1;\n'; 
            resultado3d.codigo3D += '\tH = H + 1;\n';
            return 't'+temporales.ultimoTemp;            
        }else if(tipo == Tipo.BOOL){            
            if(this.valor == true){
                return 1;
            }else{
                return 0;
            }            
        }else{
            return this.valor;
        }
        
    }

    getTipo(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>): Tipo {
        const valor = this.getValorImplicito(ent, arbol,listaErrores);
        if (typeof(valor) === 'boolean')
        {
            return Tipo.BOOL;
        }
        else if (typeof(valor) === 'string')
        {
            return Tipo.STRING;
        }
        else if (typeof(valor) === 'number')
        {
            if (this.isFlotante) {
                return Tipo.DOUBLE;
            }
            if(this.isInt(Number(valor))){
                return Tipo.INT;
            }
           return Tipo.DOUBLE;
        }
        else if(valor === null){
            return Tipo.NULL;
        }
            
        return Tipo.VOID;
    }

    getValorImplicito(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        return this.valor;
    }

    isInt(n:number){
        return Number(n) === n && n % 1 === 0;
    }
    
}