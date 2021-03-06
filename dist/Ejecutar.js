"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AST_1 = require("./AST/AST");
var Entorno_1 = require("./AST/Entorno");
var Resultado3D_1 = require("./AST/Resultado3D");
var Temporales_1 = require("./AST/Temporales");
var GenerarNativas_1 = require("./AST/GenerarNativas");
var FuncionesReportes_1 = require("./Objetos/FuncionesReportes");
var gramatica = require('../jison/Gramatica');
var listaErroresGlobal = [];
window.ejecutarCodigo = function (entrada) {
    //Reiniciar consola
    reiniciarConsola();
    limpiarTablaSimbolos();
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
        //console.log(listaErrores);
        var areaConsola_1 = document.getElementById('consola');
        listaErrores.forEach(function (err) {
            areaConsola_1.value += err.mostrarErrorConsola();
        });
    }
    else {
        //Obtengo las funciones y strucs globales y se los asigno al ast
        var funcionesG = revisarFuncionesGlobales(instrucciones);
        var structsG = revisarStructsGlobales(instrucciones);
        var ast_1 = new AST_1.AST(instrucciones, structsG, funcionesG);
        var entornoGlobal_1 = generarEntornoGlobal(ast_1, structsG, listaErrores);
        // console.log(entornoGlobal); 
        //Buscar la funcion main    
        funcionesG.forEach(function (element) {
            if (element.nombrefuncion == "main") {
                // console.log("Se ejecutara");
                element.ejecutar(entornoGlobal_1, ast_1, listaErrores);
            }
        });
    }
    //mostrar los errores semanticos
    if (listaErrores.length > 0) {
        var areaConsola_2 = document.getElementById('consola');
        listaErrores.forEach(function (err) {
            areaConsola_2.value += err.mostrarErrorConsola();
        });
    }
    listaErroresGlobal = listaErrores;
};
window.traducirCodigo = function (entrada) {
    reiniciarConsola();
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
        var areaConsola_3 = document.getElementById('consola');
        listaErrores.forEach(function (err) {
            areaConsola_3.value += err.mostrarErrorConsola();
        });
    }
    else {
        //Obtengo las funciones y strucs globales y se los asigno al ast
        var funcionesG = revisarFuncionesGlobales(instrucciones);
        var structsG = revisarStructsGlobales(instrucciones);
        var ast_2 = new AST_1.AST(instrucciones, structsG, funcionesG);
        var entornoGlobal_2 = generarEntornoGlobalTraducir(ast_2, structsG, resultado3d, temporales, listaErrores);
        //Buscar la funcion main    
        funcionesG.forEach(function (element) {
            if (element.nombrefuncion == "main") {
                // console.log("Se ejecutara");
                element.traducir(entornoGlobal_2, ast_2, resultado3d, temporales, listaErrores);
            }
        });
        traducirCompleto(entornoGlobal_2, resultado3d, temporales, ast_2, listaErrores);
    }
    //mostrar los errores semanticos
    if (listaErrores.length > 0) {
        var areaConsola_4 = document.getElementById('consola');
        listaErrores.forEach(function (err) {
            areaConsola_4.value += err.mostrarErrorConsola();
        });
    }
    listaErroresGlobal = listaErrores;
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
function generarEntornoGlobal(ast, structs, listaErrores) {
    var entornoGlobal = new Entorno_1.Entorno(null);
    var instrucciones = ast.instrucciones;
    var declaracionesG = Array();
    instrucciones.forEach(function (element) {
        if (element.getTipo() == "declaracion") {
            declaracionesG.push(element);
        }
    });
    structs.forEach(function (element) {
        element.ejecutar(entornoGlobal, ast, listaErrores);
    });
    declaracionesG.forEach(function (element) {
        element.ejecutar(entornoGlobal, ast, listaErrores);
    });
    return entornoGlobal;
}
function generarEntornoGlobalTraducir(ast, structs, resultado3D, temporales, listaErrores) {
    var entornoGlobal = new Entorno_1.Entorno(null);
    var instrucciones = ast.instrucciones;
    var declaracionesG = Array();
    instrucciones.forEach(function (element) {
        if (element.getTipo() == "declaracion") {
            declaracionesG.push(element);
        }
    });
    structs.forEach(function (element) {
        element.traducir(entornoGlobal, ast, resultado3D, temporales, listaErrores);
    });
    declaracionesG.forEach(function (element) {
        element.traducir(entornoGlobal, ast, resultado3D, temporales, listaErrores);
    });
    return entornoGlobal;
}
function traducirCompleto(ent, resultado3D, temporales, arbol, listaErrores) {
    //Traer el codigo en 3D    
    //Ingresar encabezado
    var encabezado = '#include <stdio.h> \n#include <math.h> \ndouble heap[30101999]; \ndouble stack[30101999]; \ndouble P; \ndouble H;\n';
    //Generar las funciones nativas
    var generador = new GenerarNativas_1.GenerarNativas();
    //Generar funciones 
    var codFunc = generador.generarFunciones(ent, arbol, temporales, listaErrores);
    //Generar Nativas
    var nativas = generador.generar(temporales);
    //Inicializar todos los temporales
    var codTemporales = '';
    for (var i = 0; i <= temporales.ultimoTemp; i++) {
        if (i == 0) {
            codTemporales += 'double t' + i;
        }
        else {
            codTemporales += ',t' + i;
        }
        if (i == (temporales.ultimoTemp)) {
            codTemporales += ';\n';
        }
    }
    encabezado += codTemporales;
    //Generar el proceso main
    var procMain = '\nvoid main() { \n\tP = 0; \n\tH = 0;\n';
    //Agregar el resultado 3D en el main
    procMain += resultado3D.codigo3D;
    //Cerrar     
    procMain += '\n\treturn; \n }';
    //Mostrar en el text area
    var resultado = encabezado + nativas + codFunc + procMain;
    var areaTraduccion = document.getElementById('traduccion');
    areaTraduccion.value = resultado;
}
function limpiarTablaSimbolos() {
    var tablaSimbolos = document.getElementById('tabla-simbolos');
    tablaSimbolos.innerHTML = "";
    var valorfila = '<th>Funcion o variable</th><th>Id</th><th>Tipo</th><th>Linea</th><th>Columna</th><th>Posicion</th><th>Entorno</th><th>Valor</th>';
    tablaSimbolos.insertRow(-1).innerHTML = valorfila;
}
window.reporteError = function (isActive) {
    var areaError = document.getElementById('listaErrores');
    var funReport = new FuncionesReportes_1.FuncionesReportes();
    if (isActive) {
        areaError.innerHTML = '';
    }
    else {
        areaError.innerHTML = funReport.generarTablaError(listaErroresGlobal);
    }
};
