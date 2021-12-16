
export class Temporal{
    
    public nombre:String;
    public utilizado:boolean;    
    

    constructor(nombre:string){
        this.nombre = nombre;
        this.utilizado = false;
    }
    
    utilizar(){
        this.utilizado = true;
    }
    
    



}