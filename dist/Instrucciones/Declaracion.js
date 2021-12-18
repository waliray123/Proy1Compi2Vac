"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var Declaracion = /** @class */ (function () {
    function Declaracion(id, tipo, linea, columna, expresion) {
        this.id = id;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Declaracion.prototype.traducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        var _this = this;
        this.id.forEach(function (id) {
            if (ent.existe(id)) {
                console.log('Id ' + id + ' ya existe');
            }
            else {
                if (_this.expresion == null) {
                    //Se genera el simbolo y se le asigna un lugar en el stack
                    var simbol = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, temporales.ultstack);
                    temporales.ultstack += 1;
                    ent.agregar(id, simbol);
                    resultado3d.codigo3D += 'stack[(int)' + simbol.valor + '];\n';
                }
                else {
                    var tipoExpr = _this.expresion.getTipo(ent, arbol, listaErrores);
                    if (tipoExpr == _this.tipo) {
                        //Se genera el simbolo y se le asigna un lugar en el stack
                        //this.expresion.getValorImplicito(ent,arbol)                        
                        var simbol = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, temporales.ultstack);
                        ent.agregar(id, simbol);
                        temporales.ultstack += 1;
                        //Asignar el valor al stack
                        var valAsign = _this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
                        resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] =' + valAsign + ';\n';
                    }
                    else {
                        console.log('Error semantico, El tipo declarado (' + _this.tipo + ') no concuerda con el tipo asignado (' + tipoExpr + ') en la linea ' + _this.linea + ' y columna ' + _this.columna);
                    }
                }
            }
        });
    };
    Declaracion.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var _this = this;
        // console.log('ejecutado...'+ this.id);
        this.id.forEach(function (id) {
            if (ent.existe(id)) {
                // console.log('Id '+ id +' ya existe');
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable' + id + ' ya existe', _this.linea, _this.columna));
            }
            else {
                if (_this.expresion == null) {
                    var simbol = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, _this.getValDefault());
                    ent.agregar(id, simbol);
                }
                else {
                    var tipoExpr = _this.expresion.getTipo(ent, arbol, listaErrores);
                    if (tipoExpr == _this.tipo) {
                        var simbol = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, _this.expresion.getValorImplicito(ent, arbol, listaErrores));
                        ent.agregar(id, simbol);
                    }
                    else {
                        // console.log('Error semantico, El tipo declarado (' + this.tipo +') no concuerda con el tipo asignado (' + tipoExpr + ') en la linea '+ this.linea + ' y columna ' + this.columna);
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'El tipo declarado (' + ent.getNameTipo(_this.tipo) + ') no concuerda con el tipo asignado', _this.linea, _this.columna));
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
