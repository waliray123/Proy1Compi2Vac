export class ErrorG{
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
    
    mostrarErrorConsola(){
        let resultado =  '\nError '+ this.tipoError + ', '+ this.descripcion + ' -> linea '+ this.linea + ' y columna ' + this.columna;
        return resultado;
    }
}