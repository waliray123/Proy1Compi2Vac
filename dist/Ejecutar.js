"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AST_1 = require("./AST/AST");
var Entorno_1 = require("./AST/Entorno");
var gramatica = require('../jison/Gramatica');
function ejecutarCodigo(entrada) {
    //traigo todas las raices
    console.log("Entrada" + entrada);
    var instrucciones = gramatica.parse(entrada);
    var ast = new AST_1.AST(instrucciones);
    var entornoGlobal = new Entorno_1.Entorno(null);
    //recorro todas las raices  RECURSIVA
    instrucciones.forEach(function (element) {
        element.ejecutar(entornoGlobal, ast);
    });
}


function ejecutar(codigo){
    console.log("Intentando Ejecutar");
    //let codigo = list_editors[index_tab_active].getValue();    
    ejecutarCodigo(codigo);  
}

ejecutar("int i1;");

