"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AST = void 0;
var AST = /** @class */ (function () {
    function AST(instrucciones, structs, funciones) {
        this.instrucciones = instrucciones;
        this.structs = structs;
        this.funciones = funciones;
    }
    return AST;
}());
exports.AST = AST;
