"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
// print("hola mundo");
var Switch = /** @class */ (function () {
    function Switch(expresion, lista_intstrucciones, linea, columna) {
        this.expresion = expresion;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    Switch.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Switch.prototype.ejecutar = function (ent, arbol) {
        // console.log('ejecutado...'+ this.id);
        // const ast:AST = new AST(this.lista_instrucciones);
        // const entornoGlobal:Entorno = new Entorno(null);
        // //recorro todas las raices  RECURSIVA
        // this.lista_instrucciones.forEach((element:Instruccion) => {
        //     element.ejecutar(entornoGlobal,ast);
        // })
        console.log(this.lista_instrucciones);
    };
    return Switch;
}());
exports.Switch = Switch;
