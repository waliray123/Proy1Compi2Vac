import { AST } from "./AST/AST";
import { Entorno } from "./AST/Entorno";
import { Instruccion } from "./Interfaces/Instruccion";

const gramatica = require('../jison/Gramatica');

declare global {
    interface Window { ejecutarCodigo: any; }
}

window.ejecutarCodigo = function (entrada:string){
    //Reiniciar consola
    reiniciarConsola();
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

function reiniciarConsola(){
    const areaConsola = document.getElementById('consola') as HTMLTextAreaElement;
    areaConsola.value = "";
}

// ejecutarCodigo(`int id12;
// int var2;`)