import { Expresion } from "../Interfaces/Expresion";
import { AST } from "./AST";
import { Entorno } from "./Entorno";
import { Tipo } from "./Tipo";

export class Simbolo implements Expresion {
    public indentificador: string;
    public valor: any;
    private tipo: Tipo;
    public tipoStruct:string;
    linea: number;
    columna: number;

    constructor(tipo:Tipo, id:string, linea:number, columna:number, valor:any){
        this.indentificador = id;
        this.linea = linea;
        this.columna = columna;
        this.tipo = tipo;
        this.valor = valor;
        this.tipoStruct = '';
    }
    
    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        return this.tipo;
    }
    getValorImplicito(ent: Entorno, arbol: AST) {
        return this.valor;
    }
    getTipoStruct(ent: Entorno, arbol: AST){
        if (this.tipo == Tipo.TIPO_STRUCT) {
            return this.tipoStruct;
        }else{
            return null;
        }
    }
    setTipoStruct(tipo:string){
        this.tipoStruct = tipo;
    }
    
}
