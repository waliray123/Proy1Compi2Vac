import { AST } from "./AST/AST";
import { Entorno } from "./AST/Entorno";
import { Instruccion } from "./Interfaces/Instruccion";
import { Funcion } from "./Instrucciones/Funcion";
import { Struct } from "./Instrucciones/Struct";
import { Declaracion } from "./Instrucciones/Declaracion";

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
    
    //Obtengo las funciones y strucs globales y se los asigno al ast
    let funcionesG = revisarFuncionesGlobales(instrucciones);
    let structsG = revisarStructsGlobales(instrucciones);


    const ast:AST = new AST(instrucciones,structsG,funcionesG);
    const entornoGlobal:Entorno = generarEntornoGlobal(ast,structsG);   
    console.log(entornoGlobal); 
    
    //Buscar la funcion main    

    funcionesG.forEach((element:Funcion) => {
        if(element.nombrefuncion == "main"){
            console.log("Se ejecutara");
            element.ejecutar(entornoGlobal,ast);
            
        }
    })
}

function reiniciarConsola(){
    const areaConsola = document.getElementById('consola') as HTMLTextAreaElement;
    areaConsola.value = "";
}

function revisarFuncionesGlobales(instrucciones:Array<Instruccion>){
    let funciones = Array<Funcion>();
    instrucciones.forEach((element:any) => {        
        if(element.getTipo()=="funcion"){            
            funciones.push(element);
        }
    });
    return funciones;    
}

function revisarStructsGlobales(instrucciones:Array<any>){
    let structs = Array<Struct>();
    instrucciones.forEach((element:any) => {
        if(element.getTipo()=="struct"){            
            structs.push(element);
        }
    });
    return structs;    
}


function generarEntornoGlobal(ast:AST,structs:Array<Struct>){
    const entornoGlobal:Entorno = new Entorno(null);
    let instrucciones = ast.instrucciones;
    let declaracionesG = Array<Declaracion>();
    instrucciones.forEach((element:any) => {
        if(element.getTipo()=="declaracion"){            
            declaracionesG.push(element);
        }
    });

    declaracionesG.forEach((element:Declaracion) => {
        element.ejecutar(entornoGlobal, ast);
    });

    structs.forEach((element:Instruccion)=>{
        element.ejecutar(entornoGlobal, ast);
    })

    return entornoGlobal;
}
// ejecutarCodigo(`int id12;
// int var2;`)