"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorG = void 0;
var ErrorG = /** @class */ (function () {
    function ErrorG(tipoError, descripcion, linea, columna) {
        this.tipoError = tipoError;
        this.descripcion = descripcion;
        this.linea = linea;
        this.columna = columna;
        this.ambito = 'global';
    }
    return ErrorG;
}());
exports.ErrorG = ErrorG;
