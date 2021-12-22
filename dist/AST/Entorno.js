"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entorno = void 0;
var Tipo_1 = require("./Tipo");
var Entorno = /** @class */ (function () {
    function Entorno(anterior) {
        this.tabla = {};
        this.anterior = anterior;
        this.valorReturn = null;
        this.nombreEntorno = '';
        this.insertarNombreEntorno();
    }
    Entorno.prototype.insertarNombreEntorno = function () {
        if (this.anterior != null) {
            var nombr = this.anterior.nombreEntorno;
            if (nombr != '') {
                this.nombreEntorno = nombr;
            }
        }
    };
    Entorno.prototype.agregar = function (id, simbolo) {
        id = id;
        simbolo.indentificador = simbolo.indentificador;
        this.tabla[id] = simbolo;
    };
    Entorno.prototype.eliminar = function (id) {
        id = id;
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                delete e.tabla[id];
                return true;
            }
        }
        return false;
    };
    Entorno.prototype.existe = function (id) {
        id = id;
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                return true;
            }
        }
        return false;
    };
    Entorno.prototype.existeEnActual = function (id) {
        id = id;
        if (this.tabla[id] !== undefined) {
            return true;
        }
        return false;
    };
    Entorno.prototype.getSimbolo = function (id) {
        id = id;
        for (var e = this; e != null; e = e.anterior) {
            if (e.tabla[id] !== undefined) {
                return e.tabla[id];
            }
        }
        return null;
    };
    Entorno.prototype.reemplazar = function (id, nuevoValor) {
        id = id;
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                e.tabla[id] = nuevoValor;
            }
        }
    };
    Entorno.prototype.getNameTipo = function (tipo) {
        if (tipo == Tipo_1.Tipo.STRING) {
            return "string";
        }
        else if (tipo == Tipo_1.Tipo.BOOL) {
            return 'boolean';
        }
        else if (tipo == Tipo_1.Tipo.INT) {
            return 'int';
        }
        else if (tipo == Tipo_1.Tipo.CHAR) {
            return 'char';
        }
        else if (tipo == Tipo_1.Tipo.DOUBLE) {
            return 'double';
        }
        else if (tipo == Tipo_1.Tipo.VOID) {
            return 'void';
        }
        else if (tipo == Tipo_1.Tipo.STRUCT) {
            return 'struct';
        }
        else if (tipo == Tipo_1.Tipo.ARRAY) {
            return 'array';
        }
        else if (tipo == Tipo_1.Tipo.TIPO_STRUCT) {
            return 'struct';
        }
        else {
            return 'null';
        }
    };
    return Entorno;
}());
exports.Entorno = Entorno;
