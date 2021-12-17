import { AST } from "./AST/AST";
import { Entorno } from "./AST/Entorno";
import { Instruccion } from "./Interfaces/Instruccion";
import { Funcion } from "./Instrucciones/Funcion";
import { Struct } from "./Instrucciones/Struct";
import { Declaracion } from "./Instrucciones/Declaracion";
import { Resultado3D } from "./AST/Resultado3D";
import { Temporales } from "./AST/Temporales";

const gramatica = require('../jison/Gramatica');

declare global {
    interface Window { ejecutarCodigo: any; }
    interface Window { traducirCodigo: any; }
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

window.traducirCodigo = function (entrada:string){

    reiniciarTraduccion();

    let resultado3d = new Resultado3D();
    let temporales = new Temporales();
    //traigo todas las raices    
    const instrucciones = gramatica.parse(entrada);
    console.log(instrucciones);
    
    //Obtengo las funciones y strucs globales y se los asigno al ast
    let funcionesG = revisarFuncionesGlobales(instrucciones);
    let structsG = revisarStructsGlobales(instrucciones);


    const ast:AST = new AST(instrucciones,structsG,funcionesG);
    const entornoGlobal:Entorno = generarEntornoGlobalTraducir(ast,structsG,resultado3d,temporales);       
    
    //Buscar la funcion main    

    funcionesG.forEach((element:Funcion) => {
        if(element.nombrefuncion == "main"){
            console.log("Se ejecutara");
            element.traducir(entornoGlobal,ast,resultado3d,temporales);            
        }
    })

    traducirCompleto(resultado3d,temporales);

}

function reiniciarConsola(){
    const areaConsola = document.getElementById('consola') as HTMLTextAreaElement;
    areaConsola.value = "";
}

function reiniciarTraduccion(){
    const areaTraduccion = document.getElementById('traduccion') as HTMLTextAreaElement;
    areaTraduccion.value = "";
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

function generarEntornoGlobalTraducir(ast:AST,structs:Array<Struct>,resultado3D:Resultado3D,temporales:Temporales){
    const entornoGlobal:Entorno = new Entorno(null);
    let instrucciones = ast.instrucciones;
    let declaracionesG = Array<Declaracion>();
    instrucciones.forEach((element:any) => {
        if(element.getTipo()=="declaracion"){            
            declaracionesG.push(element);
        }
    });

    declaracionesG.forEach((element:Declaracion) => {
        element.traducir(entornoGlobal, ast,resultado3D,temporales);
    });

    structs.forEach((element:Instruccion)=>{
        element.traducir(entornoGlobal, ast,resultado3D,temporales);
    })

    return entornoGlobal;
}


function traducirCompleto(resultado3D:Resultado3D,temporales:Temporales){

    //Traer el codigo en 3D    

    //Ingresar encabezado

    let encabezado = '#include <stdio.h> \n#include <math.h> \ndouble heap[30101999]; \ndouble stack[30101999]; \ndouble P; \ndouble H;\n';
    
    //Inicializar todos los temporales

    let codTemporales = '';
    for(let i = 0; i < temporales.ultimoTemp;i++){
        if(i == 0){
            codTemporales += 'double t'+i;
        }else{
            codTemporales += ',t'+i;
        }
        
        if(i == (temporales.ultimoTemp-1)){
            codTemporales +=';\n';
        }
    }

    encabezado += codTemporales;

    //Generar las funciones nativas

    //Generar el proceso main

    let procMain = '\nvoid main() { \n\tP = 0; \n\tH = 0;\n';

    //Agregar el resultado 3D en el main

    procMain += resultado3D.codigo3D;

    //Cerrar     

    procMain += '\n\treturn; \n }';

    //Mostrar en el text area

    let resultado = encabezado + procMain

    const areaTraduccion = document.getElementById('traduccion') as HTMLTextAreaElement;
    areaTraduccion.value = resultado;

}