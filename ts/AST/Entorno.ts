import { Simbolo } from "./Simbolo";
import { Tipo } from "./Tipo";


export class Entorno{
    private anterior:Entorno;
    private tabla:{[id:string] : Simbolo};
    public  valorReturn:any;

    constructor(anterior:any){
        this.tabla = {};
        this.anterior = anterior;
        this.valorReturn = null;
    }

    agregar(id:string, simbolo:Simbolo){
        id = id;
        simbolo.indentificador = simbolo.indentificador;
        this.tabla[id] = simbolo;
    }

    eliminar(id:string):boolean{
        id = id;
        for (let e:Entorno = this; e != null; e = e.anterior)
        {   
            const value = e.tabla[id]
            if (value!==undefined)
            {
                delete e.tabla[id];
                return true;
            }
        }
        return false;
    }

    existe(id:string):boolean{
        id = id;
        for (let e:Entorno = this; e != null; e = e.anterior)
        {
            const value = e.tabla[id]
            if (value!==undefined)
            {
                return true;
            }
        }
        return false;
    }

    existeEnActual(id:string):boolean{
        id = id;
        if (this.tabla[id]!==undefined)
        {
            return true;
        }
        return false;
    }

    getSimbolo(id:string):any{
        id = id;
        for (let e:Entorno = this; e != null; e = e.anterior)
        {
            if (e.tabla[id]!==undefined)
            {
                return e.tabla[id];
            }
        }
        return null;
    }

    reemplazar(id:string, nuevoValor:Simbolo){
        id = id;
        for (let e:Entorno = this; e != null; e = e.anterior)
        {
            const value = e.tabla[id]
            if (value!==undefined)
            {
                e.tabla[id] = nuevoValor;
            }
        }
    }

    getNameTipo(tipo:Tipo){
        if (tipo == Tipo.STRING) {
            return "string";
        }else if (tipo == Tipo.BOOL){
            return 'boolean';
        }else if (tipo == Tipo.INT){
            return 'int';
        }else if (tipo == Tipo.CHAR){
            return 'char';
        }else if (tipo == Tipo.DOUBLE) {
            return 'double';
        }else if (tipo == Tipo.VOID){
            return 'void';
        }else if (tipo == Tipo.STRUCT){
            return 'struct';
        }else if (tipo == Tipo.ARRAY){
            return 'array';
        }else if (tipo == Tipo.TIPO_STRUCT){
            return 'struct'
        }
        else{
            return 'null';
        }
    }

}