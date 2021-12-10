import { AST } from "./AST/AST";
import { Entorno } from "./AST/Entorno";
import { Instruccion } from "./Interfaces/Instruccion";

const gramatica = require('../jison/Gramatica');

declare global {
    interface Window { ejecutarCodigo: any; }
}

window.ejecutarCodigo = function (entrada:string){
    //traigo todas las raices
    const instrucciones = gramatica.parse(entrada);
    console.log(instrucciones);
    // /*
    const ast:AST = new AST(instrucciones);
    const entornoGlobal:Entorno = new Entorno(null);
    //recorro todas las raices  RECURSIVA
    instrucciones.forEach((element:Instruccion) => {
        element.ejecutar(entornoGlobal,ast);
    })
    // */
}

// ejecutarCodigo(`int id12;
// int var2;`)