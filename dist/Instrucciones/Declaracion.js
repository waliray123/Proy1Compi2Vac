"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
// print("hola mundo");
var Declaracion = /** @class */ (function () {
    function Declaracion(id, tipo, linea, columna, expresion) {
        this.id = id;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Declaracion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Declaracion.prototype.ejecutar = function (ent, arbol) {
        var _this = this;
        // console.log('ejecutado...'+ this.id);
        this.id.forEach(function (id) {
            if (ent.existe(id)) {
                console.log('Id ' + id + ' ya existe');
            }
            else {
                if (_this.expresion == null) {
                    var simbol = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, _this.getValDefault());
                    ent.agregar(id, simbol);
                }
                else {
                    var tipoExpr = _this.expresion.getTipo(ent, arbol);
                    if (tipoExpr == _this.tipo) {
                        var simbol = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, _this.expresion.getValorImplicito(ent, arbol));
                        ent.agregar(id, simbol);
                    }
                    else {
                        console.log('Error semantico, El tipo declarado (' + _this.tipo + ') no concuerda con el tipo asignado (' + tipoExpr + ') en la linea ' + _this.linea + ' y columna ' + _this.columna);
                    }
                }
            }
        });
    };
    Declaracion.prototype.getValDefault = function () {
        if (this.tipo == Tipo_1.Tipo.STRING) {
            return "undefined";
        }
        else if (this.tipo == Tipo_1.Tipo.BOOL) {
            return true;
        }
        else if (this.tipo == Tipo_1.Tipo.INT) {
            return 1;
        }
        else if (this.tipo == Tipo_1.Tipo.CHAR) {
            return 'a';
        }
        else if (this.tipo == Tipo_1.Tipo.DOUBLE) {
            return 1.0;
        }
        else {
            return null;
        }
    };
    Declaracion.prototype.getTipo = function () {
        return "declaracion";
    };
    return Declaracion;
}());
exports.Declaracion = Declaracion;
