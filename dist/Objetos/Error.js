"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = void 0;
var Error = /** @class */ (function () {
    function Error(tipoError, descripcion, linea, columna) {
        this.tipoError = tipoError;
        this.descripcion = descripcion;
        this.linea = linea;
        this.columna = columna;
        this.ambito = 'global';
    }
    return Error;
}());
exports.Error = Error;
