class Objeto{
    tipo:string;       
    listaObjetos: Array<Objeto>;
    linea: number;
    columna: number;

    constructor(tipo:string, linea:number, columna:number, listaO:Array<Objeto>){
        this.tipo = tipo;        
        this.linea = linea;
        this.columna = columna;        
        this.listaObjetos = listaO;        
    }
}