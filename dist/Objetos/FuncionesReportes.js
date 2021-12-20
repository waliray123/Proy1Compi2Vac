"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionesReportes = void 0;
var FuncionesReportes = /** @class */ (function () {
    function FuncionesReportes() {
    }
    FuncionesReportes.prototype.generarTablaError = function (listaErrores) {
        var contHTML = '<table class="table table-hover table-dark">\n';
        //cabecera
        contHTML += '<thead>\n';
        contHTML += '<tr>\n';
        contHTML += '<th scope="col">Tipo</th>\n';
        contHTML += '<th scope="col">Descripcion</th>\n';
        contHTML += '<th scope="col">Linea</th>\n';
        contHTML += '<th scope="col">Columna</th>\n';
        contHTML += '</tr>\n';
        contHTML += '</thead>\n';
        //el cuerpo
        contHTML += '<tbody>\n';
        listaErrores.forEach(function (err) {
            contHTML += '<tr>\n';
            contHTML += '<th scope="row">' + err.tipoError + '</th>\n';
            contHTML += '<td>' + err.descripcion + '</td>\n';
            contHTML += '<td>' + err.linea + '</td>\n';
            contHTML += '<td>' + err.columna + '</td>\n';
            contHTML += '</tr>\n';
        });
        contHTML += '</tbody>\n';
        contHTML += '</table>\n';
        return contHTML;
    };
    return FuncionesReportes;
}());
exports.FuncionesReportes = FuncionesReportes;
