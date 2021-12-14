import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Simbolo } from "../AST/Simbolo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";

export class If implements Instruccion {
    linea: number;
    columna: number;
    public instrucciones: Array<Instruccion>;
    public condicion: Expresion;
    public sinos: Array<If>;
    public tipo: string;


    constructor(linea: number, columna: number, condicion: Expresion, instrucciones: Array<Instruccion>, sinos: Array<If>, tipo: string) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.condicion = condicion;
        this.sinos = sinos;
        this.tipo = tipo;
    }

    traducir(ent: Entorno, arbol: AST) {
        console.log('traducir...ifnormal');
    }

    ejecutar(ent: Entorno, arbol: AST) {
        console.log('ejecutado...ifnormal');


        //Revisar la condicion del if
        if(this.tipo == "if" || this.tipo == "elseif"){
            if (this.condicion.getValorImplicito(ent, arbol) == true) {
                const entornolocal: Entorno = new Entorno(ent);

                this.instrucciones.forEach((element: Instruccion) => {
                    element.ejecutar(entornolocal, arbol);
                })
            } else {
                let seEncontro = false;
                for(let i = 0; i < this.sinos.length; i++){
                    let element = this.sinos[i];
                    if(element.tipo == "elseif"){
                        if(element.condicion.getValorImplicito(ent,arbol) == true){
                            //Se encontro un elseif que cumple con la condicion
                            const entornolocal: Entorno = new Entorno(ent);
                            element.ejecutar(entornolocal,arbol)
                            seEncontro = true;
                            break;
                        }    
                    }                    
                }
                if(seEncontro == false){
                    for(let i = 0; i < this.sinos.length; i++){
                        let element = this.sinos[i];
                        if(element.tipo == "else"){
                            //Se encontro un else  
                            const entornolocal: Entorno = new Entorno(ent);
                            element.ejecutar(entornolocal,arbol)
                            break;
                        }                    
                    }
                }
            }
        }else{
            const entornolocal: Entorno = new Entorno(ent);

            this.instrucciones.forEach((element: Instruccion) => {
                    element.ejecutar(entornolocal, arbol);
            });
        }
    }
}