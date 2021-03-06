import { AST } from "./AST/AST";
import { Entorno } from "./AST/Entorno";
import { Instruccion } from "./Interfaces/Instruccion";
import { Funcion } from "./Instrucciones/Funcion";
import { Struct } from "./Instrucciones/Struct";
import { Declaracion } from "./Instrucciones/Declaracion";
import { Resultado3D } from "./AST/Resultado3D";
import { Temporales } from "./AST/Temporales";
import { ErrorG } from "./Objetos/ErrorG";
import { GenerarNativas } from "./AST/GenerarNativas";
import { FuncionesReportes } from "./Objetos/FuncionesReportes";

const gramatica = require('../jison/Gramatica');
let listaErroresGlobal:Array<ErrorG> = [];

declare global {
    interface Window { ejecutarCodigo: any; }
    interface Window { traducirCodigo: any; }
    interface Window { reporteError: any; }
}

window.ejecutarCodigo = function (entrada:string){
    //Reiniciar consola
    reiniciarConsola();
    limpiarTablaSimbolos();
    //traigo todas las raices    

    //declaro los array's
    let array: {'id':String,'cont':any}[] = []; 
    let listaErrores:ErrorG[] = [];
    let instrucciones:any = [];

    array = gramatica.parse(entrada); //parseamos la gramatica
    //console.log(array);

    //llenamos los array's'
    array.forEach((element)=>{
        if (element.id == 'instrucciones') {
            instrucciones = element.cont;
        }else if(element.id == 'listaErrores'){
            listaErrores = element.cont;
        }
    })

    // console.log(listaErrores);
    // console.log(instrucciones);
    if (listaErrores.length > 0) {
        //console.log(listaErrores);
        const areaConsola = document.getElementById('consola') as HTMLTextAreaElement;
        listaErrores.forEach((err:ErrorG)=>{
            areaConsola.value += err.mostrarErrorConsola();
        });
    }else{
        //Obtengo las funciones y strucs globales y se los asigno al ast
        let funcionesG = revisarFuncionesGlobales(instrucciones);
        let structsG = revisarStructsGlobales(instrucciones);


        const ast:AST = new AST(instrucciones,structsG,funcionesG);
        const entornoGlobal:Entorno = generarEntornoGlobal(ast,structsG,listaErrores);   
        // console.log(entornoGlobal); 
        
        //Buscar la funcion main    

        funcionesG.forEach((element:Funcion) => {
            if(element.nombrefuncion == "main"){
                // console.log("Se ejecutara");
                element.ejecutar(entornoGlobal,ast,listaErrores);
                
            }
        })
    }
    //mostrar los errores semanticos
    if (listaErrores.length > 0) {
        const areaConsola = document.getElementById('consola') as HTMLTextAreaElement;
        listaErrores.forEach((err:ErrorG)=>{
            areaConsola.value += err.mostrarErrorConsola();
        });
    }
    listaErroresGlobal = listaErrores;
    
}

