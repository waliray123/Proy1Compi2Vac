export class Error{
    linea:number;
    columna:number;
    tipoError:string;
    descripcion:string;
    ambito:string;
    
    constructor(tipoError:string,descripcion:string,linea:number, columna:number){
        this.tipoError = tipoError;
        this.descripcion = descripcion;
        this.linea = linea;
        this.columna = columna;
        this.ambito = 'global';
    }
    
}