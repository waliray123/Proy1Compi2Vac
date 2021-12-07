class ErrorCom {
    tipo: string;
    linea: string;
    columna: string;
    descripcion: string;
    ambito: string;
    constructor(tipoc: string,lineac: string,columnac: string,descripcionc: string,ambitoc: string) {
        this.tipo = tipoc;
        this.linea = lineac;
        this.columna = columnac;
        this.descripcion = descripcionc;
        this.ambito = ambitoc;
    }
}