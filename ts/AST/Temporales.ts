

export class Temporales{
            
    public ultimoTemp:number;
    public ultstack:number;
    public ultheap:number;
    public ultLiteral:number;
    public ultLitEscr:number;
    public usoConcatStrings:boolean;
    public usoPrintStrings:boolean;
    

    constructor(){
        this.ultimoTemp = 0;
        this.ultstack = 0;
        this.ultheap = 0;
        this.ultLiteral = 0;
        this.ultLitEscr = 0;
        this.usoConcatStrings = false;
        this.usoPrintStrings = false;
    }        

}