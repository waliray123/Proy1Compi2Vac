import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { ErrorG } from "../Objetos/ErrorG";

export class ConcatenarTraduccion{
    public valAsign:any;
    public tipo:Tipo;

    constructor(valAsign:any, tipo:Tipo){
        this.valAsign = valAsign;
        this.tipo = tipo;
    }
}

export class ConcatenacionString implements Expresion {

    expresiones:Array<Expresion>
    linea: number;
    columna: number;

    constructor(expresiones:Array<Expresion>, linea:number, columna:number){
        this.expresiones = expresiones;
        this.linea = linea;
        this.columna = columna;
    }

    getTipo(ent: Entorno, arbol: AST, listaErrores: ErrorG[]): Tipo {
        return Tipo.STRING;
    }
    getValorImplicito(ent: Entorno, arbol: AST, listaErrores: ErrorG[]) {
        let valorCompleto = '';
        this.expresiones.forEach((expresion:Expresion) => {
            valorCompleto += expresion.getValorImplicito(ent,arbol,listaErrores);
        });
        return valorCompleto;
    }
    traducir(ent: Entorno, arbol: AST, resultado3d: Resultado3D, temporales: Temporales, recursivo: number) {

        let temps:Array<ConcatenarTraduccion> = [];
        this.expresiones.forEach((expresion:Expresion) => {
            let valAsign = expresion.traducir(ent,arbol,resultado3d,temporales,recursivo);
            let tipo = temporales.ultimoTipo;
            temps.push(new ConcatenarTraduccion(valAsign,tipo));
        });
        return temps;
    }
    
    isInt(n: number) {
        return Number(n) === n && n % 1 === 0;
    }
}