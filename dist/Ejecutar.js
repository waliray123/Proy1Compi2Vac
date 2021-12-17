"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AST_1 = require("./AST/AST");
var Entorno_1 = require("./AST/Entorno");
var Resultado3D_1 = require("./AST/Resultado3D");
var Temporales_1 = require("./AST/Temporales");
var gramatica = require('../jison/Gramatica');
window.ejecutarCodigo = function (entrada) {
    //Reiniciar consola
    reiniciarConsola();
    //traigo todas las raices    
    //declaro los array's
    var array = [];
    var listaErrores = [];
    var instrucciones = [];
    array = gramatica.parse(entrada); //parseamos la gramatica
    //console.log(array);
    //llenamos los array's'
    array.forEach(function (element) {
        if (element.id == 'instrucciones') {
            instrucciones = element.cont;
        }
        else if (element.id == 'listaErrores') {
            listaErrores = element.cont;
        }
    });
    // console.log(listaErrores);
    // console.log(instrucciones);
    if (listaErrores.length > 0) {
        console.log(listaErrores);
        var areaConsola = document.getElementById('consola');
        areaConsola.value = "Hay errores, revise la lista";
    }
    else {
        //Obtengo las funciones y strucs globales y se los asigno al ast
        var funcionesG = revisarFuncionesGlobales(instrucciones);
        var structsG = revisarStructsGlobales(instrucciones);
        var ast_1 = new AST_1.AST(instrucciones, structsG, funcionesG);
        var entornoGlobal_1 = generarEntornoGlobal(ast_1, structsG);
        console.log(entornoGlobal_1);
        //Buscar la funcion main    
        funcionesG.forEach(function (element) {
            if (element.nombrefuncion == "main") {
                console.log("Se ejecutara");
                element.ejecutar(entornoGlobal_1, ast_1);
            }
        });
    }
};
window.traducirCodigo = function (entrada) {
    reiniciarTraduccion();
    var resultado3d = new Resultado3D_1.Resultado3D();
    var temporales = new Temporales_1.Temporales();
    //traigo todas las raices    
    //declaro los array's
    var array = [];
    var listaErrores = [];
    var instrucciones = [];
    array = gramatica.parse(entrada); //parseamos la gramatica
    //console.log(array);
    //llenamos los array's'
    array.forEach(function (element) {
        if (element.id == 'instrucciones') {
            instrucciones = element.cont;
        }
        else if (element.id == 'listaErrores') {
            listaErrores = element.cont;
        }
    });
    if (listaErrores.length > 0) {
        console.log(listaErrores);
        var areaConsola = document.getElementById('consola');
        areaConsola.value = "Hay errores y no se puede traducir, revise la lista";
    }
    else {
        //Obtengo las funciones y strucs globales y se los asigno al ast
        var funcionesG = revisarFuncionesGlobales(instrucciones);
        var structsG = revisarStructsGlobales(instrucciones);
        var ast_2 = new AST_1.AST(instrucciones, structsG, funcionesG);
        var entornoGlobal_2 = generarEntornoGlobalTraducir(ast_2, structsG, resultado3d, temporales);
        //Buscar la funcion main    
        funcionesG.forEach(function (element) {
            if (element.nombrefuncion == "main") {
                console.log("Se ejecutara");
                element.traducir(entornoGlobal_2, ast_2, resultado3d, temporales);
            }
        });
        traducirCompleto(resultado3d, temporales);
    }
};
function reiniciarConsola() {
    var areaConsola = document.getElementById('consola');
    areaConsola.value = "";
}
function reiniciarTraduccion() {
    var areaTraduccion = document.getElementById('traduccion');
    areaTraduccion.value = "";
}
function revisarFuncionesGlobales(instrucciones) {
    var funciones = Array();
    instrucciones.forEach(function (element) {
        if (element.getTipo() == "funcion") {
            funciones.push(element);
        }
    });
    return funciones;
}
function revisarStructsGlobales(instrucciones) {
    var structs = Array();
    instrucciones.forEach(function (element) {
        if (element.getTipo() == "struct") {
            structs.push(element);
        }
    });
    return structs;
}
function generarEntornoGlobal(ast, structs) {
    var entornoGlobal = new Entorno_1.Entorno(null);
    var instrucciones = ast.instrucciones;
    var declaracionesG = Array();
    instrucciones.forEach(function (element) {
        if (element.getTipo() == "declaracion") {
            declaracionesG.push(element);
        }
    });
    declaracionesG.forEach(function (element) {
        element.ejecutar(entornoGlobal, ast);
    });
    structs.forEach(function (element) {
        element.ejecutar(entornoGlobal, ast);
    });
    return entornoGlobal;
}
function generarEntornoGlobalTraducir(ast, structs, resultado3D, temporales) {
    var entornoGlobal = new Entorno_1.Entorno(null);
    var instrucciones = ast.instrucciones;
    var declaracionesG = Array();
    instrucciones.forEach(function (element) {
        if (element.getTipo() == "declaracion") {
            declaracionesG.push(element);
        }
    });
    declaracionesG.forEach(function (element) {
        element.traducir(entornoGlobal, ast, resultado3D, temporales);
    });
    structs.forEach(function (element) {
        element.traducir(entornoGlobal, ast, resultado3D, temporales);
    });
    return entornoGlobal;
}
function traducirCompleto(resultado3D, temporales) {
    //Traer el codigo en 3D    
    //Ingresar encabezado
    var encabezado = '#include <stdio.h> \n#include <math.h> \ndouble heap[30101999]; \ndouble stack[30101999]; \ndouble P; \ndouble H;\n';
    //Inicializar todos los temporales
    var codTemporales = '';
    for (var i = 0; i < temporales.ultimoTemp; i++) {
        if (i == 0) {
            codTemporales += 'double t' + i;
        }
        else {
            codTemporales += ',t' + i;
        }
        if (i == (temporales.ultimoTemp - 1)) {
            codTemporales += ';\n';
        }
    }
    encabezado += codTemporales;
    //Generar las funciones nativas
    //Generar el proceso main
    var procMain = '\nvoid main() { \n\tP = 0; \n\tH = 0;\n';
    //Agregar el resultado 3D en el main
    procMain += resultado3D.codigo3D;
    //Cerrar     
    procMain += '\n\treturn; \n }';
    //Mostrar en el text area
    var resultado = encabezado + procMain;
    var areaTraduccion = document.getElementById('traduccion');
    areaTraduccion.value = resultado;
}
