
import { Temporal } from "./Temporal";

export class Resultado3D{
    
    public codigo3D:string;
    public temporal:Temporal | undefined;    
    

    constructor(){
        this.codigo3D = "";        
    }
    
    setTemporal(temporal:Temporal){
        this.temporal = temporal;
    }    

    

}