window.traducirCodigo = function (entrada:string){
    reiniciarConsola();
    reiniciarTraduccion();

    let resultado3d = new Resultado3D();
    let temporales = new Temporales();
    //traigo todas las raices    

    //declaro los array's
    let array: {'id':String,'cont':any}[] = []; 
    let listaErrores:ErrorG[] = [];
    let instrucciones:any = [];

    array = gramatica.parse(entrada); //parseamos la gramatica
    //console.log(array);

    //llenamos los array's'
    array.forEach((element)=>{
        if (element.id == 'instrucciones') {
            instrucciones = element.cont;
        }else if(element.id == 'listaErrores'){
            listaErrores = element.cont;
        }
    })
    
    if (listaErrores.length > 0) {
        const areaConsola = document.getElementById('consola') as HTMLTextAreaElement;
        listaErrores.forEach((err:ErrorG)=>{
            areaConsola.value += err.mostrarErrorConsola();
        });
    }else{
        //Obtengo las funciones y strucs globales y se los asigno al ast
        let funcionesG = revisarFuncionesGlobales(instrucciones);
        let structsG = revisarStructsGlobales(instrucciones);


        const ast:AST = new AST(instrucciones,structsG,funcionesG);
        const entornoGlobal:Entorno = generarEntornoGlobalTraducir(ast,structsG,resultado3d,temporales,listaErrores);       
        
        //Buscar la funcion main    

        funcionesG.forEach((element:Funcion) => {
            if(element.nombrefuncion == "main"){
                // console.log("Se ejecutara");
                element.traducir(entornoGlobal,ast,resultado3d,temporales,listaErrores);            
            }
        })

        traducirCompleto(entornoGlobal,resultado3d,temporales,ast,listaErrores);
    }

    //mostrar los errores semanticos
    if (listaErrores.length > 0) {
        const areaConsola = document.getElementById('consola') as HTMLTextAreaElement;
        listaErrores.forEach((err:ErrorG)=>{
            areaConsola.value += err.mostrarErrorConsola();
        });
    }
    listaErroresGlobal = listaErrores;
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


function generarEntornoGlobal(ast:AST,structs:Array<Struct>,listaErrores:Array<ErrorG>){
    const entornoGlobal:Entorno = new Entorno(null);
    let instrucciones = ast.instrucciones;
    let declaracionesG = Array<Declaracion>();
    instrucciones.forEach((element:any) => {
        if(element.getTipo()=="declaracion"){            
            declaracionesG.push(element);
        }
    });

    structs.forEach((element:Instruccion)=>{
        element.ejecutar(entornoGlobal, ast,listaErrores);
    })

    declaracionesG.forEach((element:Declaracion) => {
        element.ejecutar(entornoGlobal, ast,listaErrores);
    });   

    return entornoGlobal;
}

function generarEntornoGlobalTraducir(ast:AST,structs:Array<Struct>,resultado3D:Resultado3D,temporales:Temporales,listaErrores:Array<ErrorG>){
    const entornoGlobal:Entorno = new Entorno(null);
    let instrucciones = ast.instrucciones;
    let declaracionesG = Array<Declaracion>();
    instrucciones.forEach((element:any) => {
        if(element.getTipo()=="declaracion"){            
            declaracionesG.push(element);
        }
    });

    structs.forEach((element:Instruccion)=>{
        element.traducir(entornoGlobal, ast,resultado3D,temporales,listaErrores);
    })

    declaracionesG.forEach((element:Declaracion) => {
        element.traducir(entornoGlobal, ast,resultado3D,temporales,listaErrores);
    });   

    return entornoGlobal;
}


function traducirCompleto(ent:Entorno,resultado3D:Resultado3D,temporales:Temporales,arbol:AST,listaErrores:Array<ErrorG>){

    //Traer el codigo en 3D    

    //Ingresar encabezado

    let encabezado = '#include <stdio.h> \n#include <math.h> \ndouble heap[30101999]; \ndouble stack[30101999]; \ndouble P; \ndouble H;\n';
    
    

    //Generar las funciones nativas
    let generador =  new GenerarNativas();
    //Generar funciones 
    let codFunc = generador.generarFunciones(ent,arbol,temporales,listaErrores);
    //Generar Nativas
    let nativas = generador.generar(temporales);

    

    //Inicializar todos los temporales
    let codTemporales = '';
    for(let i = 0; i <= temporales.ultimoTemp;i++){
        if(i == 0){
            codTemporales += 'double t'+i;
        }else{
            codTemporales += ',t'+i;
        }
        
        if(i == (temporales.ultimoTemp)){
            codTemporales +=';\n';
        }
    }

    encabezado += codTemporales;    

    //Generar el proceso main

    let procMain = '\nvoid main() { \n\tP = 0; \n\tH = 0;\n';

    //Agregar el resultado 3D en el main

    procMain += resultado3D.codigo3D;

    //Cerrar     

    procMain += '\n\treturn; \n }';

    //Mostrar en el text area

    let resultado = encabezado + nativas+ codFunc + procMain;

    const areaTraduccion = document.getElementById('traduccion') as HTMLTextAreaElement;
    areaTraduccion.value = resultado;

}

function limpiarTablaSimbolos(){
    const tablaSimbolos = document.getElementById('tabla-simbolos') as HTMLTableElement;
    tablaSimbolos.innerHTML = "";
    let valorfila = '<th>Funcion o variable</th><th>Id</th><th>Tipo</th><th>Linea</th><th>Columna</th><th>Posicion</th><th>Entorno</th><th>Valor</th>';
    tablaSimbolos.insertRow(-1).innerHTML = valorfila;
}

window.reporteError = function(isActive:boolean){
    const areaError = document.getElementById('listaErrores') as HTMLDivElement;
    let funReport:FuncionesReportes = new FuncionesReportes();
    if (isActive) {
        areaError.innerHTML = '';
    }else{
        areaError.innerHTML = funReport.generarTablaError(listaErroresGlobal);
    }
}