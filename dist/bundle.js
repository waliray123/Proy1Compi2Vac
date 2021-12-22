(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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

},{"./Tipo":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("./Tipo");
var Simbolo = /** @class */ (function () {
    function Simbolo(tipo, id, linea, columna, valor) {
        this.indentificador = id;
        this.linea = linea;
        this.columna = columna;
        this.tipo = tipo;
        this.valor = valor;
        this.tipoStruct = '';
    }
    Simbolo.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Simbolo.prototype.getTipo = function (ent, arbol) {
        return this.tipo;
    };
    Simbolo.prototype.getValorImplicito = function (ent, arbol) {
        return this.valor;
    };
    Simbolo.prototype.getTipoStruct = function (ent, arbol) {
        if (this.tipo == Tipo_1.Tipo.TIPO_STRUCT) {
            return this.tipoStruct;
        }
        else {
            return null;
        }
    };
    Simbolo.prototype.setTipoStruct = function (tipo) {
        this.tipoStruct = tipo;
    };
    return Simbolo;
}());
exports.Simbolo = Simbolo;

},{"./Tipo":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo;
(function (Tipo) {
    Tipo[Tipo["STRING"] = 0] = "STRING";
    Tipo[Tipo["INT"] = 1] = "INT";
    Tipo[Tipo["DOUBLE"] = 2] = "DOUBLE";
    Tipo[Tipo["BOOL"] = 3] = "BOOL";
    Tipo[Tipo["VOID"] = 4] = "VOID";
    Tipo[Tipo["STRUCT"] = 5] = "STRUCT";
    Tipo[Tipo["NULL"] = 6] = "NULL";
    Tipo[Tipo["ATRIBUTO"] = 7] = "ATRIBUTO";
    Tipo[Tipo["CHAR"] = 8] = "CHAR";
    Tipo[Tipo["ARRAY"] = 9] = "ARRAY";
    Tipo[Tipo["TIPO_STRUCT"] = 10] = "TIPO_STRUCT";
})(Tipo = exports.Tipo || (exports.Tipo = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var AccesoArray = /** @class */ (function () {
    function AccesoArray(contenido, linea, columna) {
        this.contenido = contenido;
        this.linea = linea;
        this.columna = columna;
    }
    AccesoArray.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        temporales.ultimoTemp += 1;
        var tempAux = temporales.ultimoTemp;
        resultado3d.codigo3D += '\tt' + tempAux + '= H;\n';
        temporales.ultimoTemp += 1;
        this.contenido.forEach(function (contenido) {
            var valor = contenido.traducir(ent, arbol, resultado3d, temporales, 0);
            resultado3d.codigo3D += '\theap[(int)H] = ' + valor + ';\n';
            resultado3d.codigo3D += '\tH = H + 1;\n';
        });
        resultado3d.codigo3D += '\theap[(int)H] = -1;\n';
        resultado3d.codigo3D += '\tH = H + 1;\n';
        return 't' + tempAux;
    };
    AccesoArray.prototype.getTipo = function (ent, arbol, listaErrores) {
        return Tipo_1.Tipo.ARRAY;
    };
    AccesoArray.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        try {
            return this.contenido;
        }
        catch (e) {
            console.error("hubo un error en AccesoArray " + e);
            return null;
        }
    };
    return AccesoArray;
}());
exports.AccesoArray = AccesoArray;

},{"../AST/Tipo":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
var AccesoAtribArray = /** @class */ (function () {
    function AccesoAtribArray(id, posicion, linea, columna) {
        this.id = id;
        this.posicion = posicion;
        this.linea = linea;
        this.columna = columna;
    }
    AccesoAtribArray.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var pos = this.posicion.traducir(ent, arbol, resultado3d, temporales, 0);
                temporales.ultimoTemp += 1;
                var stackPos = temporales.ultimoTemp;
                resultado3d.codigo3D += '\tt' + stackPos + ' = stack[(int)' + simbol.valor + '];\n';
                temporales.ultimoTemp += 1;
                var posHeap = temporales.ultimoTemp;
                resultado3d.codigo3D += '\tt' + posHeap + ' = t' + stackPos + ' + ' + pos + ';\n';
                temporales.ultimoTemp += 1;
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = heap[(int) t' + posHeap + '];\n';
                return 't' + temporales.ultimoTemp;
            }
        }
        else {
        }
    };
    AccesoAtribArray.prototype.getTipo = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                return valor.tipo;
            }
            else {
                return Tipo_1.Tipo.NULL;
            }
        }
        else {
            return Tipo_1.Tipo.NULL;
        }
    };
    AccesoAtribArray.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                var pos = this.posicion.getValorImplicito(ent, arbol, listaErrores);
                if (typeof (pos) == 'number') {
                    if (pos >= 0 && pos < valor.length) {
                        return valor.contenido[pos].getValorImplicito(ent, arbol, listaErrores);
                    }
                    else {
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'index fuera del limite del arreglo', this.linea, this.columna));
                        return null;
                    }
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable no es del tipo array', this.linea, this.columna));
            }
        }
        else {
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.id, this.linea, this.columna));
        }
    };
    return AccesoAtribArray;
}());
exports.AccesoAtribArray = AccesoAtribArray;

},{"../AST/Tipo":3,"../Objetos/ErrorG":43}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
var AccesoVariable_1 = require("./AccesoVariable");
var AccesoAtributo = /** @class */ (function () {
    function AccesoAtributo(expr1, expr2, linea, columna) {
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.linea = linea;
        this.columna = columna;
        this.isAlone = false;
    }
    AccesoAtributo.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoAtributo.prototype.getTipo = function (ent, arbol, listaErrores) {
        var _this = this;
        try {
            var valor_1 = Tipo_1.Tipo.NULL;
            this.expr1.isAlone = false;
            var val1 = this.expr1.getValorImplicito(ent, arbol, listaErrores);
            val1.forEach(function (decl) {
                var nombre = decl.id[0];
                if (nombre == _this.expr2) {
                    // console.log('valor ' + decl.expresion.getValorImplicito(ent, arbol))
                    if (decl.expresion instanceof AccesoVariable_1.AccesoVariable) {
                        decl.expresion.isAlone = false;
                        valor_1 = decl.expresion.getValorImplicito(ent, arbol, listaErrores);
                        decl.expresion.isAlone = true;
                    }
                    else {
                        valor_1 = decl.expresion.getTipo(ent, arbol, listaErrores);
                    }
                }
            });
            this.expr1.isAlone = true;
            return valor_1;
        }
        catch (e) {
            console.error("hubo un error en AccesoAtributo " + e);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'hubo un erro en en acceder al atributo', this.linea, this.columna));
            return Tipo_1.Tipo.NULL;
        }
    };
    AccesoAtributo.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        var _this = this;
        try {
            var valor_2 = null;
            this.expr1.isAlone = false;
            var val1 = this.expr1.getValorImplicito(ent, arbol, listaErrores);
            val1.forEach(function (decl) {
                var nombre = decl.id[0];
                if (nombre == _this.expr2) {
                    // console.log('valor ' + decl.expresion.getValorImplicito(ent, arbol))
                    if (decl.expresion instanceof AccesoVariable_1.AccesoVariable) {
                        decl.expresion.isAlone = false;
                        valor_2 = decl.expresion.getValorImplicito(ent, arbol, listaErrores);
                        decl.expresion.isAlone = true;
                    }
                    else {
                        valor_2 = decl.expresion.getValorImplicito(ent, arbol, listaErrores);
                    }
                }
            });
            this.expr1.isAlone = true;
            return valor_2;
        }
        catch (e) {
            console.error("hubo un error en AccesoAtributo " + e);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'hubo un error en acceder al atributo', this.linea, this.columna));
            return null;
        }
    };
    return AccesoAtributo;
}());
exports.AccesoAtributo = AccesoAtributo;

},{"../AST/Tipo":3,"../Objetos/ErrorG":43,"./AccesoVariable":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
var AccesoVariable = /** @class */ (function () {
    function AccesoVariable(id, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.isAlone = true;
    }
    AccesoVariable.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        if (temporales.esFuncion == true) {
            if (ent.existe(this.id)) {
                var simbol = ent.getSimbolo(this.id);
                temporales.ultimoTemp += 1;
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= P +' + simbol.valor + ';\n';
                var valor = 'stack[(int)t' + temporales.ultimoTemp + ']';
                temporales.ultimoTemp += 1;
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '=' + valor + ';\n';
                var valR = 't' + temporales.ultimoTemp;
                temporales.ultimoTipo = this.getTipo(ent, arbol, []);
                return valR;
            }
            else {
                console.log('No existe el id ' + this.id + ' no hay tipo');
            }
        }
        else {
            if (ent.existe(this.id)) {
                var simbol = ent.getSimbolo(this.id);
                var valor = 'stack[(int)' + simbol.valor + ']';
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '=' + valor + ';\n';
                var valR = 't' + temporales.ultimoTemp;
                temporales.ultimoTemp += 1;
                temporales.ultimoTipo = this.getTipo(ent, arbol, []);
                return valR;
            }
            else {
                console.log('No existe el id ' + this.id + ' no hay tipo');
            }
        }
    };
    AccesoVariable.prototype.getTipo = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            return simbol.getTipo(ent, arbol);
        }
        else {
            // console.log('No existe el id ' + this.id + ' no hay tipo');
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.id, this.linea, this.columna));
        }
        return Tipo_1.Tipo.NULL;
    };
    AccesoVariable.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.TIPO_STRUCT && this.isAlone) {
                var sendResultado_1 = simbol.getTipoStruct(ent, arbol) + '(';
                var atributos_1 = simbol.getValorImplicito(ent, arbol);
                var i_1 = 0;
                atributos_1.forEach(function (atributo) {
                    sendResultado_1 += atributo.expresion.getValorImplicito(ent, arbol, listaErrores);
                    if (i_1 == atributos_1.length - 1) {
                        sendResultado_1 += ')';
                    }
                    else {
                        sendResultado_1 += ' , ';
                    }
                    i_1++;
                });
                return sendResultado_1;
            }
            else if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY && this.isAlone) {
                var sendResultado_2 = '[';
                var valor = simbol.getValorImplicito(ent, arbol);
                var exprs_1 = valor.contenido;
                var i_2 = 0;
                exprs_1.forEach(function (expr) {
                    sendResultado_2 += expr.getValorImplicito(ent, arbol, listaErrores);
                    if (i_2 == exprs_1.length - 1) {
                        sendResultado_2 += ']';
                    }
                    else {
                        sendResultado_2 += ',';
                    }
                    i_2++;
                });
                return sendResultado_2;
            }
            else {
                return simbol.valor;
            }
        }
        else {
            // console.log('No existe el id ' + this.id);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.id, this.linea, this.columna));
        }
    };
    AccesoVariable.prototype.getId = function () {
        return this.id;
    };
    return AccesoVariable;
}());
exports.AccesoVariable = AccesoVariable;

},{"../AST/Tipo":3,"../Objetos/ErrorG":43}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
var ArrbegEnd = /** @class */ (function () {
    function ArrbegEnd(id, linea, columna, expresion1, expresion2) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
        this.isAlone = true;
    }
    ArrbegEnd.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    ArrbegEnd.prototype.getTipo = function (ent, arbol, listaErrores) {
        if (this.isAlone) {
            return Tipo_1.Tipo.ARRAY;
        }
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            var valor = simbol.getValorImplicito(ent, arbol);
            return valor.tipo;
        }
        return Tipo_1.Tipo.NULL;
    };
    ArrbegEnd.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                var inicio = this.expresion1.getValorImplicito(ent, arbol, listaErrores);
                var final = this.expresion2.getValorImplicito(ent, arbol, listaErrores);
                var datosArray_1 = this.devolverArreglo(inicio, final, valor, listaErrores);
                if (this.isAlone) {
                    var sendResultado_1 = 'undefined';
                    if (datosArray_1.length > 0) {
                        sendResultado_1 = '[';
                    }
                    var i_1 = 0;
                    datosArray_1.forEach(function (expr) {
                        sendResultado_1 += expr.getValorImplicito(ent, arbol, listaErrores); //ahora veo si lo dejo asi
                        if (i_1 == datosArray_1.length - 1) {
                            sendResultado_1 += ']';
                        }
                        else {
                            sendResultado_1 += ',';
                        }
                        i_1++;
                    });
                    return sendResultado_1;
                }
                else {
                    return datosArray_1;
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable no es del tipo array', this.linea, this.columna));
            }
        }
        else {
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.id, this.linea, this.columna));
        }
        return null;
    };
    ArrbegEnd.prototype.getListaDatos = function (ent, arbol, listaErrores) {
        this.isAlone = false;
        var valor = this.getValorImplicito(ent, arbol, listaErrores);
        this.isAlone = true;
        if (valor === null) {
            return [];
        }
        if (typeof (valor) === 'string') {
            return [];
        }
        return valor;
    };
    ArrbegEnd.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    ArrbegEnd.prototype.verificarDimension = function (pos, max, listaErrores) {
        if (pos >= 0 && pos < max) {
            return true;
        }
        else {
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'index [' + pos + '] fuera del limite del arreglo', this.linea, this.columna));
            return false;
        }
    };
    ArrbegEnd.prototype.devolverArreglo = function (inicio, final, valor, listaErrores) {
        if (inicio == 'begin' && final == 'end') {
            // begin end
            return valor.contenido;
        }
        else if (inicio == 'begin' && final != 'end') {
            // begin expresion            
            if (typeof (final) == 'number') {
                var isFinal = this.verificarDimension(final, valor.length, listaErrores);
                if (isFinal) {
                    var datosArray = [];
                    for (var i = 0; i <= final; i++) {
                        datosArray.push(valor.contenido[i]);
                    }
                    return datosArray;
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la posicion final colocada no es numerico', this.linea, this.columna));
            }
        }
        else if (inicio != 'begin' && final == 'end') {
            // expresion end
            if (typeof (inicio) == 'number') {
                var isInicio = this.verificarDimension(inicio, valor.length, listaErrores);
                if (isInicio) {
                    var datosArray = [];
                    for (var i = inicio; i < valor.length; i++) {
                        datosArray.push(valor.contenido[i]);
                    }
                    return datosArray;
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la posicion final colocada no es numerico', this.linea, this.columna));
            }
        }
        else {
            // expresion expresion
            if (typeof (inicio) == 'number' && typeof (final) == 'number') {
                var isInicio = this.verificarDimension(inicio, final, listaErrores);
                var isFinal = this.verificarDimension(final, valor.length, listaErrores);
                if (isInicio && isFinal) {
                    var datosArray = [];
                    for (var i = inicio; i <= final; i++) {
                        datosArray.push(valor.contenido[i]);
                    }
                    return datosArray;
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'las posiciones colocadas no son numericos', this.linea, this.columna));
            }
        }
        return [];
    };
    return ArrbegEnd;
}());
exports.ArrbegEnd = ArrbegEnd;

},{"../AST/Tipo":3,"../Objetos/ErrorG":43}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Atributo = /** @class */ (function () {
    function Atributo(id, valor, linea, columna) {
        this.identificador = id;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    return Atributo;
}());
exports.Atributo = Atributo;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ConcatenarTraduccion = /** @class */ (function () {
    function ConcatenarTraduccion(valAsign, tipo) {
        this.valAsign = valAsign;
        this.tipo = tipo;
    }
    return ConcatenarTraduccion;
}());
exports.ConcatenarTraduccion = ConcatenarTraduccion;
var ConcatenacionString = /** @class */ (function () {
    function ConcatenacionString(expresiones, linea, columna) {
        this.expresiones = expresiones;
        this.linea = linea;
        this.columna = columna;
    }
    ConcatenacionString.prototype.getTipo = function (ent, arbol, listaErrores) {
        return Tipo_1.Tipo.STRING;
    };
    ConcatenacionString.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        var valorCompleto = '';
        this.expresiones.forEach(function (expresion) {
            valorCompleto += expresion.getValorImplicito(ent, arbol, listaErrores);
        });
        return valorCompleto;
    };
    ConcatenacionString.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        var temps = [];
        this.expresiones.forEach(function (expresion) {
            var valAsign = expresion.traducir(ent, arbol, resultado3d, temporales, recursivo);
            var tipo = temporales.ultimoTipo;
            temps.push(new ConcatenarTraduccion(valAsign, tipo));
        });
        return temps;
    };
    ConcatenacionString.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return ConcatenacionString;
}());
exports.ConcatenacionString = ConcatenacionString;

},{"../AST/Tipo":3}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entorno_1 = require("../AST/Entorno");
var Objeto = /** @class */ (function () {
    function Objeto(id, texto, linea, columna, listaAtributos, listaO) {
        this.identificador = id;
        this.texto = texto;
        this.linea = linea;
        this.columna = columna;
        this.listaAtributos = listaAtributos;
        this.listaObjetos = listaO;
        this.entorno = new Entorno_1.Entorno(null);
    }
    return Objeto;
}());
exports.Objeto = Objeto;

},{"../AST/Entorno":1}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
var Operador;
(function (Operador) {
    Operador[Operador["SUMA"] = 0] = "SUMA";
    Operador[Operador["RESTA"] = 1] = "RESTA";
    Operador[Operador["MULTIPLICACION"] = 2] = "MULTIPLICACION";
    Operador[Operador["AMPERSON"] = 3] = "AMPERSON";
    Operador[Operador["DIVISION"] = 4] = "DIVISION";
    Operador[Operador["MODULO"] = 5] = "MODULO";
    Operador[Operador["MENOS_UNARIO"] = 6] = "MENOS_UNARIO";
    Operador[Operador["ELEVADO"] = 7] = "ELEVADO";
    Operador[Operador["MAYOR_QUE"] = 8] = "MAYOR_QUE";
    Operador[Operador["MENOR_QUE"] = 9] = "MENOR_QUE";
    Operador[Operador["IGUAL_IGUAL"] = 10] = "IGUAL_IGUAL";
    Operador[Operador["DIFERENTE_QUE"] = 11] = "DIFERENTE_QUE";
    Operador[Operador["OR"] = 12] = "OR";
    Operador[Operador["AND"] = 13] = "AND";
    Operador[Operador["NOT"] = 14] = "NOT";
    Operador[Operador["MAYOR_IGUA_QUE"] = 15] = "MAYOR_IGUA_QUE";
    Operador[Operador["MENOR_IGUA_QUE"] = 16] = "MENOR_IGUA_QUE";
    Operador[Operador["INCREMENTO"] = 17] = "INCREMENTO";
    Operador[Operador["DECREMENTO"] = 18] = "DECREMENTO";
    Operador[Operador["POW"] = 19] = "POW";
    Operador[Operador["SQRT"] = 20] = "SQRT";
    Operador[Operador["SIN"] = 21] = "SIN";
    Operador[Operador["COS"] = 22] = "COS";
    Operador[Operador["TAN"] = 23] = "TAN";
    Operador[Operador["DESCONOCIDO"] = 24] = "DESCONOCIDO";
})(Operador = exports.Operador || (exports.Operador = {}));
var Operacion = /** @class */ (function () {
    function Operacion(op_izquierda, op_derecha, operacion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.op_izquierda = op_izquierda;
        this.op_derecha = op_derecha;
        this.operador = operacion;
    }
    Operacion.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        console.log("Traduciendo operacion");
        var resultado = "";
        if (this.operador !== Operador.MENOS_UNARIO && this.operador !== Operador.NOT
            && this.operador != Operador.SQRT && this.operador != Operador.SIN && this.operador != Operador.COS
            && this.operador != Operador.TAN && this.operador != Operador.INCREMENTO && this.operador != Operador.DECREMENTO) {
            var val1 = this.op_izquierda.traducir(ent, arbol, resultado3d, temporales, recursivo + 1);
            var val2 = this.op_derecha.traducir(ent, arbol, resultado3d, temporales, recursivo + 1);
            var valor = this.unirResultado(val1, val2, resultado3d, temporales);
            if (recursivo == 0) {
                return valor;
            }
            else {
                if (temporales.ultimoTipo == Tipo_1.Tipo.BOOL) {
                    temporales.ultLiteral += 3;
                    var ultLit = temporales.ultLiteral - 2;
                    resultado3d.codigo3D += '\tif(' + valor + ') goto L' + ultLit + ';\n';
                    resultado3d.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
                    resultado3d.codigo3D += '\tL' + (ultLit) + ':\n';
                    resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= 1;\n';
                    resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
                    resultado3d.codigo3D += '\tL' + (ultLit + 1) + ':\n';
                    resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= 0;\n';
                    resultado3d.codigo3D += '\tL' + (ultLit + 2) + ':\n';
                    temporales.ultLitEscr = (ultLit + 2);
                    var valR = 't' + temporales.ultimoTemp;
                    temporales.ultimoTemp += 1;
                    return valR;
                }
                else {
                    resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '=' + valor + ';\n';
                    var valR = 't' + temporales.ultimoTemp;
                    temporales.ultimoTemp += 1;
                    return valR;
                }
            }
        }
        else {
            var val1 = this.op_izquierda.traducir(ent, arbol, resultado3d, temporales, recursivo + 1);
            var valor = this.unirResultadoUnico(val1);
            if (recursivo == 0) {
                return valor;
            }
            else {
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '=' + valor + ';\n';
                var valR = 't' + temporales.ultimoTemp;
                temporales.ultimoTemp += 1;
                return valR;
            }
        }
    };
    Operacion.prototype.unirResultado = function (val1, val2, resultado3d, temporales) {
        var resultadoR = '';
        if (this.operador == Operador.SUMA) {
            resultadoR = val1 + "+" + val2;
            temporales.ultimoTipo = Tipo_1.Tipo.DOUBLE;
        }
        else if (this.operador == Operador.RESTA) {
            resultadoR = val1 + "-" + val2;
            temporales.ultimoTipo = Tipo_1.Tipo.DOUBLE;
        }
        else if (this.operador == Operador.MULTIPLICACION) {
            resultadoR = val1 + "*" + val2;
            temporales.ultimoTipo = Tipo_1.Tipo.DOUBLE;
        }
        else if (this.operador == Operador.DIVISION) {
            resultadoR = val1 + "/" + val2;
            temporales.ultimoTipo = Tipo_1.Tipo.DOUBLE;
        }
        else if (this.operador == Operador.MAYOR_QUE) {
            resultadoR = val1 + ">" + val2;
            temporales.ultimoTipo = Tipo_1.Tipo.BOOL;
        }
        else if (this.operador == Operador.MENOR_QUE) {
            resultadoR = val1 + "<" + val2;
            temporales.ultimoTipo = Tipo_1.Tipo.BOOL;
        }
        else if (this.operador == Operador.MAYOR_IGUA_QUE) {
            resultadoR = val1 + ">=" + val2;
            temporales.ultimoTipo = Tipo_1.Tipo.BOOL;
        }
        else if (this.operador == Operador.MENOR_IGUA_QUE) {
            resultadoR = val1 + "<=" + val2;
            temporales.ultimoTipo = Tipo_1.Tipo.BOOL;
        }
        else if (this.operador == Operador.IGUAL_IGUAL) {
            resultadoR = val1 + "==" + val2;
            temporales.ultimoTipo = Tipo_1.Tipo.BOOL;
        }
        else if (this.operador == Operador.MODULO) {
            resultadoR = 'fmod(' + val1 + ',' + val2 + ')';
            temporales.ultimoTipo = Tipo_1.Tipo.DOUBLE;
        }
        else if (this.operador == Operador.AND) {
            temporales.ultimoTemp += 1;
            var temReturn = temporales.ultimoTemp;
            temporales.ultLiteral += 3;
            var ultLit = temporales.ultLiteral - 2;
            resultado3d.codigo3D += '\tif (' + val1 + ' == 1) goto L' + ultLit + ';\n';
            resultado3d.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
            resultado3d.codigo3D += '\tL' + (ultLit) + ':\n';
            temporales.ultLiteral += 2;
            var ultLit2 = temporales.ultLiteral - 1;
            resultado3d.codigo3D += '\tif (' + val2 + ' == 1) goto L' + ultLit2 + ';\n';
            resultado3d.codigo3D += '\tgoto L' + (ultLit2 + 1) + ';\n';
            resultado3d.codigo3D += '\tL' + (ultLit2) + ':\n';
            resultado3d.codigo3D += '\tt' + temReturn + '= 1;\n';
            resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
            resultado3d.codigo3D += '\tL' + (ultLit2 + 1) + ':\n';
            resultado3d.codigo3D += '\tt' + temReturn + '= 0;\n';
            resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
            resultado3d.codigo3D += '\tL' + (ultLit + 1) + ':\n';
            resultado3d.codigo3D += '\tt' + temReturn + '= 0;\n';
            resultado3d.codigo3D += '\tL' + (ultLit + 2) + ':\n';
            temporales.ultLitEscr = ultLit + 2;
            resultadoR = 't' + temReturn;
            temporales.ultimoTipo = Tipo_1.Tipo.BOOL;
        }
        else if (this.operador == Operador.OR) {
            temporales.ultimoTemp += 1;
            var temReturn = temporales.ultimoTemp;
            temporales.ultLiteral += 3;
            var ultLit = temporales.ultLiteral - 2;
            resultado3d.codigo3D += '\tif (' + val1 + ' == 0) goto L' + ultLit + ';\n';
            resultado3d.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
            resultado3d.codigo3D += '\tL' + (ultLit) + ':\n';
            temporales.ultLiteral += 2;
            var ultLit2 = temporales.ultLiteral - 1;
            resultado3d.codigo3D += '\tif (' + val2 + ' == 0) goto L' + ultLit2 + ';\n';
            resultado3d.codigo3D += '\tgoto L' + (ultLit2 + 1) + ';\n';
            resultado3d.codigo3D += '\tL' + (ultLit2) + ':\n';
            resultado3d.codigo3D += '\tt' + temReturn + '= 0;\n';
            resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
            resultado3d.codigo3D += '\tL' + (ultLit2 + 1) + ':\n';
            resultado3d.codigo3D += '\tt' + temReturn + '= 1;\n';
            resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
            resultado3d.codigo3D += '\tL' + (ultLit + 1) + ':\n';
            resultado3d.codigo3D += '\tt' + temReturn + '= 1;\n';
            resultado3d.codigo3D += '\tL' + (ultLit + 2) + ':\n';
            temporales.ultLitEscr = ultLit + 2;
            resultadoR = 't' + temReturn;
            temporales.ultimoTipo = Tipo_1.Tipo.BOOL;
        }
        //TODO: No se como hacerle para esto, porque si viene un tt como se el valor?
        else if (this.operador == Operador.POW) {
            //TODO
            temporales.ultimoTemp += 1;
            resultadoR = 't';
        }
        else if (this.operador == Operador.SIN) {
        }
        return resultadoR;
    };
    Operacion.prototype.unirResultadoUnico = function (val1) {
        var resultadoR = '';
        if (this.operador == Operador.MENOS_UNARIO) {
            resultadoR = '-' + val1;
        }
        return resultadoR;
    };
    Operacion.prototype.getTipo = function (ent, arbol, listaErrores) {
        var valor = this.getValorImplicito(ent, arbol, listaErrores);
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo_1.Tipo.INT;
            }
            return Tipo_1.Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo_1.Tipo.NULL;
        }
        return Tipo_1.Tipo.VOID;
    };
    Operacion.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        if (this.operador !== Operador.MENOS_UNARIO && this.operador !== Operador.NOT
            && this.operador != Operador.SQRT && this.operador != Operador.SIN && this.operador != Operador.COS
            && this.operador != Operador.TAN && this.operador != Operador.INCREMENTO && this.operador != Operador.DECREMENTO) {
            var op1 = this.op_izquierda.getValorImplicito(ent, arbol, listaErrores);
            var op2 = this.op_derecha.getValorImplicito(ent, arbol, listaErrores);
            //suma
            if (this.operador == Operador.SUMA) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 + op2;
                }
                else {
                    // console.log("Error de tipos de datos no permitidos realizando una suma");
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'error de tipos de datos no permitidos realizando una suma', this.linea, this.columna));
                    return null;
                }
            }
            //resta
            else if (this.operador == Operador.RESTA) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 - op2;
                }
                else {
                    // console.log("Error de tipos de datos no permitidos realizando una suma");
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'error al realizar una resta', this.linea, this.columna));
                    return null;
                }
            }
            //multiplicación
            else if (this.operador == Operador.MULTIPLICACION) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 * op2;
                }
                else {
                    // console.log("Error de tipos de datos no permitidos realizando una suma");
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'error al realizar la multiplicación', this.linea, this.columna));
                    return null;
                }
            }
            //division
            else if (this.operador == Operador.DIVISION) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    if (op2 === 0) {
                        // console.log("Resultado indefinido, no puede ejecutarse operación sobre cero.");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'resultado indefinido, no puede ejecutarse operacion sobre cero', this.linea, this.columna));
                        return null;
                    }
                    return op1 / op2;
                }
                else {
                    // console.log("Error de tipos de datos no permitidos realizando una suma");
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'error al realizar una division', this.linea, this.columna));
                    return null;
                }
            }
            //modulo
            else if (this.operador == Operador.MODULO) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    if (op2 === 0) {
                        // console.log("Resultado indefinido, no puede ejecutarse operación sobre cero.");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'resultado indefinido, no puede ejecutarsre operacion sobre cero', this.linea, this.columna));
                        return null;
                    }
                    return op1 % op2;
                }
                else {
                    // console.log("Error de tipos de datos no permitidos realizando una suma");
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'error al realizar la operacion de modulo', this.linea, this.columna));
                    return null;
                }
            }
            //AMPERSON
            else if (this.operador == Operador.AMPERSON) {
                if (typeof (op1 === 'string') && typeof (op2 === 'string')) {
                    return op1.toString().concat(op2.toString());
                }
                else {
                    // console.log('Error semantico, Solo se puede concatenar (&) Strings en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Solo se puede concatenar (&) Strings', this.linea, this.columna));
                    return null;
                }
            }
            //ELEVADO
            else if (this.operador == Operador.ELEVADO) {
                if (this.op_izquierda.getTipo(ent, arbol, listaErrores) == Tipo_1.Tipo.STRING && this.op_derecha.getTipo(ent, arbol, listaErrores) == Tipo_1.Tipo.INT) {
                    return op1.repeat(Number(op2));
                }
                else {
                    // console.log('Error semantico, No se puede completar la accion ^ en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'No se puede completar la accion ^', this.linea, this.columna));
                    return null;
                }
            }
            try {
                //MAYOR QUE
                if (this.operador == Operador.MAYOR_QUE) {
                    return op1 > op2;
                }
                //MENOR QUE
                else if (this.operador == Operador.MENOR_QUE) {
                    return op1 < op2;
                }
                //Mayor o igual
                else if (this.operador == Operador.MAYOR_IGUA_QUE) {
                    return op1 >= op2;
                }
                //menor o igual
                else if (this.operador == Operador.MENOR_IGUA_QUE) {
                    return op1 <= op2;
                }
                //igualacion
                else if (this.operador == Operador.IGUAL_IGUAL) {
                    return op1 == op2;
                }
                //diferente que
                else if (this.operador == Operador.DIFERENTE_QUE) {
                    return op1 != op2;
                }
                //or
                else if (this.operador == Operador.OR) {
                    return op1 || op2;
                }
                //and
                else if (this.operador == Operador.AND) {
                    return op1 && op2;
                }
                //potencia
                else if (this.operador == Operador.POW) {
                    if (typeof (op1 === "number") && typeof (op2 === "number")) {
                        return Math.pow(op1, op2);
                    }
                    else {
                        // console.log("Error de tipos de datos no permitidos realizando una potencia");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error de tipos de datos no permitidos realizando una potencia', this.linea, this.columna));
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            try {
                var op1 = this.op_izquierda.getValorImplicito(ent, arbol, listaErrores);
                if (this.operador == Operador.MENOS_UNARIO) {
                    if (typeof (op1 === "number")) {
                        return -1 * op1;
                    }
                    else {
                        // console.log("Error de tipos de datos no permitidos realizando una operación unaria");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error de tipos de datos no permitidos realizando una operación unaria', this.linea, this.columna));
                        return null;
                    }
                }
                else if (this.operador == Operador.NOT) {
                    return !op1;
                }
                else if (this.operador == Operador.SIN) {
                    if (typeof (op1 === "number")) {
                        return Math.sin(this.gradosRadianes(op1));
                    }
                    else {
                        // console.log("Error de tipos de datos no permitidos realizando una operacion seno");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error de tipos de datos no permitidos realizando una operacion seno', this.linea, this.columna));
                    }
                }
                else if (this.operador == Operador.COS) {
                    if (typeof (op1 === "number")) {
                        return Math.cos(this.gradosRadianes(op1));
                    }
                    else {
                        // console.log("Error de tipos de datos no permitidos realizando una operacion coseno");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error de tipos de datos no permitidos realizando una operacion coseno', this.linea, this.columna));
                    }
                }
                else if (this.operador == Operador.TAN) {
                    if (typeof (op1 === "number")) {
                        return Math.tan(this.gradosRadianes(op1));
                    }
                    else {
                        // console.log("Error de tipos de datos no permitidos realizando una operacion tangente");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error de tipos de datos no permitidos realizando una operacion tangente', this.linea, this.columna));
                    }
                }
                else if (this.operador == Operador.SQRT) {
                    if (typeof (op1 === "number")) {
                        return Math.sqrt(op1);
                    }
                    else {
                        // console.log("Error de tipos de datos no permitidos realizando una raiz");
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error de tipos de datos no permitidos realizando una raiz', this.linea, this.columna));
                    }
                }
                //incremento
                else if (this.operador == Operador.INCREMENTO) {
                    return op1 + 1;
                }
                else if (this.operador == Operador.DECREMENTO) {
                    return op1 - 1;
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        return null;
    };
    Operacion.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    Operacion.prototype.gradosRadianes = function (n) {
        return (n * (Math.PI / 180));
    };
    return Operacion;
}());
exports.Operacion = Operacion;

},{"../AST/Tipo":3,"../Objetos/ErrorG":43}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var Arreglo_1 = require("../Objetos/Arreglo");
var ErrorG_1 = require("../Objetos/ErrorG");
var AccesoVariable_1 = require("./AccesoVariable");
var Primitivo_1 = require("./Primitivo");
var OperadorCadena;
(function (OperadorCadena) {
    OperadorCadena[OperadorCadena["LENGTH"] = 0] = "LENGTH";
    OperadorCadena[OperadorCadena["UPPERCASE"] = 1] = "UPPERCASE";
    OperadorCadena[OperadorCadena["LOWERCASE"] = 2] = "LOWERCASE";
    OperadorCadena[OperadorCadena["CHARPOS"] = 3] = "CHARPOS";
    OperadorCadena[OperadorCadena["SUBSTRING"] = 4] = "SUBSTRING";
    OperadorCadena[OperadorCadena["POP"] = 5] = "POP";
})(OperadorCadena = exports.OperadorCadena || (exports.OperadorCadena = {}));
var OperacionCadena = /** @class */ (function () {
    function OperacionCadena(id, expr1, expr2, operadorCadena, linea, columna) {
        this.isEjecutar = true;
        this.id = id;
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.operadorCadena = operadorCadena;
        this.linea = linea;
        this.columna = columna;
    }
    OperacionCadena.prototype.getTipo = function (ent, arbol, listaErrores) {
        this.isEjecutar = false;
        var valor = this.getValorImplicito(ent, arbol, listaErrores);
        this.isEjecutar = true;
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo_1.Tipo.INT;
            }
            return Tipo_1.Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo_1.Tipo.NULL;
        }
        return Tipo_1.Tipo.VOID;
    };
    OperacionCadena.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        var _a;
        if (this.operadorCadena == OperadorCadena.LENGTH) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
                var valor = this.id.getValorImplicito(ent, arbol, listaErrores);
                if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                    this.id.isAlone = true;
                }
                if (valor instanceof Arreglo_1.Arreglo) {
                    return valor.length;
                }
                else {
                    if (typeof (valor) === "string") {
                        return valor.length;
                    }
                    else {
                        //no es de tipo string
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es de tipo string', this.linea, this.columna));
                    }
                }
            }
            else if (this.id instanceof Primitivo_1.Primitivo) {
                if (this.id.getTipo(ent, arbol, listaErrores) === Tipo_1.Tipo.STRING) {
                    return this.id.getValorImplicito(ent, arbol, listaErrores).length;
                }
                else {
                    //no es un primitivo de string
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es de tipo string', this.linea, this.columna));
                }
            }
            else {
                //error
            }
        }
        else if (this.operadorCadena == OperadorCadena.LOWERCASE) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
            }
            var valor = this.id.getValorImplicito(ent, arbol, listaErrores);
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = true;
            }
            if (typeof (valor) === 'string') {
                return valor.toLocaleLowerCase();
            }
            else {
                //no es de tipo string
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no tiene un valor del tipo string', this.linea, this.columna));
            }
        }
        else if (this.operadorCadena == OperadorCadena.UPPERCASE) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
            }
            var valor = this.id.getValorImplicito(ent, arbol, listaErrores);
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = true;
            }
            if (typeof (valor) === 'string') {
                return valor.toLocaleUpperCase();
            }
            else {
                //no es de tipo string
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es de tipo string', this.linea, this.columna));
            }
        }
        else if (this.operadorCadena == OperadorCadena.CHARPOS) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
            }
            var valor = this.id.getValorImplicito(ent, arbol, listaErrores);
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = true;
            }
            if (typeof (valor) === 'string') {
                var posChar = this.expr1.getValorImplicito(ent, arbol, listaErrores);
                if (typeof (posChar) === 'number') {
                    if (this.isInt(Number(posChar))) {
                        return valor.charAt(posChar);
                    }
                    else {
                        //no es un int
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es de tipo int la posicion asignada', this.linea, this.columna));
                    }
                }
                else {
                    //no es un numero
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es un numero en la posicion asignada', this.linea, this.columna));
                }
            }
            else {
                //no es de tipo string
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es de tipo string', this.linea, this.columna));
            }
        }
        else if (this.operadorCadena == OperadorCadena.SUBSTRING) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
            }
            var valor = this.id.getValorImplicito(ent, arbol, listaErrores);
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = true;
            }
            if (typeof (valor) === 'string') {
                var inicial = this.expr1.getValorImplicito(ent, arbol, listaErrores);
                var final = this.expr2.getValorImplicito(ent, arbol, listaErrores);
                if (typeof (final) === 'number' && typeof (inicial) === 'number') {
                    if (this.isInt(Number(inicial)) && this.isInt(Number(final))) {
                        return valor.substring(inicial, final);
                    }
                    else {
                        //no es un int
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es un dato de tipo int', this.linea, this.columna));
                    }
                }
                else {
                    //no es un numero
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es un numero', this.linea, this.columna));
                }
            }
            else {
                //no es de tipo string
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es un string', this.linea, this.columna));
            }
        }
        else if (this.operadorCadena == OperadorCadena.POP) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
                var valor = this.id.getValorImplicito(ent, arbol, listaErrores);
                if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                    this.id.isAlone = true;
                }
                if (valor instanceof Arreglo_1.Arreglo) {
                    if (this.isEjecutar) {
                        var val = (_a = valor.pop()) === null || _a === void 0 ? void 0 : _a.getValorImplicito(ent, arbol, listaErrores);
                        return val;
                    }
                    else {
                        return valor.getLastContenido().getValorImplicito(ent, arbol, listaErrores);
                    }
                }
                else {
                    //No es un arreglo
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no se puede realizar la operacion porque no es de tipo array', this.linea, this.columna));
                }
            }
        }
        return null;
    };
    OperacionCadena.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        throw new Error("Method not implemented.");
    };
    OperacionCadena.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return OperacionCadena;
}());
exports.OperacionCadena = OperacionCadena;

},{"../AST/Tipo":3,"../Objetos/Arreglo":42,"../Objetos/ErrorG":43,"./AccesoVariable":7,"./Primitivo":16}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
var AccesoArray_1 = require("./AccesoArray");
var AccesoVariable_1 = require("./AccesoVariable");
var Operacion_1 = require("./Operacion");
var OperadorNativa;
(function (OperadorNativa) {
    OperadorNativa[OperadorNativa["PARSE"] = 0] = "PARSE";
    OperadorNativa[OperadorNativa["TOINT"] = 1] = "TOINT";
    OperadorNativa[OperadorNativa["TODOUBLE"] = 2] = "TODOUBLE";
    OperadorNativa[OperadorNativa["STRING"] = 3] = "STRING";
    OperadorNativa[OperadorNativa["TYPEOF"] = 4] = "TYPEOF";
})(OperadorNativa = exports.OperadorNativa || (exports.OperadorNativa = {}));
var OperacionNativa = /** @class */ (function () {
    function OperacionNativa(operadorNativa, tipo, expresion, linea, columna) {
        this.isEjecutar = true;
        this.operadorNativa = operadorNativa;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    OperacionNativa.prototype.getTipo = function (ent, arbol, listaErrores) {
        var valor = this.getValorImplicito(ent, arbol, listaErrores);
        if (this.isEjecutar === false) {
            this.isEjecutar = true;
            return Tipo_1.Tipo.DOUBLE;
        }
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo_1.Tipo.INT;
            }
            return Tipo_1.Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo_1.Tipo.NULL;
        }
        return Tipo_1.Tipo.VOID;
    };
    OperacionNativa.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        if (this.operadorNativa == OperadorNativa.PARSE) {
            var valor = this.expresion.getValorImplicito(ent, arbol, listaErrores);
            if (typeof (valor) === 'string') {
                if (this.tipo == Tipo_1.Tipo.INT) {
                    return parseInt(valor);
                }
                else if (this.tipo == Tipo_1.Tipo.DOUBLE) {
                    return parseFloat(valor);
                }
                else if (this.tipo == Tipo_1.Tipo.BOOL) {
                    return Boolean(JSON.parse(valor));
                }
                else if (this.tipo == Tipo_1.Tipo.CHAR) {
                    return valor.charCodeAt(0);
                }
                else {
                    //es un error
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'hay un error, no es de un tipo aceptado', this.linea, this.columna));
                }
            }
            else {
                //no es de tipo string
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es un string', this.linea, this.columna));
            }
        }
        else if (this.operadorNativa === OperadorNativa.STRING) {
            var valor_1 = '';
            if (this.expresion instanceof AccesoArray_1.AccesoArray) {
                var contenido_1 = this.expresion.contenido;
                valor_1 = '[';
                var i_1 = 0;
                contenido_1.forEach(function (expr) {
                    valor_1 += expr.getValorImplicito(ent, arbol, listaErrores);
                    if (i_1 == contenido_1.length - 1) {
                        valor_1 += ']';
                    }
                    else {
                        valor_1 += ',';
                    }
                    i_1++;
                });
                return valor_1;
            }
            else {
                valor_1 = this.expresion.getValorImplicito(ent, arbol, listaErrores);
            }
            if (valor_1 === null) {
                return null;
            }
            else {
                return String(valor_1);
            }
        }
        else if (this.operadorNativa === OperadorNativa.TODOUBLE) {
            var valor = this.expresion.getValorImplicito(ent, arbol, listaErrores);
            if (typeof (valor) === 'number') {
                this.isEjecutar = false;
                return valor.toFixed(2);
            }
            else {
                //no es un numero
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es un numero', this.linea, this.columna));
            }
        }
        else if (this.operadorNativa === OperadorNativa.TOINT) {
            var valor = this.expresion.getValorImplicito(ent, arbol, listaErrores);
            if (typeof (valor) === 'number') {
                return Math.floor(valor);
            }
            else {
                //no es un numero
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no es un numero', this.linea, this.columna));
            }
        }
        else if (this.operadorNativa === OperadorNativa.TYPEOF) {
            if (this.expresion instanceof AccesoVariable_1.AccesoVariable) {
                var tipo = this.expresion.getTipo(ent, arbol, listaErrores);
                if (tipo === Tipo_1.Tipo.STRUCT || tipo === Tipo_1.Tipo.TIPO_STRUCT) {
                    return "struct";
                }
                else if (tipo === Tipo_1.Tipo.ARRAY) {
                    return "array";
                }
            }
            var valor = this.expresion.getValorImplicito(ent, arbol, listaErrores);
            return typeof (valor);
        }
        return null;
    };
    OperacionNativa.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        throw new Error("Method not implemented.");
    };
    OperacionNativa.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    OperacionNativa.prototype.getSignoTipo = function (operador) {
        if (operador == Operacion_1.Operador.SUMA) {
            return '+';
        }
        else if (operador == Operacion_1.Operador.RESTA) {
            return '-';
        }
        else if (operador == Operacion_1.Operador.MULTIPLICACION) {
            return '*';
        }
        else if (operador == Operacion_1.Operador.DIVISION) {
            return '/';
        }
        else if (operador == Operacion_1.Operador.MAYOR_QUE) {
            return '>';
        }
        else if (operador == Operacion_1.Operador.MENOR_QUE) {
            return '<';
        }
        return ' ';
    };
    return OperacionNativa;
}());
exports.OperacionNativa = OperacionNativa;

},{"../AST/Tipo":3,"../Objetos/ErrorG":43,"./AccesoArray":4,"./AccesoVariable":7,"./Operacion":12}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParametroReturn = /** @class */ (function () {
    function ParametroReturn(valor, linea, columna) {
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    ParametroReturn.prototype.getTipo = function (ent, arbol, listaErrores) {
        return this.valor.getTipo(ent, arbol, listaErrores);
    };
    ParametroReturn.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        return this.valor.getValorImplicito(ent, arbol, listaErrores);
    };
    ParametroReturn.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    ParametroReturn.prototype.ejecutar = function (ent, arbol) {
    };
    return ParametroReturn;
}());
exports.ParametroReturn = ParametroReturn;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var Primitivo = /** @class */ (function () {
    function Primitivo(valor, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
        this.isFlotante = false;
    }
    Primitivo.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        console.log("Traduciendo Primitivo");
        var tipo = this.getTipo(ent, arbol, []);
        temporales.ultimoTipo = tipo;
        if (tipo == Tipo_1.Tipo.STRING) {
            temporales.ultimoTemp += 1;
            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= H;\n';
            for (var i = 0; i < this.valor.length; i++) {
                var letra = this.valor.substr(i, 1);
                var valLet = letra.charCodeAt();
                resultado3d.codigo3D += '\theap[(int)H] = ' + valLet + ';\n';
                resultado3d.codigo3D += '\tH = H + 1;\n';
                console.log(valLet);
            }
            resultado3d.codigo3D += '\theap[(int)H] = -1;\n';
            resultado3d.codigo3D += '\tH = H + 1;\n';
            return 't' + temporales.ultimoTemp;
        }
        else if (tipo == Tipo_1.Tipo.BOOL) {
            if (this.valor == true) {
                return 1;
            }
            else {
                return 0;
            }
        }
        else {
            return this.valor;
        }
    };
    Primitivo.prototype.getTipo = function (ent, arbol, listaErrores) {
        var valor = this.getValorImplicito(ent, arbol, listaErrores);
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isFlotante) {
                return Tipo_1.Tipo.DOUBLE;
            }
            if (this.isInt(Number(valor))) {
                return Tipo_1.Tipo.INT;
            }
            return Tipo_1.Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo_1.Tipo.NULL;
        }
        return Tipo_1.Tipo.VOID;
    };
    Primitivo.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        if (typeof (this.valor) === 'string') {
            var gramatica = require('../../jison/compilerExpresion/stringExpresion');
            var continuar = false;
            var PAI = 0;
            var PAD = 0;
            var resultado = '';
            var resultados = [];
            var stringNormales = [];
            var ultCcharUsasdo = 0;
            for (var i_1 = 0; i_1 < this.valor.length; i_1++) {
                var letra = this.valor.charAt(i_1);
                if ((letra === '$' || continuar) && i_1 + 1 < this.valor.length) {
                    if (letra == '$') {
                        stringNormales.push(this.valor.substring(ultCcharUsasdo, i_1));
                    }
                    var sig = this.valor.charAt(i_1 + 1);
                    if (sig === '(') {
                        PAI += 1;
                        continuar = true;
                        resultado += sig;
                    }
                    else if (sig === ')') {
                        PAD += 1;
                        resultado += sig;
                        if (PAI === PAD) {
                            continuar = false;
                            resultados.push(resultado);
                            resultado = '';
                            ultCcharUsasdo = i_1 + 2;
                        }
                    }
                    else {
                        resultado += sig;
                        continuar = true;
                        if (PAI === PAD) {
                            if (i_1 + 2 < this.valor.length) {
                                if (this.valor.charAt(i_1 + 2) === ' ') {
                                    continuar = false;
                                    resultados.push(resultado);
                                    resultado = '';
                                    ultCcharUsasdo = i_1 + 2;
                                }
                            }
                            else {
                                continuar = false;
                                resultados.push(resultado);
                                resultado = '';
                                ultCcharUsasdo = i_1 + 2;
                            }
                        }
                    }
                }
                if (i_1 + 1 === this.valor.length) {
                    if (!(ultCcharUsasdo === 0)) {
                        stringNormales.push(this.valor.substring(ultCcharUsasdo, this.valor.length));
                    }
                }
            }
            if (resultados.length > 0) {
                var exprs = [];
                for (var i = 0; i < resultados.length; i++) {
                    var inst = gramatica.parse(resultados[i]);
                    exprs.push(inst);
                }
                var sendValor = '';
                for (var i = 0; i < exprs.length; i++) {
                    sendValor += stringNormales[i] + '' + exprs[i].getValorImplicito(ent, arbol, listaErrores);
                }
                sendValor += stringNormales[stringNormales.length - 1];
                console.log(sendValor);
                return sendValor;
            }
        }
        return this.valor;
    };
    Primitivo.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Primitivo;
}());
exports.Primitivo = Primitivo;

},{"../../jison/compilerExpresion/stringExpresion":45,"../AST/Tipo":3}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
var Ternario = /** @class */ (function () {
    function Ternario(expr1, expr2, expr3, linea, columna, expresion) {
        this.expresion1 = expr1;
        this.expresion2 = expr2;
        this.expresion3 = expr3;
        this.linea = linea;
        this.columna = columna;
    }
    Ternario.prototype.getTipo = function (ent, arbol, listaErrores) {
        var valorExpr1 = this.expresion1.getValorImplicito(ent, arbol, listaErrores);
        if (typeof (valorExpr1) === 'boolean') {
            if (valorExpr1 == true) {
                return this.expresion2.getTipo(ent, arbol, listaErrores);
            }
            else {
                return this.expresion3.getTipo(ent, arbol, listaErrores);
            }
        }
        else {
            // console.log('Error semantico, el valor de la operacion ternaria no es un booleano en la linea '+ this.linea + ' y columna ' + this.columna);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'el valor de la operacion ternaria no es un booleano', this.linea, this.columna));
            return Tipo_1.Tipo.NULL;
        }
    };
    Ternario.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        var tipo = this.expresion1.getTipo(ent, arbol, listaErrores);
        if (tipo === Tipo_1.Tipo.BOOL) {
            var valorExpr1 = this.expresion1.getValorImplicito(ent, arbol, listaErrores);
            if (valorExpr1 == true) {
                return this.expresion2.getValorImplicito(ent, arbol, listaErrores);
            }
            else {
                return this.expresion3.getValorImplicito(ent, arbol, listaErrores);
            }
        }
        else {
            // console.log('Error semantico, el valor de la operacion ternaria no es un booleano en la linea '+ this.linea + ' y columna ' + this.columna);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'el valor de la operacion ternaria no es un booleano', this.linea, this.columna));
            return null;
        }
    };
    Ternario.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    return Ternario;
}());
exports.Ternario = Ternario;

},{"../AST/Tipo":3,"../Objetos/ErrorG":43}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var AccesoArray_1 = require("../Expresiones/AccesoArray");
var AccesoVariable_1 = require("../Expresiones/AccesoVariable");
var Primitivo_1 = require("../Expresiones/Primitivo");
var ErrorG_1 = require("../Objetos/ErrorG");
var Asignacion = /** @class */ (function () {
    function Asignacion(id, linea, columna, expresion) {
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Asignacion.prototype.traducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        if (this.id.length == 1) {
            var id = this.id[0];
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                if (tipo == this.expresion.getTipo(ent, arbol, listaErrores)) {
                    //Asignar al stack
                    var valAsign = this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
                    if (temporales.ultimoTipo == Tipo_1.Tipo.BOOL) {
                        if (temporales.esFuncion) {
                            temporales.ultimoTemp += 1;
                            resultado3d.codigo3D += 't' + temporales.ultimoTemp + '= P +' + (simbol.valor) + ';\n';
                            temporales.ultLiteral += 3;
                            var ultLit = temporales.ultLiteral - 2;
                            resultado3d.codigo3D += '\tif(' + valAsign + ') goto L' + ultLit + ';\n';
                            resultado3d.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
                            resultado3d.codigo3D += '\tL' + ultLit + ':\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = 1;\n';
                            resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
                            resultado3d.codigo3D += '\tL' + (ultLit + 1) + ':\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = 0;\n';
                            resultado3d.codigo3D += '\tL' + (ultLit + 2) + ':\n';
                            temporales.ultLitEscr = (ultLit + 2);
                        }
                        else {
                            temporales.ultLiteral += 3;
                            var ultLit = temporales.ultLiteral - 2;
                            resultado3d.codigo3D += '\tif(' + valAsign + ') goto L' + ultLit + ';\n';
                            resultado3d.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
                            resultado3d.codigo3D += '\tL' + ultLit + ':\n';
                            resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] = 1;\n';
                            resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
                            resultado3d.codigo3D += '\tL' + (ultLit + 1) + ':\n';
                            resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] = 0;\n';
                            resultado3d.codigo3D += '\tL' + (ultLit + 2) + ':\n';
                            temporales.ultLitEscr = (ultLit + 2);
                        }
                    }
                    else {
                        if (temporales.esFuncion) {
                            temporales.ultimoTemp += 1;
                            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= P +' + (simbol.valor) + ';\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] =' + valAsign + ';\n';
                        }
                        else {
                            resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] =' + valAsign + ';\n';
                        }
                    }
                }
                else {
                    console.log('Error semantico, El tipo de la variable (' + tipo + ') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent, arbol, listaErrores) + ') en la linea ' + this.linea + ' y columna ' + this.columna);
                }
            }
            else {
                console.log('Error semantico, no existe la variable ' + id + ' en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
        //TODO: traducir asignacion de array 
        else {
            for (var i = 0; i < (this.id.length - 1); i++) {
                var id = this.id[i];
                if (ent.existe(id)) {
                    var simbol = ent.getSimbolo(id);
                    var tipo = simbol.getTipo(ent, arbol);
                    if (tipo == Tipo_1.Tipo.TIPO_STRUCT) {
                        var atributos = simbol.getValorImplicito(ent, arbol);
                        var idSig = this.id[i + 1];
                        for (var _i = 0, atributos_1 = atributos; _i < atributos_1.length; _i++) {
                            var atributo = atributos_1[_i];
                            if (atributo.id[0] === idSig) {
                                atributo.expresion = this.expresion;
                                break;
                            }
                        }
                    }
                }
                else {
                    console.log('Error semantico, no existe ' + id + ' en la linea ' + this.linea + ' y columna ' + this.columna);
                }
            }
        }
    };
    Asignacion.prototype.ejecutar = function (ent, arbol, listaErrores) {
        if (this.id.length == 1) {
            var id = this.id[0];
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                var tipoExpr = this.expresion.getTipo(ent, arbol, listaErrores);
                if (tipo == tipoExpr || (tipoExpr == Tipo_1.Tipo.INT && tipo == Tipo_1.Tipo.DOUBLE)) {
                    simbol.valor = this.expresion.getValorImplicito(ent, arbol, listaErrores);
                }
                else {
                    // console.log('Error semantico, El tipo de la variable (' + tipo +') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent,arbol) + ') en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'El tipo de la variable (' + this.getNameTipo(tipo) + ') no concuerda con el tipo asignado', this.linea, this.columna));
                }
            }
            else {
                // console.log('Error semantico, no existe la variable ' + id +' en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + id, this.linea, this.columna));
            }
        }
        else {
            var i = 0;
            var id = this.id[i];
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                if (tipo == Tipo_1.Tipo.TIPO_STRUCT) {
                    var atributos = simbol.getValorImplicito(ent, arbol);
                    this.asignacionStruct(i, atributos, ent, arbol, listaErrores);
                }
            }
            else {
                // console.log('Error semantico, no existe ' + id +' en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + id, this.linea, this.columna));
            }
        }
    };
    Asignacion.prototype.getTipo = function () {
        return "asignacion";
    };
    Asignacion.prototype.asignacionStruct = function (i, atributos, ent, arbol, listaErrores) {
        if ((i + 1) >= this.id.length) {
            // console.log("No se encontro");
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'No se encontro el atributo ' + this.id[i], this.linea, this.columna));
            return;
        }
        var idSig = this.id[i + 1];
        var _loop_1 = function () {
            if (atributo.id[0] === idSig) {
                // console.log(atributo.tipo);
                var isStruct_1 = false;
                arbol.structs.forEach(function (struct) {
                    // console.log(struct.id);
                    if (struct.id === atributo.tipo.toString()) {
                        isStruct_1 = true;
                    }
                });
                if (isStruct_1) {
                    // console.log(atributo.expresion);
                    if (atributo.expresion instanceof AccesoVariable_1.AccesoVariable) {
                        atributo.expresion.isAlone = false;
                        // console.log(atributo.expresion.getValorImplicito(ent, arbol));
                        var val1 = atributo.expresion.getValorImplicito(ent, arbol, listaErrores);
                        atributo.expresion.isAlone = true;
                        this_1.asignacionStruct(i + 1, val1, ent, arbol, listaErrores);
                    }
                }
                else {
                    if (this_1.expresion instanceof Primitivo_1.Primitivo || this_1.expresion instanceof AccesoArray_1.AccesoArray) {
                        atributo.expresion = this_1.expresion;
                    }
                    else {
                        var valorC = this_1.expresion.getValorImplicito(ent, arbol, listaErrores);
                        var primitivo = new Primitivo_1.Primitivo(valorC, this_1.expresion.linea, this_1.expresion.columna);
                        atributo.expresion = primitivo;
                    }
                }
                return { value: void 0 };
            }
        };
        var this_1 = this;
        for (var _i = 0, atributos_2 = atributos; _i < atributos_2.length; _i++) {
            var atributo = atributos_2[_i];
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    Asignacion.prototype.getNameTipo = function (tipo) {
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
    return Asignacion;
}());
exports.Asignacion = Asignacion;

},{"../AST/Tipo":3,"../Expresiones/AccesoArray":4,"../Expresiones/AccesoVariable":7,"../Expresiones/Primitivo":16,"../Objetos/ErrorG":43}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var Primitivo_1 = require("../Expresiones/Primitivo");
var ErrorG_1 = require("../Objetos/ErrorG");
var AsignacionArray = /** @class */ (function () {
    function AsignacionArray(id, posicion, linea, columna, expresion) {
        this.id = id;
        this.posicion = posicion;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    AsignacionArray.prototype.traducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                // let valor:Arreglo = simbol.getValorImplicito(ent,arbol);
                var pos = this.posicion.traducir(ent, arbol, resultado3d, temporales, 0);
                var val = this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
                temporales.ultimoTemp += 1;
                var stackPos = temporales.ultimoTemp;
                resultado3d.codigo3D += '\tt' + stackPos + ' = stack[(int)' + simbol.valor + '];\n';
                temporales.ultimoTemp += 1;
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = t' + stackPos + ' + ' + pos + ';\n';
                resultado3d.codigo3D += '\theap[(int) t' + temporales.ultimoTemp + '] =' + val + ';\n';
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable no es del tipo array', this.linea, this.columna));
            }
        }
        else {
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable', this.linea, this.columna));
        }
    };
    AsignacionArray.prototype.ejecutar = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                var pos = this.posicion.getValorImplicito(ent, arbol, listaErrores);
                if (typeof (pos) == 'number') {
                    if (pos >= 0 && pos < valor.length) {
                        if (this.expresion.getTipo(ent, arbol, listaErrores) == valor.tipo) {
                            if (this.expresion instanceof Primitivo_1.Primitivo) {
                                valor.contenido[pos] = this.expresion;
                            }
                            else {
                                var valorC = this.expresion.getValorImplicito(ent, arbol, listaErrores);
                                var primitivo = new Primitivo_1.Primitivo(valorC, this.expresion.linea, this.expresion.columna);
                                valor.contenido[pos] = primitivo;
                            }
                        }
                        else {
                            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no esta en el rango del arreglo', this.linea, this.columna));
                        }
                    }
                    else {
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la posicion declarada no es un numero', this.linea, this.columna));
                    }
                }
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable no es del tipo array', this.linea, this.columna));
            }
        }
        else {
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable', this.linea, this.columna));
        }
    };
    AsignacionArray.prototype.getTipo = function () {
        return "asignacion";
    };
    return AsignacionArray;
}());
exports.AsignacionArray = AsignacionArray;

},{"../AST/Tipo":3,"../Expresiones/Primitivo":16,"../Objetos/ErrorG":43}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// print("hola mundo");
var Break = /** @class */ (function () {
    function Break(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
    Break.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        resultado3D.codigo3D += '\tgoto L' + temporales.ultLiteral + ';\n';
    };
    Break.prototype.ejecutar = function (ent, arbol, listaErrores) {
        return 'ROMPER';
    };
    return Break;
}());
exports.Break = Break;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// print("hola mundo");
var Continue = /** @class */ (function () {
    function Continue(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
    Continue.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Continue.prototype.ejecutar = function (ent, arbol, listaErrores) {
        return 'CONTINUAR';
    };
    return Continue;
}());
exports.Continue = Continue;

},{}],22:[function(require,module,exports){
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
                    if (temporales.esFuncion) {
                        temporales.ultimoTemp += 1;
                        resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= P +' + (temporales.cantidadParametrosFunc) + ';\n';
                        simbol.valor = (temporales.cantidadParametrosFunc);
                        temporales.cantidadParametrosFunc += 1;
                        resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '];\n';
                    }
                    else {
                        resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '];\n';
                    }
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
                        if (temporales.ultimoTipo == Tipo_1.Tipo.BOOL) {
                            if (temporales.esFuncion) {
                                temporales.ultimoTemp += 1;
                                resultado3d.codigo3D += 't' + temporales.ultimoTemp + '= P +' + (temporales.cantidadParametrosFunc) + ';\n';
                                simbol.valor = (temporales.cantidadParametrosFunc);
                                temporales.cantidadParametrosFunc += 1;
                                temporales.ultLiteral += 3;
                                var ultLit = temporales.ultLiteral - 2;
                                resultado3d.codigo3D += '\tif(' + valAsign + ') goto L' + ultLit + ';\n';
                                resultado3d.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
                                resultado3d.codigo3D += '\tL' + ultLit + ':\n';
                                resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = 1;\n';
                                resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
                                resultado3d.codigo3D += '\tL' + (ultLit + 1) + ':\n';
                                resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = 0;\n';
                                resultado3d.codigo3D += '\tL' + (ultLit + 2) + ':\n';
                                temporales.ultLitEscr = (ultLit + 2);
                            }
                            else {
                                temporales.ultLiteral += 3;
                                var ultLit = temporales.ultLiteral - 2;
                                resultado3d.codigo3D += '\tif(' + valAsign + ') goto L' + ultLit + ';\n';
                                resultado3d.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
                                resultado3d.codigo3D += '\tL' + ultLit + ':\n';
                                resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] = 1;\n';
                                resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
                                resultado3d.codigo3D += '\tL' + (ultLit + 1) + ':\n';
                                resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] = 0;\n';
                                resultado3d.codigo3D += '\tL' + (ultLit + 2) + ':\n';
                                temporales.ultLitEscr = (ultLit + 2);
                            }
                        }
                        else {
                            if (temporales.esFuncion) {
                                temporales.ultimoTemp += 1;
                                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= P +' + (temporales.cantidadParametrosFunc) + ';\n';
                                simbol.valor = (temporales.cantidadParametrosFunc);
                                temporales.cantidadParametrosFunc += 1;
                                resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] =' + valAsign + ';\n';
                            }
                            else {
                                resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] =' + valAsign + ';\n';
                            }
                        }
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
            if (ent.existeEnActual(id)) {
                // console.log('Id '+ id +' ya existe');
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable ' + id + ' ya existe', _this.linea, _this.columna));
            }
            else {
                if (_this.expresion == null) {
                    var simbol = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, _this.getValDefault());
                    ent.agregar(id, simbol);
                }
                else {
                    var tipoExpr = _this.expresion.getTipo(ent, arbol, listaErrores);
                    if (tipoExpr == _this.tipo || (tipoExpr == Tipo_1.Tipo.INT && _this.tipo == Tipo_1.Tipo.DOUBLE)) {
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
            return 0;
        }
        else if (this.tipo == Tipo_1.Tipo.CHAR) {
            return 'a';
        }
        else if (this.tipo == Tipo_1.Tipo.DOUBLE) {
            return 0.0;
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

},{"../AST/Simbolo":2,"../AST/Tipo":3,"../Objetos/ErrorG":43}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
var AccesoArray_1 = require("../Expresiones/AccesoArray");
var Arreglo_1 = require("../Objetos/Arreglo");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var DeclaracionArray = /** @class */ (function () {
    function DeclaracionArray(id, tipo, dimensiones, linea, columna, expresion) {
        this.id = id;
        this.tipo = tipo;
        this.dimensiones = dimensiones;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    DeclaracionArray.prototype.traducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        var _this = this;
        this.id.forEach(function (id) {
            if (!ent.existe(id)) {
                if (_this.dimensiones.length == 0) {
                    if (_this.expresion == null) {
                        // let valor:Arreglo = new Arreglo(this.tipo,0,0,[],this.linea,this.columna);
                        var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, temporales.ultstack);
                        temporales.ultstack += 1;
                        ent.agregar(id, simbol);
                        resultado3d.codigo3D += 'stack[(int)' + simbol.valor + '];\n';
                    }
                    else {
                        if (_this.expresion instanceof AccesoArray_1.AccesoArray) {
                            // let valor = this.expresion.getValorImplicito(ent, chejoharbol,listaErrores);
                            // if (valor == null) {
                            //     valor = [];
                            // }
                            //let valorSimbolo:Arreglo = new Arreglo(this.tipo,valor.length,valor.length, valor,this.linea,this.columna);
                            var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, temporales.ultstack);
                            temporales.ultstack += 1;
                            ent.agregar(id, simbol);
                            //asignar los valores al stack
                            var valor = _this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
                            console.log('temp array: ');
                            console.log(valor);
                            resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] =' + valor + ';\n';
                        }
                        else {
                            //    console.log('Error semantico, la asignacion no es un arreglo de datos en la linea '+ this.linea + ' y columna ' + this.columna); 
                            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la asignacion no es un arreglo de datos', _this.linea, _this.columna));
                        }
                    }
                }
            }
            else {
                // error, si existe
            }
        });
    };
    DeclaracionArray.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var _this = this;
        // console.log('ejecutado...'+ this.id);
        this.id.forEach(function (id) {
            if (!ent.existeEnActual(id)) {
                if (_this.dimensiones.length == 0) {
                    if (_this.expresion == null) {
                        var valor = new Arreglo_1.Arreglo(_this.tipo, 0, 0, [], _this.linea, _this.columna);
                        var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, valor);
                        ent.agregar(id, simbol);
                    }
                    else {
                        if (_this.expresion instanceof AccesoArray_1.AccesoArray) {
                            var valor = _this.expresion.getValorImplicito(ent, arbol, listaErrores);
                            if (valor == null) {
                                valor = [];
                            }
                            var valorSimbolo = new Arreglo_1.Arreglo(_this.tipo, valor.length, valor.length, valor, _this.linea, _this.columna);
                            if (valorSimbolo.comprobarTipo(ent, arbol, listaErrores)) {
                                var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, valorSimbolo);
                                ent.agregar(id, simbol);
                            }
                        }
                        else {
                            //    console.log('Error semantico, la asignacion no es un arreglo de datos en la linea '+ this.linea + ' y columna ' + this.columna); 
                            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la asignacion no es un arreglo de datos', _this.linea, _this.columna));
                        }
                    }
                }
                else if (_this.dimensiones.length == 1) {
                    if (_this.expresion == null) {
                        var valor = new Arreglo_1.Arreglo(_this.tipo, 0, 0, [], _this.linea, _this.columna);
                        var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, valor);
                        ent.agregar(id, simbol);
                    }
                    else {
                        if (_this.expresion instanceof AccesoArray_1.AccesoArray) {
                            var valor = _this.expresion.getValorImplicito(ent, arbol, listaErrores);
                            if (valor == null) {
                                valor = [];
                            }
                            var dim = _this.dimensiones[0].getValorImplicito(ent, arbol, listaErrores);
                            if (typeof (dim) === 'number') {
                                if (dim === valor.length) {
                                    var valorSimbolo = new Arreglo_1.Arreglo(_this.tipo, valor.length, valor.length, valor, _this.linea, _this.columna);
                                    if (valorSimbolo.comprobarTipo(ent, arbol, listaErrores)) {
                                        var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, valorSimbolo);
                                        ent.agregar(id, simbol);
                                    }
                                }
                                else {
                                    //no tienen las mismas dimensiones
                                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'las dimesiones declaradas no es lo mismo al contenido', _this.linea, _this.columna));
                                }
                            }
                            else {
                                //la dimension no es un numero
                                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la diemnsion declarada no es un numero', _this.linea, _this.columna));
                            }
                        }
                        else {
                            //    console.log('Error semantico, la asignacion no es un arreglo de datos en la linea '+ this.linea + ' y columna ' + this.columna); 
                            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la asignacion no es un arreglo de datos', _this.linea, _this.columna));
                        }
                    }
                }
                else {
                    // console.log('error semantico, dimension de la declaracion del arreglo no conocido, en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'dimension de la declaracion del arreglo no es una expresion conocida', _this.linea, _this.columna));
                }
            }
            else {
                // console.log('Error semantico, ya existe el id: '+ id + ' en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'ya existe el id: ' + id, _this.linea, _this.columna));
            }
        });
    };
    DeclaracionArray.prototype.getTipo = function () {
        return "declaracion";
    };
    DeclaracionArray.prototype.getValDefault = function () {
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
    return DeclaracionArray;
}());
exports.DeclaracionArray = DeclaracionArray;

},{"../AST/Simbolo":2,"../AST/Tipo":3,"../Expresiones/AccesoArray":4,"../Objetos/Arreglo":42,"../Objetos/ErrorG":43}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
var FuncionReturn_1 = require("./FuncionReturn");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var DeclaracionStruct = /** @class */ (function () {
    function DeclaracionStruct(id, tipo, linea, columna, expresion) {
        this.id = id;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    DeclaracionStruct.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    DeclaracionStruct.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var _this = this;
        if (ent.existe(this.tipo)) {
            if (this.expresion instanceof FuncionReturn_1.FuncionReturn) { //evalua que se este haciendo una instancia de la estructura
                //verificar que tengan la misma cantidad de parametros
                var struct = ent.getSimbolo(this.tipo);
                if (struct.getTipo(ent, arbol) === Tipo_1.Tipo.STRUCT) {
                    var structVars = struct.getValorImplicito(ent, arbol);
                    var parametros_1 = this.expresion.parametros;
                    //verificar
                    if (!ent.existe(this.id)) {
                        if (structVars.length == parametros_1.length) {
                            var error_1 = false;
                            structVars.forEach(function (declaracion, index, array) {
                                var param = parametros_1[index];
                                // console.log("--index---------" + index);
                                // console.log(declaracion.tipo);
                                // console.log(param.getTipo(ent,arbol));
                                var tipoParam = param.getTipo(ent, arbol, listaErrores);
                                if (tipoParam == Tipo_1.Tipo.TIPO_STRUCT) {
                                    declaracion.expresion = param.valor;
                                }
                                else if (declaracion.tipo === tipoParam || tipoParam === Tipo_1.Tipo.NULL) {
                                    // console.log("Si son compatibles");
                                    declaracion.expresion = param;
                                }
                                else {
                                    // console.log('Error semantico, El parametro ' + param.getValorImplicito(ent, arbol)  + ' no coincide con el tipo del atributo de la estructura en la linea '+ this.linea + ' y columna ' + this.columna);
                                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'El parametro ' + param.getValorImplicito(ent, arbol, listaErrores) + ' no coincide con el tipo del atributo de la estructura', _this.linea, _this.columna));
                                    error_1 = true;
                                }
                            });
                            if (!error_1) { //ingresamos la variable
                                //let entorno: Entorno = new Entorno(ent);//puede que no necesite esto
                                var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.TIPO_STRUCT, this.id, this.linea, this.columna, structVars);
                                simbol.setTipoStruct(this.tipo);
                                ent.agregar(this.id, simbol);
                            }
                            else {
                                // console.log('No se ingreso la variable');
                            }
                        }
                        else {
                            // console.log('Error semantico, La cantidad de parametros no concuerdan con la estructura en la linea '+ this.linea + ' y columna ' + this.columna);
                            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'La cantidad de parametros no concuerdan con la estructura', this.linea, this.columna));
                        }
                    }
                    else {
                        // console.log('Error semantico, La variable '+ this.id +' ya existe en el entorno, en la linea '+ this.linea + ' y columna ' + this.columna)
                        listaErrores.push(new ErrorG_1.ErrorG('semantico', 'La variable ' + this.id + ' ya existe en el entorno', this.linea, this.columna));
                    }
                }
                else {
                    // console.log('Error semantico, El tipo declarado no es un struct en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG_1.ErrorG('semantico', 'El tipo declarado no es un struct', this.linea, this.columna));
                }
            }
            else {
                // console.log('Error semantico, no se esta inicializando la estructura en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no se esta inicializando la estructura', this.linea, this.columna));
            }
        }
        else {
            // console.log('Error semantico, no exite la Estructura '+ this.tipo+' en la linea '+ this.linea + ' y columna ' + this.columna);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no exite la Estructura ' + this.tipo, this.linea, this.columna));
        }
    };
    DeclaracionStruct.prototype.getValDefault = function () {
        // if (this.tipo == Tipo.STRING) {
        //     return "undefined";
        // }else if (this.tipo == Tipo.BOOL){
        //     return true;
        // }else if (this.tipo == Tipo.INT){
        //     return 1;
        // }else if (this.tipo == Tipo.CHAR){
        //     return 'a';
        // }else if (this.tipo == Tipo.DOUBLE) {
        //     return 1.0;
        // }else{
        //     return null;
        // }
    };
    DeclaracionStruct.prototype.getTipo = function () {
        return "declaracion";
    };
    return DeclaracionStruct;
}());
exports.DeclaracionStruct = DeclaracionStruct;

},{"../AST/Simbolo":2,"../AST/Tipo":3,"../Objetos/ErrorG":43,"./FuncionReturn":29}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entorno_1 = require("../AST/Entorno");
var DoWhile = /** @class */ (function () {
    function DoWhile(linea, columna, instrucciones, expresion) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion = expresion;
    }
    DoWhile.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        var entornolocal = new Entorno_1.Entorno(ent);
        if (temporales.ultLiteral == 0) {
            resultado3D.codigo3D += '\tL' + temporales.ultLiteral + ":\n";
        }
        var ulLit = temporales.ultLiteral;
        temporales.ultLiteral += 1;
        this.instrucciones.forEach(function (element) {
            element.traducir(entornolocal, arbol, resultado3D, temporales, listaErrores);
        });
        var valAsign = this.expresion.traducir(entornolocal, arbol, resultado3D, temporales, 0);
        resultado3D.codigo3D += '\tif(' + valAsign + ') goto L' + ulLit + ';\n';
    };
    DoWhile.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var entornolocal = new Entorno_1.Entorno(ent);
        var realizar = this.expresion.getValorImplicito(entornolocal, arbol, listaErrores);
        var contSalir = 0;
        do {
            for (var _i = 0, _a = this.instrucciones; _i < _a.length; _i++) {
                var element = _a[_i];
                var valR = element.ejecutar(entornolocal, arbol, listaErrores);
                if (valR == 'RETORNAR') {
                    ent.valorReturn = entornolocal.valorReturn;
                    return 'RETORNAR';
                }
                else if (valR == 'ROMPER') {
                    return;
                }
                else if (valR == 'CONTINUAR') {
                    break;
                }
            }
            realizar = this.expresion.getValorImplicito(entornolocal, arbol, listaErrores);
            if (contSalir == 5000) {
                realizar = false;
            }
            contSalir++;
        } while (realizar);
    };
    return DoWhile;
}());
exports.DoWhile = DoWhile;

},{"../AST/Entorno":1}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entorno_1 = require("../AST/Entorno");
var ErrorG_1 = require("../Objetos/ErrorG");
var For = /** @class */ (function () {
    function For(linea, columna, instrucciones, declAsign, expresion1, expresion2) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.declAsign = declAsign;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }
    For.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        var entornolocal = new Entorno_1.Entorno(ent);
        if (temporales.ultLiteral == 0) {
            resultado3D.codigo3D += '\tL' + temporales.ultLiteral + ":\n";
            temporales.ultLitEscr = 0;
        }
        this.declAsign.traducir(entornolocal, arbol, resultado3D, temporales);
        temporales.ultLiteral += 3; //Cuantos literales va a utilizar        
        var ulLit = temporales.ultLiteral - 2;
        resultado3D.codigo3D += '\tL' + (ulLit) + ':\n';
        var valAsign = this.expresion1.traducir(entornolocal, arbol, resultado3D, temporales, 0);
        resultado3D.codigo3D += '\tif(' + valAsign + ') goto L' + (ulLit + 1) + ';\n';
        resultado3D.codigo3D += '\tgoto L' + (ulLit + 2) + ';\n';
        resultado3D.codigo3D += '\tL' + (ulLit + 1) + ':\n';
        //Traducir instrucciones
        this.instrucciones.forEach(function (element) {
            element.traducir(entornolocal, arbol, resultado3D, temporales, listaErrores);
        });
        //Traducir el incremento o decremento
        var id = this.expresion2.op_izquierda.getId();
        if (entornolocal.existe(id)) {
            var simbol = entornolocal.getSimbolo(id);
            resultado3D.codigo3D += '\tt' + temporales.ultimoTemp + '= ' + 'stack[(int)' + simbol.valor + ']' + ';\n';
            temporales.ultimoTemp += 1;
            resultado3D.codigo3D += '\tt' + (temporales.ultimoTemp - 1) + '= ' + 't' + (temporales.ultimoTemp - 1) + ' + 1;\n';
            resultado3D.codigo3D += '\tstack[(int)' + simbol.valor + '] = t' + (temporales.ultimoTemp - 1) + ';\n';
            simbol.valor;
        }
        else {
            console.log('Error semantico, no existe la variable ' + id + 'en la linea ' + this.linea + ' y columna ' + this.columna);
        }
        //Traducir el regreso
        resultado3D.codigo3D += '\tgoto L' + (ulLit) + ';\n';
        resultado3D.codigo3D += '\tL' + (ulLit + 2) + ':\n';
        temporales.ultLitEscr = ulLit + 2;
    };
    For.prototype.ejecutar = function (ent, arbol, listaErrores) {
        console.log('ejecutado...fornormal');
        var entornolocal = new Entorno_1.Entorno(ent);
        this.declAsign.ejecutar(entornolocal, arbol);
        //expresion 1 es la que hay que validar 
        console.log("empezando el while  en for");
        var realizar = true;
        while (this.expresion1.getValorImplicito(entornolocal, arbol, listaErrores) == true) {
            //Realizar instrucciones
            for (var _i = 0, _a = this.instrucciones; _i < _a.length; _i++) {
                var element = _a[_i];
                var valR = element.ejecutar(entornolocal, arbol, listaErrores);
                if (valR == 'RETORNAR') {
                    ent.valorReturn = entornolocal.valorReturn;
                    return 'RETORNAR';
                }
                else if (valR == 'ROMPER') {
                    return;
                }
                else if (valR == 'CONTINUAR') {
                    break;
                }
            }
            //Sumar o realizar la expresion2            
            //Primero se obtiene la operacion;            
            var valAsig = this.expresion2.getValorImplicito(entornolocal, arbol);
            //Luego se obtiene el id de la operacion y se asigna el valor de la operacion; 
            var id = this.expresion2.op_izquierda.getId();
            if (entornolocal.existe(id)) {
                var simbol = entornolocal.getSimbolo(id);
                simbol.valor = valAsig;
            }
            else {
                // console.log('Error semantico, no existe la variable ' + id +'en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + id, this.linea, this.columna));
            }
        }
    };
    return For;
}());
exports.For = For;

},{"../AST/Entorno":1,"../Objetos/ErrorG":43}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entorno_1 = require("../AST/Entorno");
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
var ArrbegEnd_1 = require("../Expresiones/ArrbegEnd");
var Primitivo_1 = require("../Expresiones/Primitivo");
var ErrorG_1 = require("../Objetos/ErrorG");
var Asignacion_1 = require("./Asignacion");
var CasoForIn;
(function (CasoForIn) {
    CasoForIn[CasoForIn["IDVAR"] = 0] = "IDVAR";
    CasoForIn[CasoForIn["ARRBEGEND"] = 1] = "ARRBEGEND";
    CasoForIn[CasoForIn["ARRAY"] = 2] = "ARRAY";
    CasoForIn[CasoForIn["NULL"] = 3] = "NULL";
})(CasoForIn = exports.CasoForIn || (exports.CasoForIn = {}));
var Forin = /** @class */ (function () {
    function Forin(linea, columna, instrucciones, expresion1, expresion2) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }
    Forin.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Forin.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var variable = this.expresion1;
        var condicion = this.expresion2;
        var entNuevo = new Entorno_1.Entorno(ent);
        var casoForIn = CasoForIn.NULL;
        //variables nulos 
        var condicionArreglo = [];
        //configurando la declaracion
        var tipoVariable = Tipo_1.Tipo.NULL;
        //IDVAR
        //[]
        //array[]
        if (condicion instanceof ArrbegEnd_1.ArrbegEnd) {
            //array[]
            casoForIn = CasoForIn.ARRBEGEND;
            condicion.isAlone = false;
            tipoVariable = condicion.getTipo(ent, arbol, listaErrores);
            condicion.isAlone = true;
        }
        else if (typeof (condicion) === 'string') {
            //IDVAR
            if (ent.existe(condicion)) {
                casoForIn = CasoForIn.IDVAR;
                var simbol = ent.getSimbolo(condicion);
                tipoVariable = simbol.getTipo(ent, arbol);
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + condicion, this.linea, this.columna));
            }
        }
        else {
            //[]            
            condicionArreglo = condicion;
            if (condicionArreglo.length > 0) {
                casoForIn = CasoForIn.ARRAY;
                tipoVariable = condicionArreglo[0].getTipo(ent, arbol, listaErrores);
            }
            else {
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'El arreglo esta vacio ', this.linea, this.columna));
            }
        }
        // //@ts-ignore
        // let declaraVariable: Declaracion = new Declaracion(variables,Tipo.STRING,this.linea,this.columna,null);
        if (!entNuevo.existeEnActual(variable)) {
            var simbol = new Simbolo_1.Simbolo(tipoVariable, variable, this.linea, this.columna, null);
            entNuevo.agregar(variable, simbol);
        }
        else {
            console.log('anda medio raro que si exista');
        }
        var isTerminado = false;
        switch (casoForIn) {
            case CasoForIn.ARRAY: {
                for (var _i = 0, condicionArreglo_1 = condicionArreglo; _i < condicionArreglo_1.length; _i++) {
                    var atributo = condicionArreglo_1[_i];
                    var valor = atributo.getValorImplicito(ent, arbol, listaErrores);
                    var expr = new Primitivo_1.Primitivo(valor, this.linea, this.columna);
                    var variables = [];
                    variables.push(variable);
                    var asignar = new Asignacion_1.Asignacion(variables, this.linea, this.columna, expr);
                    asignar.ejecutar(entNuevo, arbol, listaErrores);
                    for (var _a = 0, _b = this.instrucciones; _a < _b.length; _a++) {
                        var instruccion = _b[_a];
                        instruccion.ejecutar(entNuevo, arbol, listaErrores);
                    }
                }
                break;
            }
            case CasoForIn.IDVAR: {
                var simbol = ent.getSimbolo(condicion);
                var valor = simbol.getValorImplicito(ent, arbol);
                for (var i = 0; i < valor.length; i++) {
                    var letra = valor.substr(i, 1);
                    var variables = [];
                    variables.push(variable);
                    var expr = new Primitivo_1.Primitivo(letra, this.linea, this.columna);
                    var asignar = new Asignacion_1.Asignacion(variables, this.linea, this.columna, expr);
                    asignar.ejecutar(entNuevo, arbol, listaErrores);
                    for (var _c = 0, _d = this.instrucciones; _c < _d.length; _c++) {
                        var instruccion = _d[_c];
                        instruccion.ejecutar(entNuevo, arbol, listaErrores);
                    }
                }
                break;
            }
            case CasoForIn.ARRBEGEND: {
                if (condicion instanceof ArrbegEnd_1.ArrbegEnd) {
                    var content = condicion.getListaDatos(ent, arbol, listaErrores);
                    for (var _e = 0, content_1 = content; _e < content_1.length; _e++) {
                        var atributo = content_1[_e];
                        var valor = atributo.getValorImplicito(ent, arbol, listaErrores);
                        var expr = new Primitivo_1.Primitivo(valor, this.linea, this.columna);
                        var variables = [];
                        variables.push(variable);
                        var asignar = new Asignacion_1.Asignacion(variables, this.linea, this.columna, expr);
                        asignar.ejecutar(entNuevo, arbol, listaErrores);
                        for (var _f = 0, _g = this.instrucciones; _f < _g.length; _f++) {
                            var instruccion = _g[_f];
                            instruccion.ejecutar(entNuevo, arbol, listaErrores);
                        }
                    }
                }
                break;
            }
            default:
                break;
        }
    };
    Forin.prototype.getValDefault = function (tipo) {
        if (tipo == Tipo_1.Tipo.STRING) {
            return "undefined";
        }
        else if (tipo == Tipo_1.Tipo.BOOL) {
            return true;
        }
        else if (tipo == Tipo_1.Tipo.INT) {
            return 1;
        }
        else if (tipo == Tipo_1.Tipo.CHAR) {
            return 'a';
        }
        else if (tipo == Tipo_1.Tipo.DOUBLE) {
            return 1.0;
        }
        else {
            return null;
        }
    };
    return Forin;
}());
exports.Forin = Forin;

},{"../AST/Entorno":1,"../AST/Simbolo":2,"../AST/Tipo":3,"../Expresiones/ArrbegEnd":8,"../Expresiones/Primitivo":16,"../Objetos/ErrorG":43,"./Asignacion":18}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entorno_1 = require("../AST/Entorno");
var Tipo_1 = require("../AST/Tipo");
var Declaracion_1 = require("./Declaracion");
var ErrorG_1 = require("../Objetos/ErrorG");
var Primitivo_1 = require("../Expresiones/Primitivo");
var Simbolo_1 = require("../AST/Simbolo");
var Funcion = /** @class */ (function () {
    function Funcion(nombrefuncion, tipoFuncion, linea, columna, instrucciones, parametros) {
        if (parametros === void 0) { parametros = []; }
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.tipoFuncion = tipoFuncion;
        this.parametros = parametros;
        this.parametrosR = [];
    }
    Funcion.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        var entornoGlobal = new Entorno_1.Entorno(ent);
        if (this.nombrefuncion == "main") {
            temporales.esFuncion = false;
            for (var _i = 0, _a = this.instrucciones; _i < _a.length; _i++) {
                var element = _a[_i];
                element.traducir(entornoGlobal, arbol, resultado3D, temporales, listaErrores);
            }
        }
        else {
            //Traducir segun funcion
            temporales.esFuncion = true;
            temporales.cantidadParametrosFunc = this.parametros.length + 1;
            //Traducir traer parametros
            this.declararParametrosTraducir(entornoGlobal, arbol, resultado3D, temporales, listaErrores);
            //Traducir completo
            for (var _b = 0, _c = this.instrucciones; _b < _c.length; _b++) {
                var element = _c[_b];
                element.traducir(entornoGlobal, arbol, resultado3D, temporales, listaErrores);
            }
        }
        /*
        this.instrucciones.forEach((element:Instruccion) => {
            element.traducir(entornoGlobal,arbol,resultado3D,temporales,listaErrores);
        })
        */
    };
    Funcion.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var entornoGlobal = new Entorno_1.Entorno(ent);
        console.log("Insertando nombreEntorno" + this.nombrefuncion);
        entornoGlobal.nombreEntorno = this.nombrefuncion;
        //Declarar todos los parametros
        this.declararParametrosReturn(entornoGlobal, arbol, listaErrores);
        //recorro todas las raices  RECURSIVA
        for (var _i = 0, _a = this.instrucciones; _i < _a.length; _i++) {
            var element = _a[_i];
            var valR = element.ejecutar(entornoGlobal, arbol, listaErrores);
            if (valR == 'RETORNAR') {
                console.log('VAl return Funcion');
                ent.valorReturn = entornoGlobal.valorReturn;
                console.log(ent.valorReturn);
                break;
            }
        }
    };
    Funcion.prototype.getTipo = function () {
        return "funcion";
    };
    Funcion.prototype.setParametrosReturn = function (parametrosR) {
        this.parametrosR = parametrosR;
    };
    Funcion.prototype.declararParametrosReturn = function (ent, arbol, listaErrores) {
        try {
            for (var i = 0; i < this.parametros.length; i++) {
                var parametro = this.parametros[i];
                var parametroR = this.parametrosR[i];
                if (parametroR.getTipo(ent, arbol, listaErrores) == parametro.tipoParametro) {
                    //id:Array<string>,tipo:Tipo, linea:number, columna:number,expresion:Expresion                                        
                    var declPar = new Declaracion_1.Declaracion([parametro.id], parametro.tipoParametro, this.linea, this.columna, parametroR.valor);
                    declPar.ejecutar(ent, arbol, listaErrores);
                }
            }
        }
        catch (error) {
            // console.log("Error al declarar un parametro");
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error al declarar un parametro', this.linea, this.columna));
        }
    };
    Funcion.prototype.declararParametrosReturnTraducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        try {
            for (var i = 0; i < this.parametros.length; i++) {
                var parametro = this.parametros[i];
                var exp = new Primitivo_1.Primitivo(0, parametro.linea, parametro.columna);
                if (parametro.tipoParametro == Tipo_1.Tipo.BOOL) {
                    exp = new Primitivo_1.Primitivo(true, parametro.linea, parametro.columna);
                }
                else if (parametro.tipoParametro == Tipo_1.Tipo.INT) {
                    exp = new Primitivo_1.Primitivo(0, parametro.linea, parametro.columna);
                }
                else if (parametro.tipoParametro == Tipo_1.Tipo.DOUBLE) {
                    exp = new Primitivo_1.Primitivo(0, parametro.linea, parametro.columna);
                }
                else if (parametro.tipoParametro == Tipo_1.Tipo.STRING) {
                    exp = new Primitivo_1.Primitivo('', parametro.linea, parametro.columna);
                }
                else if (parametro.tipoParametro == Tipo_1.Tipo.CHAR) {
                    exp = new Primitivo_1.Primitivo('', parametro.linea, parametro.columna);
                }
                var declPar = new Declaracion_1.Declaracion([parametro.id], parametro.tipoParametro, this.linea, this.columna, exp);
                declPar.traducir(ent, arbol, resultado3d, temporales, listaErrores);
            }
        }
        catch (error) {
            // console.log("Error al declarar un parametro");
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'Error al declarar un parametro', this.linea, this.columna));
        }
    };
    Funcion.prototype.declararParametrosTraducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        for (var i = 0; i < this.parametros.length; i++) {
            var parametro = this.parametros[i];
            var id = parametro.id;
            var simbol = new Simbolo_1.Simbolo(parametro.tipoParametro, id, parametro.linea, parametro.columna, (i + 1));
            ent.agregar(id, simbol);
        }
    };
    return Funcion;
}());
exports.Funcion = Funcion;

},{"../AST/Entorno":1,"../AST/Simbolo":2,"../AST/Tipo":3,"../Expresiones/Primitivo":16,"../Objetos/ErrorG":43,"./Declaracion":22}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FuncionReturn = /** @class */ (function () {
    function FuncionReturn(nombrefuncion, linea, columna, parametros) {
        if (parametros === void 0) { parametros = []; }
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.parametros = parametros;
    }
    FuncionReturn.prototype.traducir = function (ent, arbol, resultado3d, temporales, listaErrores) {
        var funciones = arbol.funciones;
        var temporalReturn = '';
        for (var _i = 0, funciones_1 = funciones; _i < funciones_1.length; _i++) {
            var element = funciones_1[_i];
            if (this.nombrefuncion == element.nombrefuncion) {
                if (temporales.esFuncion) {
                    //Asignar parametros
                    var cont = 0;
                    for (var _a = 0, _b = this.parametros; _a < _b.length; _a++) {
                        var parametro = _b[_a];
                        var valAsign = parametro.valor.traducir(ent, arbol, resultado3d, temporales, 0);
                        if (cont == 0) {
                            temporales.ultimoTemp += 1;
                            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = P + ' + (temporales.ultstack + 4) + ';\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = ' + valAsign + ';\n';
                        }
                        else {
                            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = ' + temporales.ultimoTemp + ' + 1;\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = ' + valAsign + ';\n';
                        }
                    }
                    //Llamar a la funcion
                    resultado3d.codigo3D += '\tP = P + ' + (temporales.ultstack + 3) + ';\n';
                    resultado3d.codigo3D += '\t' + this.nombrefuncion + '();\n';
                    temporales.ultimoTemp += 1;
                    resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = stack[(int)P];\n';
                    resultado3d.codigo3D += '\tP = P - ' + (temporales.ultstack + 3) + ';\n'; // en P insertare el return y lo parametros en P +1
                    temporalReturn = 't' + temporales.ultimoTemp;
                }
                else {
                    //let ultTemp = temporales.ultimoTemp;
                    //Asignar parametros
                    var cont = 0;
                    for (var _c = 0, _d = this.parametros; _c < _d.length; _c++) {
                        var parametro = _d[_c];
                        var valAsign = parametro.valor.traducir(ent, arbol, resultado3d, temporales, 0);
                        if (cont == 0) {
                            temporales.ultimoTemp += 1;
                            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = P + ' + (temporales.ultstack + 2) + ';\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = ' + valAsign + ';\n';
                        }
                        else {
                            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = ' + temporales.ultimoTemp + ' + 1;\n';
                            resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = ' + valAsign + ';\n';
                        }
                    }
                    //Llamar a la funcion
                    resultado3d.codigo3D += '\tP = P + ' + (temporales.ultstack + 1) + ';\n';
                    resultado3d.codigo3D += '\t' + this.nombrefuncion + '();\n';
                    temporales.ultimoTemp += 1;
                    resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = stack[(int)P];\n';
                    resultado3d.codigo3D += '\tP = P - ' + (temporales.ultstack + 1) + ';\n'; // en P insertare el return y lo parametros en P +1
                    temporalReturn = 't' + temporales.ultimoTemp;
                }
                //resultado3d.codigo3D += '\tstack[(int)t'+temporales.ultimoTemp+'] = '+valAsign+';\n';
                break;
            }
        }
        return temporalReturn;
    };
    FuncionReturn.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var funciones = arbol.funciones;
        for (var _i = 0, funciones_2 = funciones; _i < funciones_2.length; _i++) {
            var element = funciones_2[_i];
            if (this.nombrefuncion == element.nombrefuncion) {
                element.setParametrosReturn(this.parametros);
                element.ejecutar(ent, arbol, listaErrores);
                return ent.valorReturn; // Retornar el valor que retorna la funcion ejecutar
            }
        }
    };
    FuncionReturn.prototype.getTipo = function (ent, arbol, listaErrores) {
        var funciones = arbol.funciones;
        for (var _i = 0, funciones_3 = funciones; _i < funciones_3.length; _i++) {
            var element = funciones_3[_i];
            if (this.nombrefuncion == element.nombrefuncion) {
                return element.tipoFuncion;
            }
        }
    };
    FuncionReturn.prototype.getValorImplicito = function (ent, arbol, listaErrores) {
        var funciones = arbol.funciones;
        for (var _i = 0, funciones_4 = funciones; _i < funciones_4.length; _i++) {
            var element = funciones_4[_i];
            if (this.nombrefuncion == element.nombrefuncion) {
                element.setParametrosReturn(this.parametros);
                element.ejecutar(ent, arbol, listaErrores);
                return ent.valorReturn; // Retornar el valor que retorna la funcion ejecutar
            }
        }
    };
    return FuncionReturn;
}());
exports.FuncionReturn = FuncionReturn;

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GraficarTS = /** @class */ (function () {
    function GraficarTS(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
    GraficarTS.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        //Traducri
    };
    GraficarTS.prototype.ejecutar = function (ent, arbol, listaErrores) {
        console.log('Ejecutando grafica');
        var tablaSimbolos = document.getElementById('tabla-simbolos');
        for (var e = ent; e != null; e = e.anterior) {
            var tabla = e.tabla;
            var cont_1 = 0;
            for (var key in tabla) {
                var simbolo = tabla[key];
                var tipoSim = simbolo.getTipo(ent, arbol);
                var entorno = e.nombreEntorno;
                if (entorno == '') {
                    entorno = 'global';
                }
                var valorfila = '<td>' + 'variable' + '</td><td>' + simbolo.indentificador + '</td><td>' + tipoSim + '</td><td>' + simbolo.linea + '</td><td>'
                    + simbolo.columna + '</td><td>' + cont_1 + '</td><td>' + entorno + '</td><td>' + simbolo.valor + '</td><td>';
                tablaSimbolos.insertRow(-1).innerHTML = valorfila;
                cont_1++;
            }
        }
        var funciones = arbol.funciones;
        var cont = 0;
        for (var _i = 0, funciones_1 = funciones; _i < funciones_1.length; _i++) {
            var funcion = funciones_1[_i];
            var valorfila = '<td>' + 'variable' + '</td><td>' + funcion.nombrefuncion + '</td><td>' + funcion.tipoFuncion + '</td><td>' + funcion.linea + '</td><td>'
                + funcion.columna + '</td><td>' + cont + '</td><td>' + 'global' + '</td><td>' + '' + '</td><td>';
            tablaSimbolos.insertRow(-1).innerHTML = valorfila;
            cont++;
        }
    };
    GraficarTS.prototype.getTipoFun = function () {
    };
    GraficarTS.prototype.getTipo = function () {
        return "graficarTS";
    };
    return GraficarTS;
}());
exports.GraficarTS = GraficarTS;

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entorno_1 = require("../AST/Entorno");
var If = /** @class */ (function () {
    function If(linea, columna, condicion, instrucciones, sinos, tipo) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.condicion = condicion;
        this.sinos = sinos;
        this.tipo = tipo;
    }
    If.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        var entornolocal = new Entorno_1.Entorno(ent);
        var valAsign = this.condicion.traducir(entornolocal, arbol, resultado3D, temporales, 0);
        var ultLit = temporales.ultLiteral + 1;
        var cantidadSinos = this.sinos.length;
        temporales.ultLiteral += cantidadSinos + 2;
        resultado3D.codigo3D += '\tif(' + valAsign + ') goto L' + ultLit + ';\n';
        resultado3D.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
        resultado3D.codigo3D += '\tL' + ultLit + ':\n';
        this.instrucciones.forEach(function (element) {
            element.traducir(entornolocal, arbol, resultado3D, temporales, listaErrores);
        });
        resultado3D.codigo3D += '\tgoto L' + (ultLit + 1 + cantidadSinos) + ';\n';
        var cont = ultLit + 1;
        for (var i = cantidadSinos - 1; i >= 0; i--) {
            var sino = this.sinos[i];
            sino.traducirSinos(ent, arbol, resultado3D, temporales, cont, (ultLit + cantidadSinos + 1), listaErrores);
            cont += 1;
        }
        resultado3D.codigo3D += '\tL' + (ultLit + cantidadSinos + 1) + ':\n';
        temporales.ultLitEscr = ultLit + cantidadSinos + 1;
    };
    If.prototype.traducirSinos = function (ent, arbol, resultado3D, temporales, literalAsign, ultAsign, listaErrores) {
        if (this.tipo == "elseif") {
            var entornolocal_1 = new Entorno_1.Entorno(ent);
            var valAsign = this.condicion.traducir(entornolocal_1, arbol, resultado3D, temporales, 0);
            resultado3D.codigo3D += '\tif(' + valAsign + ') goto L' + literalAsign + ';\n';
            resultado3D.codigo3D += '\tgoto L' + (literalAsign + 1) + ';\n';
            resultado3D.codigo3D += '\tL' + literalAsign + ':\n';
            this.instrucciones.forEach(function (element) {
                element.traducir(entornolocal_1, arbol, resultado3D, temporales, listaErrores);
            });
            resultado3D.codigo3D += '\tgoto L' + ultAsign + ';\n';
        }
        else {
            var entornolocal_2 = new Entorno_1.Entorno(ent);
            resultado3D.codigo3D += '\tL' + literalAsign + ':\n';
            this.instrucciones.forEach(function (element) {
                element.traducir(entornolocal_2, arbol, resultado3D, temporales, listaErrores);
            });
            resultado3D.codigo3D += '\tgoto L' + ultAsign + ';\n';
        }
    };
    If.prototype.ejecutar = function (ent, arbol, listaErrores) {
        console.log('ejecutado...ifnormal');
        //Revisar la condicion del if
        if (this.tipo == "if" || this.tipo == "elseif") {
            if (this.condicion.getValorImplicito(ent, arbol, listaErrores) == true) {
                var entornolocal = new Entorno_1.Entorno(ent);
                for (var _i = 0, _a = this.instrucciones; _i < _a.length; _i++) {
                    var element = _a[_i];
                    var valR = element.ejecutar(entornolocal, arbol, listaErrores);
                    if (valR == 'RETORNAR') {
                        ent.valorReturn = entornolocal.valorReturn;
                        return 'RETORNAR';
                    }
                    else if (valR == 'ROMPER') {
                        return 'ROMPER';
                    }
                    else if (valR == 'CONTINUAR') {
                        return 'CONTINUAR';
                    }
                }
            }
            else {
                var seEncontro = false;
                for (var i = 0; i < this.sinos.length; i++) {
                    var element = this.sinos[i];
                    if (element.tipo == "elseif") {
                        if (element.condicion.getValorImplicito(ent, arbol, listaErrores) == true) {
                            //Se encontro un elseif que cumple con la condicion
                            var entornolocal = new Entorno_1.Entorno(ent);
                            var valR = element.ejecutar(entornolocal, arbol, listaErrores);
                            if (valR == 'RETORNAR') {
                                ent.valorReturn = entornolocal.valorReturn;
                                return 'RETORNAR';
                            }
                            else if (valR == 'ROMPER') {
                                return 'ROMPER';
                            }
                            else if (valR == 'CONTINUAR') {
                                return 'CONTINUAR';
                            }
                            break;
                        }
                    }
                }
                if (seEncontro == false) {
                    for (var i = 0; i < this.sinos.length; i++) {
                        var element = this.sinos[i];
                        if (element.tipo == "else") {
                            //Se encontro un else  
                            var entornolocal = new Entorno_1.Entorno(ent);
                            var valR = element.ejecutar(entornolocal, arbol, listaErrores);
                            if (valR == 'RETORNAR') {
                                ent.valorReturn = entornolocal.valorReturn;
                                return 'RETORNAR';
                            }
                            else if (valR == 'ROMPER') {
                                return 'ROMPER';
                            }
                            else if (valR == 'CONTINUAR') {
                                return 'CONTINUAR';
                            }
                            break;
                        }
                    }
                }
            }
        }
        else {
            var entornolocal = new Entorno_1.Entorno(ent);
            for (var _b = 0, _c = this.instrucciones; _b < _c.length; _b++) {
                var element = _c[_b];
                var valR = element.ejecutar(entornolocal, arbol, listaErrores);
                if (valR == 'RETORNAR') {
                    ent.valorReturn = entornolocal.valorReturn;
                    console.log('VAl return');
                    console.log(ent.valorReturn);
                    return 'RETORNAR';
                }
                else if (valR == 'ROMPER') {
                    return 'ROMPER';
                }
                else if (valR == 'CONTINUAR') {
                    return 'CONTINUAR';
                }
            }
        }
    };
    return If;
}());
exports.If = If;

},{"../AST/Entorno":1}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Operacion_1 = require("../Expresiones/Operacion");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var IncrDecr = /** @class */ (function () {
    function IncrDecr(operacion, linea, columna, idVar) {
        this.operacion = operacion;
        this.linea = linea;
        this.columna = columna;
        this.idVar = idVar;
    }
    IncrDecr.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        if (ent.existe(this.idVar)) {
            var simbol = ent.getSimbolo(this.idVar);
            temporales.ultimoTemp += 1;
            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= stack[(int)' + simbol.valor + '];\n';
            temporales.ultimoTemp += 1;
            if (this.operacion.operador == Operacion_1.Operador.INCREMENTO) {
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= t' + (temporales.ultimoTemp - 1) + '+1;\n';
            }
            else {
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '= t' + (temporales.ultimoTemp - 1) + '-1;\n';
            }
            resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + ']' + '= t' + temporales.ultimoTemp + ';\n';
        }
        else {
            //Error            
        }
    };
    IncrDecr.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var valorIns = this.operacion.getValorImplicito(ent, arbol, listaErrores);
        if (valorIns !== null) {
            if (ent.existe(this.idVar)) {
                var simbol = ent.getSimbolo(this.idVar);
                simbol.valor = valorIns;
            }
            else {
                // console.log('Error semantico, no existe la variable ' + this.idVar +'en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.idVar, this.linea, this.columna));
            }
        }
        else {
            // console.log("Ocurrio un error al realizar la operacion " + this.operacion.op_izquierda);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'ocurrio un error al realizar la operacion ' + this.operacion.op_izquierda, this.linea, this.columna));
        }
    };
    return IncrDecr;
}());
exports.IncrDecr = IncrDecr;

},{"../Expresiones/Operacion":12,"../Objetos/ErrorG":43}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Parametro = /** @class */ (function () {
    function Parametro(id, tipoParametro, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.tipoParametro = tipoParametro;
    }
    Parametro.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Parametro.prototype.ejecutar = function (ent, arbol, listaErrores) {
        console.log('ejecutado...' + this.id);
    };
    return Parametro;
}());
exports.Parametro = Parametro;

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var Pop = /** @class */ (function () {
    function Pop(id, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
    }
    Pop.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Pop.prototype.ejecutar = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                valor.pop();
            }
            else {
                //no es de tipo array
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable no es del tipo array', this.linea, this.columna));
            }
        }
        else {
            //no existe el id
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.id, this.linea, this.columna));
        }
    };
    return Pop;
}());
exports.Pop = Pop;

},{"../AST/Tipo":3,"../Objetos/ErrorG":43}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ConcatenacionString_1 = require("../Expresiones/ConcatenacionString");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var Print = /** @class */ (function () {
    function Print(exp, linea, columna, haysalto) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
        this.haysalto = haysalto;
    }
    Print.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        var arrayConcatenacion = this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
        if (this.expresion instanceof ConcatenacionString_1.ConcatenacionString) {
            arrayConcatenacion.forEach(function (CT) {
                var valAsign = CT.valAsign;
                var ultimoTipo = CT.tipo;
                if (ultimoTipo == Tipo_1.Tipo.STRING) {
                    temporales.ultimoTemp += 1;
                    resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = P + ' + (temporales.ultstack + 1) + ';\n';
                    resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + ' = t' + temporales.ultimoTemp + ' + 1;\n';
                    resultado3d.codigo3D += '\tstack[(int)t' + temporales.ultimoTemp + '] = ' + valAsign + ';\n';
                    resultado3d.codigo3D += '\tP = P + ' + (temporales.ultstack + 1) + ';\n';
                    resultado3d.codigo3D += '\tprintString();\n';
                    resultado3d.codigo3D += '\tP = P - ' + (temporales.ultstack + 1) + ';\n';
                    // if(this.haysalto){
                    //     resultado3d.codigo3D += '\tprintf("%c", (char)10);\n';
                    // }
                    temporales.usoPrintStrings = true;
                }
                else if (ultimoTipo == Tipo_1.Tipo.BOOL) {
                    temporales.ultLiteral += 3;
                    var ultLit = temporales.ultLiteral - 2;
                    resultado3d.codigo3D += '\tif(' + valAsign + ' == 1) goto L' + ultLit + ';\n';
                    resultado3d.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
                    resultado3d.codigo3D += '\tL' + ultLit + ':\n';
                    resultado3d.codigo3D += '\tprintf("%c", (char)116);\n\tprintf("%c", (char)114);\n\tprintf("%c", (char)117);\n\tprintf("%c", (char)101);\n';
                    resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
                    resultado3d.codigo3D += '\tL' + (ultLit + 1) + ':\n';
                    resultado3d.codigo3D += '\tprintf("%c", (char)102);\n\tprintf("%c", (char)97);\n\tprintf("%c", (char)108);\n\tprintf("%c", (char)115);\n\tprintf("%c", (char)101);\n';
                    resultado3d.codigo3D += '\tL' + (ultLit + 2) + ':\n';
                    temporales.ultLitEscr = (ultLit + 2);
                    // if(this.haysalto){
                    //     resultado3d.codigo3D += '\tprintf("%c", (char)10);\n';
                    // }
                }
                else {
                    var parseo = '\"%f\"';
                    var parseo2 = '(double)';
                    resultado3d.codigo3D += '\tprintf(' + parseo + ' , ' + parseo2 + valAsign + ');\n';
                    // if(this.haysalto){
                    //     resultado3d.codigo3D += '\tprintf("%c", (char)10);\n';
                    // }
                }
            });
            if (this.haysalto) {
                resultado3d.codigo3D += '\tprintf("%c", (char)10);\n';
            }
        }
    };
    Print.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var valor = this.expresion.getValorImplicito(ent, arbol, listaErrores);
        if (valor !== null) {
            console.log('>', valor);
            var area = document.getElementById('consola');
            if (this.haysalto) {
                area.value = area.value + valor + "\n";
            }
            else {
                area.value = area.value + valor;
            }
        }
        else {
            console.log('>> Error, no se pueden imprimir valores nulos');
            listaErrores.push(new ErrorG_1.ErrorG('semantico', '>> Error, no se pueden imprimir valores nulos', this.linea, this.columna));
        }
    };
    return Print;
}());
exports.Print = Print;

},{"../AST/Tipo":3,"../Expresiones/ConcatenacionString":10,"../Objetos/ErrorG":43}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var Push = /** @class */ (function () {
    function Push(id, expresion, linea, columna) {
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Push.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Push.prototype.ejecutar = function (ent, arbol, listaErrores) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                valor.push(ent, arbol, this.expresion, listaErrores);
            }
            else {
                //no es de tipo array
                listaErrores.push(new ErrorG_1.ErrorG('semantico', 'la variable no es del tipo array', this.linea, this.columna));
            }
        }
        else {
            //no existe el id
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'no existe la variable ' + this.id, this.linea, this.columna));
        }
    };
    return Push;
}());
exports.Push = Push;

},{"../AST/Tipo":3,"../Objetos/ErrorG":43}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
// print("hola mundo");
var Return = /** @class */ (function () {
    function Return(exp, linea, columna) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }
    Return.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        var valAsign = this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
        if (temporales.ultimoTipo == Tipo_1.Tipo.BOOL) {
            if (temporales.esFuncion) {
                temporales.ultLiteral += 3;
                var ultLit = temporales.ultLiteral - 2;
                resultado3d.codigo3D += '\tif(' + valAsign + ') goto L' + ultLit + ';\n';
                resultado3d.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
                resultado3d.codigo3D += '\tL' + ultLit + ':\n';
                resultado3d.codigo3D += '\tstack[(int)P] = 1;\n';
                resultado3d.codigo3D += '\treturn;\n';
                resultado3d.codigo3D += '\tgoto L' + (ultLit + 2) + ';\n';
                resultado3d.codigo3D += '\tL' + (ultLit + 1) + ':\n';
                resultado3d.codigo3D += '\tstack[(int)P] = 0;\n';
                resultado3d.codigo3D += '\treturn;\n';
                resultado3d.codigo3D += '\tL' + (ultLit + 2) + ':\n';
                temporales.ultLitEscr = (ultLit + 2);
            }
        }
        else {
            if (temporales.esFuncion) {
                resultado3d.codigo3D += '\tstack[(int)P] =' + valAsign + ';\n';
                resultado3d.codigo3D += '\treturn;\n';
            }
        }
    };
    Return.prototype.ejecutar = function (ent, arbol, listaErrores) {
        console.log('Ejecutando return');
        if (this.expresion != null) {
            var valExpr = this.expresion.getValorImplicito(ent, arbol, listaErrores);
            ent.valorReturn = valExpr;
            console.log(ent.valorReturn);
        }
        return 'RETORNAR';
    };
    return Return;
}());
exports.Return = Return;

},{"../AST/Tipo":3}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
var ErrorG_1 = require("../Objetos/ErrorG");
// print("hola mundo");
var Struct = /** @class */ (function () {
    function Struct(id, lista_atributos, linea, columna) {
        this.id = id;
        this.lista_atributos = lista_atributos;
        this.linea = linea;
        this.columna = columna;
    }
    Struct.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Struct.prototype.ejecutar = function (ent, arbol, listaErrores) {
        if (!ent.existe(this.id)) {
            var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.STRUCT, this.id, this.linea, this.columna, this.lista_atributos);
            ent.agregar(this.id, simbol);
        }
        else {
            // console.log('error semantico, Ya existe el nombre de la estructura declarada en la linea '+ this.linea + ' y columna ' + this.columna);
            listaErrores.push(new ErrorG_1.ErrorG('semantico', 'ya existe el nombre del estructura declarada', this.linea, this.columna));
        }
    };
    Struct.prototype.getTipo = function () {
        return "struct";
    };
    return Struct;
}());
exports.Struct = Struct;

},{"../AST/Simbolo":2,"../AST/Tipo":3,"../Objetos/ErrorG":43}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
// print("hola mundo");
var Switch = /** @class */ (function () {
    function Switch(expresion, lista_intstrucciones, linea, columna) {
        this.expresion = expresion;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    Switch.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        if (this.lista_instrucciones.length > 0) {
            var valAsign = this.expresion.traducir(ent, arbol, resultado3D, temporales, listaErrores);
            var ultL = temporales.ultLiteral + 1;
            var cantCase = this.lista_instrucciones.length;
            if (this.lista_instrucciones[this.lista_instrucciones.length - 1].id.getTipo(ent, arbol, listaErrores) == Tipo_1.Tipo.NULL) {
                temporales.ultLiteral += ((cantCase - 1) * 2) + 1;
            }
            else {
                temporales.ultLiteral += cantCase * 2;
            }
            var i = 0;
            for (var _i = 0, _a = this.lista_instrucciones; _i < _a.length; _i++) {
                var caso = _a[_i];
                if (i != 0) {
                    resultado3D.codigo3D += '\tL' + ultL + ':\n';
                    ultL += 1;
                }
                if (caso.id.getTipo(ent, arbol, listaErrores) != Tipo_1.Tipo.NULL) {
                    var valorCaso = caso.id.traducir(ent, arbol, resultado3D, temporales, 0);
                    resultado3D.codigo3D += '\tif(' + valAsign + ' == ' + valorCaso + ') goto L' + ultL + ';\n';
                    resultado3D.codigo3D += '\tgoto L' + (ultL + 1) + ';\n';
                    resultado3D.codigo3D += '\tL' + ultL + ':\n';
                    if (i + 1 == this.lista_instrucciones.length) {
                        ultL += 1;
                    }
                }
                caso.traducir(ent, arbol, resultado3D, temporales, listaErrores);
                ultL += 1;
                i += 1;
            }
            ultL -= 1;
            resultado3D.codigo3D += '\tL' + (ultL) + ':\n';
            temporales.ultLitEscr = ultL;
        }
    };
    Switch.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var isFound = false;
        for (var _i = 0, _a = this.lista_instrucciones; _i < _a.length; _i++) {
            var caso = _a[_i];
            if (this.expresion.getValorImplicito(ent, arbol) == caso.id.getValorImplicito(ent, arbol, listaErrores) || caso.id.getTipo(ent, arbol, listaErrores) == Tipo_1.Tipo.NULL || isFound) {
                caso.ejecutar(ent, arbol, listaErrores);
                isFound = true;
                if (caso.getIsBreak()) {
                    break;
                }
                else if (caso.getIsContinue()) {
                    continue;
                }
            }
        }
    };
    return Switch;
}());
exports.Switch = Switch;

},{"../AST/Tipo":3}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Break_1 = require("./Break");
var Continue_1 = require("./Continue");
// print("hola mundo");
var SwitchCaso = /** @class */ (function () {
    function SwitchCaso(id, lista_intstrucciones, linea, columna) {
        this.id = id;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
        this.isBreak = false;
        this.IsContinue = false;
    }
    SwitchCaso.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        for (var _i = 0, _a = this.lista_instrucciones; _i < _a.length; _i++) {
            var ints = _a[_i];
            ints.traducir(ent, arbol, resultado3D, temporales, listaErrores);
        }
    };
    SwitchCaso.prototype.ejecutar = function (ent, arbol, listaErrores) {
        for (var _i = 0, _a = this.lista_instrucciones; _i < _a.length; _i++) {
            var ints = _a[_i];
            if (ints instanceof Break_1.Break) {
                this.isBreak = true;
                break;
            }
            else if (ints instanceof Continue_1.Continue) {
                this.IsContinue = true;
                continue;
            }
            else {
                ints.ejecutar(ent, arbol, listaErrores);
            }
        }
    };
    SwitchCaso.prototype.getIsBreak = function () {
        return this.isBreak;
    };
    SwitchCaso.prototype.getIsContinue = function () {
        return this.IsContinue;
    };
    return SwitchCaso;
}());
exports.SwitchCaso = SwitchCaso;

},{"./Break":20,"./Continue":21}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entorno_1 = require("../AST/Entorno");
var While = /** @class */ (function () {
    function While(linea, columna, instrucciones, expresion) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion = expresion;
    }
    While.prototype.traducir = function (ent, arbol, resultado3D, temporales, listaErrores) {
        var entornolocal = new Entorno_1.Entorno(ent);
        if (temporales.ultLiteral == 0) {
            resultado3D.codigo3D += '\tL' + temporales.ultLiteral + ":\n";
            temporales.ultLitEscr = 0;
        }
        var ultEscrito = temporales.ultLitEscr;
        temporales.ultLiteral += 2;
        var ulLit = temporales.ultLiteral - 1;
        var valAsign = this.expresion.traducir(entornolocal, arbol, resultado3D, temporales, 0);
        resultado3D.codigo3D += '\tif(' + valAsign + ') goto L' + ulLit + ';\n';
        resultado3D.codigo3D += '\tgoto L' + (ulLit + 1) + ';\n';
        resultado3D.codigo3D += '\tL' + (ulLit) + ':\n';
        //Traducir instrucciones
        this.instrucciones.forEach(function (element) {
            element.traducir(entornolocal, arbol, resultado3D, temporales, listaErrores);
        });
        resultado3D.codigo3D += '\tgoto L' + (ultEscrito) + ';\n';
        resultado3D.codigo3D += '\tL' + (ulLit + 1) + ':\n';
        temporales.ultLitEscr = ulLit + 1;
    };
    While.prototype.ejecutar = function (ent, arbol, listaErrores) {
        var entornolocal = new Entorno_1.Entorno(ent);
        var realizar = this.expresion.getValorImplicito(entornolocal, arbol, listaErrores);
        var contSalir = 0;
        while (realizar) {
            for (var _i = 0, _a = this.instrucciones; _i < _a.length; _i++) {
                var element = _a[_i];
                var valR = element.ejecutar(entornolocal, arbol, listaErrores);
                if (valR == 'RETORNAR') {
                    ent.valorReturn = entornolocal.valorReturn;
                    return 'RETORNAR';
                }
                else if (valR == 'ROMPER') {
                    return;
                }
                else if (valR == 'CONTINUAR') {
                    break;
                }
            }
            realizar = this.expresion.getValorImplicito(entornolocal, arbol, listaErrores);
            if (contSalir == 5000) {
                realizar = false;
            }
            contSalir++;
        }
    };
    return While;
}());
exports.While = While;

},{"../AST/Entorno":1}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Arreglo = /** @class */ (function () {
    function Arreglo(tipo, dimension, length, contenido, linea, columna) {
        this.tipo = tipo;
        this.dimension = dimension;
        this.length = length;
        this.contenido = contenido;
        this.linea = linea;
        this.columna = columna;
    }
    Arreglo.prototype.push = function (ent, arbol, nuevo, listaErrores) {
        if (nuevo.getTipo(ent, arbol, listaErrores) == this.tipo) {
            this.contenido.push(nuevo);
            this.length += 1;
            this.dimension += 1;
        }
        else {
            //no es del mismo tipo
        }
    };
    Arreglo.prototype.pop = function () {
        var pop = this.contenido.pop();
        var valor = this.contenido.length;
        this.length = valor;
        this.dimension = valor;
        return pop;
    };
    Arreglo.prototype.getLastContenido = function () {
        return this.contenido[this.length - 1];
    };
    Arreglo.prototype.comprobarTipo = function (ent, arbol, listaErrores) {
        var _this = this;
        var isFine = true;
        this.contenido.forEach(function (cont) {
            if (!(cont.getTipo(ent, arbol, listaErrores) == _this.tipo)) {
                isFine = false;
                console.log('Error semantico, el valor: ' + cont.getValorImplicito(ent, arbol, listaErrores) + ' no concuerda con el tipo del arreglo en la linea ' + _this.linea + ' y columna ' + _this.columna);
            }
        });
        return isFine;
    };
    return Arreglo;
}());
exports.Arreglo = Arreglo;

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorG = /** @class */ (function () {
    function ErrorG(tipoError, descripcion, linea, columna) {
        this.tipoError = tipoError;
        this.descripcion = descripcion;
        this.linea = linea;
        this.columna = columna;
        this.ambito = 'global';
    }
    ErrorG.prototype.mostrarErrorConsola = function () {
        var resultado = '\nError ' + this.tipoError + ', ' + this.descripcion + ' -> linea ' + this.linea + ' y columna ' + this.columna;
        return resultado;
    };
    return ErrorG;
}());
exports.ErrorG = ErrorG;

},{}],44:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var Gramatica = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,13],$V1=[1,12],$V2=[1,9],$V3=[1,11],$V4=[1,14],$V5=[1,15],$V6=[1,16],$V7=[1,17],$V8=[1,18],$V9=[2,4,10,11,20,90,91,92,93,94],$Va=[1,24],$Vb=[1,25],$Vc=[1,26],$Vd=[2,4,10,11,14,20,44,45,46,47,53,58,61,70,72,74,80,84,85,90,91,92,93,94],$Ve=[1,32],$Vf=[1,31],$Vg=[2,11,48,68],$Vh=[1,37],$Vi=[1,35],$Vj=[1,36],$Vk=[2,15,18,96],$Vl=[2,115],$Vm=[1,40],$Vn=[1,55],$Vo=[1,62],$Vp=[1,64],$Vq=[1,65],$Vr=[1,66],$Vs=[1,67],$Vt=[1,68],$Vu=[1,69],$Vv=[1,70],$Vw=[1,71],$Vx=[1,75],$Vy=[1,76],$Vz=[1,77],$VA=[1,78],$VB=[1,56],$VC=[1,57],$VD=[1,58],$VE=[1,59],$VF=[1,60],$VG=[1,61],$VH=[1,63],$VI=[1,88],$VJ=[1,87],$VK=[18,23],$VL=[2,23],$VM=[1,95],$VN=[2,11,13,15,18,23,48,59,69,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127],$VO=[18,69],$VP=[1,116],$VQ=[1,115],$VR=[1,100],$VS=[1,101],$VT=[1,109],$VU=[1,110],$VV=[1,111],$VW=[1,112],$VX=[1,113],$VY=[1,114],$VZ=[1,102],$V_=[1,103],$V$=[1,104],$V01=[1,105],$V11=[1,106],$V21=[1,107],$V31=[1,108],$V41=[15,18,23,48,59,69,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127],$V51=[15,18,23,48,51,52,59,69,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127],$V61=[14,18],$V71=[1,143],$V81=[2,28],$V91=[1,174],$Va1=[15,18,23,59,69,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127],$Vb1=[1,188],$Vc1=[1,187],$Vd1=[15,18,23,59,69,112,114],$Ve1=[15,18,23,59,69,112,113,114,115,116,117,118,119,120,121,122,123,124,125,127],$Vf1=[15,18,23,59,69,112,113,114,115,116,117,118,119,120,123,124,125],$Vg1=[15,18,23,59,69,112,113,114,115,116,117,118,119,120],$Vh1=[1,202],$Vi1=[1,204],$Vj1=[1,232],$Vk1=[1,234],$Vl1=[1,246],$Vm1=[1,244],$Vn1=[1,245],$Vo1=[1,243],$Vp1=[1,242],$Vq1=[1,236],$Vr1=[1,237],$Vs1=[1,238],$Vt1=[1,239],$Vu1=[1,240],$Vv1=[1,241],$Vw1=[2,4,10,11,14,20,44,45,46,47,53,58,61,70,72,74,77,79,80,84,85,90,91,92,93,94],$Vx1=[2,11,14,44,45,46,47,53,58,61,70,72,74,80,84,85,90,91,92,93,94],$Vy1=[2,96],$Vz1=[2,120],$VA1=[1,300],$VB1=[2,13,15,18,23,48,59,69,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127],$VC1=[1,322],$VD1=[1,325],$VE1=[2,86],$VF1=[2,91],$VG1=[1,363],$VH1=[1,365],$VI1=[1,372],$VJ1=[14,58,61];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"EOF":4,"instrucciones":5,"instruccion":6,"declaracion_bloque":7,"asignacion_funcion":8,"struct_declaracion":9,"STR_STRUCT":10,"ID_VAR":11,"cuerpo_struct":12,"BRACKI":13,"BRACKD":14,"PUNTCOMA":15,"contenido_struct":16,"declaracion_struct":17,"COMA":18,"tiposVar":19,"VOID":20,"MAIN":21,"PARI":22,"PARD":23,"cuerpoFuncion":24,"parametros_funcion":25,"parametro_funcion":26,"parametros_funcion_return":27,"parametro_funcion_return":28,"expresion":29,"instrucciones_funciones":30,"instruccion_funcion":31,"asignacion_bloque":32,"print_bloque":33,"if_bloque":34,"for_bloque":35,"while_bloque":36,"switch_bloque":37,"funcion_return":38,"incremento_decremento":39,"funciones_arreglo":40,"returns_bloque":41,"rompimientos_bloque":42,"graficar_bloque":43,"STR_GRAFICAR":44,"BREAK":45,"CONTINUE":46,"STR_RETURN":47,"OP_CALL":48,"STR_PUSH":49,"STR_POP":50,"OP_INCR":51,"OP_DECR":52,"STR_SWITCH":53,"switch_cuerpo":54,"casos_switch":55,"opcional_default":56,"caso_switch":57,"STR_CASE":58,"DOSPUNT":59,"contenido_caso":60,"STR_DEFAULT":61,"opcional_break":62,"nombreVars":63,"asignacion":64,"declaracion_arreglo":65,"arr_decl":66,"nombreAtributos":67,"CORCHI":68,"CORCHD":69,"PRINT":70,"expresiones_print":71,"PRINTLN":72,"expresion_print":73,"STR_IF":74,"sinos_bloque":75,"instruccion_devuelta":76,"STR_ELSE":77,"sino_si_bloque":78,"STR_ELSEIF":79,"STR_FOR":80,"decl_asign":81,"STR_IN":82,"arr_begin_end":83,"STR_WHILE":84,"STR_DO":85,"parametros_arreglo":86,"expresion_arreglo":87,"STR_BEGIN":88,"STR_END":89,"STR_STRING":90,"STR_DOUBLE":91,"STR_INTEGER":92,"STR_BOOLEAN":93,"STR_CHAR":94,"nombreAtributos_prima":95,"OP_IGUAL":96,"primitivas":97,"logicas":98,"operadores":99,"relacionales":100,"expresion_ternario":101,"incr_decr":102,"nativas":103,"expresion_arr_arreglo":104,"expresion_atributos":105,"otras_nativas":106,"LENGTH":107,"UPPERCASE":108,"LOWERCASE":109,"CHARPOS":110,"SUBSTRING":111,"OP_TER":112,"OP_AND":113,"OP_OR":114,"OP_DOBIG":115,"OP_DIF":116,"OP_MAYIG":117,"OP_MENIG":118,"OP_MEN":119,"OP_MAY":120,"OP_MULT":121,"OP_DIVI":122,"OP_SUMA":123,"OP_RESTA":124,"OP_AMP":125,"OP_ELV":126,"OP_MOD":127,"OP_NEG":128,"STR_POW":129,"STR_SQRT":130,"STR_SIN":131,"STR_COS":132,"STR_TAN":133,"STR_PARSE":134,"STR_TOINT":135,"STR_TODOUBLE":136,"STR_string":137,"STR_TYPEOF":138,"STR_FALSE":139,"STR_TRUE":140,"ENTERO":141,"FLOTANTE":142,"STRINGL":143,"CHARL":144,"STR_NULL":145,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",10:"STR_STRUCT",11:"ID_VAR",13:"BRACKI",14:"BRACKD",15:"PUNTCOMA",18:"COMA",20:"VOID",21:"MAIN",22:"PARI",23:"PARD",44:"STR_GRAFICAR",45:"BREAK",46:"CONTINUE",47:"STR_RETURN",48:"OP_CALL",49:"STR_PUSH",50:"STR_POP",51:"OP_INCR",52:"OP_DECR",53:"STR_SWITCH",58:"STR_CASE",59:"DOSPUNT",61:"STR_DEFAULT",68:"CORCHI",69:"CORCHD",70:"PRINT",72:"PRINTLN",74:"STR_IF",77:"STR_ELSE",79:"STR_ELSEIF",80:"STR_FOR",82:"STR_IN",84:"STR_WHILE",85:"STR_DO",88:"STR_BEGIN",89:"STR_END",90:"STR_STRING",91:"STR_DOUBLE",92:"STR_INTEGER",93:"STR_BOOLEAN",94:"STR_CHAR",96:"OP_IGUAL",107:"LENGTH",108:"UPPERCASE",109:"LOWERCASE",110:"CHARPOS",111:"SUBSTRING",112:"OP_TER",113:"OP_AND",114:"OP_OR",115:"OP_DOBIG",116:"OP_DIF",117:"OP_MAYIG",118:"OP_MENIG",119:"OP_MEN",120:"OP_MAY",121:"OP_MULT",122:"OP_DIVI",123:"OP_SUMA",124:"OP_RESTA",125:"OP_AMP",126:"OP_ELV",127:"OP_MOD",128:"OP_NEG",129:"STR_POW",130:"STR_SQRT",131:"STR_SIN",132:"STR_COS",133:"STR_TAN",134:"STR_PARSE",135:"STR_TOINT",136:"STR_TODOUBLE",137:"STR_string",138:"STR_TYPEOF",139:"STR_FALSE",140:"STR_TRUE",141:"ENTERO",142:"FLOTANTE",143:"STRINGL",144:"CHARL",145:"STR_NULL"},
productions_: [0,[3,1],[3,2],[5,2],[5,1],[6,1],[6,1],[6,1],[9,3],[9,2],[12,3],[12,4],[12,1],[16,1],[16,3],[17,2],[17,2],[17,1],[8,5],[8,6],[8,6],[25,3],[25,1],[25,0],[26,2],[26,1],[27,3],[27,1],[27,0],[28,1],[24,3],[24,2],[24,1],[30,2],[30,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,2],[43,4],[42,2],[42,2],[41,2],[41,3],[40,7],[40,6],[39,3],[39,3],[38,5],[37,5],[37,1],[54,2],[54,4],[54,1],[55,2],[55,1],[57,4],[60,1],[56,3],[56,0],[62,2],[62,2],[62,0],[7,3],[7,4],[7,4],[7,1],[65,4],[65,5],[32,3],[32,6],[33,5],[33,5],[33,2],[71,2],[73,3],[73,0],[34,6],[76,1],[75,2],[75,2],[75,0],[78,5],[35,9],[35,5],[35,5],[35,5],[36,5],[36,6],[81,3],[81,2],[66,3],[66,2],[86,1],[86,3],[87,1],[83,6],[83,6],[83,6],[83,6],[19,1],[19,1],[19,1],[19,1],[19,1],[63,1],[63,3],[63,1],[67,2],[95,3],[95,0],[64,2],[64,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[104,1],[104,4],[104,1],[105,3],[105,5],[105,5],[105,5],[105,5],[105,6],[105,8],[101,5],[98,3],[98,3],[100,3],[100,3],[100,3],[100,3],[100,3],[100,3],[99,3],[99,3],[99,3],[99,3],[99,3],[99,3],[99,3],[99,3],[99,2],[99,2],[102,2],[102,2],[103,6],[103,4],[103,4],[103,4],[103,4],[106,6],[106,4],[106,4],[106,4],[106,4],[97,1],[97,1],[97,1],[97,1],[97,1],[97,1],[97,1],[97,4],[97,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
console.log("EOF encontrado");return [];
break;
case 2:
this.$ = $$[$0-1];return reiniciarArrays(this.$);
break;
case 3: case 64:
$$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 4: case 13: case 22: case 27: case 65: case 115:
this.$ = [$$[$0]];
break;
case 5: case 6: case 7: case 35: case 36: case 37: case 38: case 39: case 40: case 41: case 42: case 43: case 44: case 45: case 46: case 47: case 67: case 76: case 105: case 121: case 123: case 124: case 125: case 126: case 127: case 128: case 129: case 130: case 131: case 132: case 136:
this.$ = $$[$0];
break;
case 8:
this.$ = new Struct($$[$0-1],$$[$0],_$[$0-2].first_line,_$[$0-2].first_column); 
break;
case 9: case 48: case 83:
genError(yytext,_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 10:
this.$ = []; 
break;
case 11:
this.$ = $$[$0-2];
break;
case 12: case 17: case 25: case 32: case 60: case 63: case 117: case 122: case 133:
genError(yytext,_$[$0].first_line,_$[$0].first_column);
break;
case 14:
$$[$0-2].push($$[$0]); this.$= $$[$0-2]; 
break;
case 15: case 16:
this.$ = new Declaracion($$[$0],$$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column,null);
break;
case 18:
this.$ = new Funcion("main","void",_$[$0-4].first_line,_$[$0-4].first_column,$$[$0],[]);
break;
case 19: case 20:
this.$ = new Funcion($$[$0-4],$$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0],$$[$0-2]);
break;
case 21: case 26: case 104:
$$[$0-2].push($$[$0]);this.$ = $$[$0-2];
break;
case 23: case 28: case 86: case 91: case 102: case 120:
this.$ = [];
break;
case 24:
this.$ = new Parametro($$[$0],$$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 29:
this.$ = new ParametroReturn($$[$0],_$[$0].first_line,_$[$0].first_column);
break;
case 30: case 160:
this.$ = $$[$0-1];
break;
case 31: case 69: case 72:
this.$ = null;
break;
case 33:
        
        $$[$0-1].push($$[$0]);
        this.$ = $$[$0-1];
    
break;
case 34:
                
        this.$ = [$$[$0]];
    
break;
case 49:
this.$ = new GraficarTS();
break;
case 50: case 70:
this.$ = new Break(_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 51: case 71:
this.$ = new Continue(_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 52:
this.$ = new Return(null,_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 53:
this.$ = new Return($$[$0-1],_$[$0-2].first_line,_$[$0-2].first_column);
break;
case 54:
this.$ = new Push($$[$0-6],$$[$0-2],_$[$0-6].first_line, _$[$0-6].first_column);
break;
case 55:
this.$ = new Pop($$[$0-5],_$[$0-5].first_line, _$[$0-5].first_column);
break;
case 56:
   let accVar = new AccesoVariable($$[$0-2], _$[$0-2].first_line, _$[$0-2].first_column);
            let operInDec = new Operacion(accVar,null,Operador.INCREMENTO, _$[$0-2].first_line, _$[$0-2].first_column);
            this.$ = new IncrDecr(operInDec,_$[$0-2].first_line,_$[$0-2].first_column,$$[$0-2]);
        
break;
case 57:
   let accVar1 = new AccesoVariable($$[$0-2], _$[$0-2].first_line, _$[$0-2].first_column);
            let operInDec1 = new Operacion(accVar1,null,Operador.DECREMENTO, _$[$0-2].first_line, _$[$0-2].first_column);
            this.$ = new IncrDecr(operInDec1,_$[$0-2].first_line,_$[$0-2].first_column,$$[$0-2]);
        
break;
case 58:
this.$ = new FuncionReturn($$[$0-4],_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-2]);
break;
case 59:
this.$ = new Switch($$[$0-2],$$[$0],_$[$0-4].first_line,_$[$0-4].first_column);
break;
case 61:
this.$= [];
break;
case 62:

            if ($$[$0-1] != null){
                $$[$0-2].push($$[$0-1]);
            }
            this.$ = $$[$0-2];
        
break;
case 66:
this.$ = new SwitchCaso($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 68:
let nul = new Primitivo(null, _$[$0-2].first_line, _$[$0-2].first_column);this.$ = new SwitchCaso(nul,$$[$0],_$[$0-2].first_line,_$[$0-2].first_column);
break;
case 73:
this.$ = new Declaracion($$[$0-1],$$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,null);
break;
case 74:
this.$ = new Declaracion($$[$0-2],$$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 75:
this.$ =  new DeclaracionStruct($$[$0-2],$$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 77:
this.$ = new DeclaracionArray($$[$0-1],$$[$0-3],$$[$0-2],_$[$0-3].first_line,_$[$0-3].first_column,null);
break;
case 78:
this.$ = new DeclaracionArray($$[$0-2],$$[$0-4],$$[$0-3],_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-1]);
break;
case 79:
this.$ = new Asignacion($$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,$$[$0-1]);
break;
case 80:
this.$ = new AsignacionArray($$[$0-5],$$[$0-3],_$[$0-5].first_line, _$[$0-5].first_column,$$[$0-1]);
break;
case 81:
this.$ = new Print($$[$0-2],_$[$0-4].first_line,_$[$0-4].first_column,false);
break;
case 82:
this.$ = new Print($$[$0-2],_$[$0-4].first_line,_$[$0-4].first_column,true);
break;
case 84:
$$[$0].unshift($$[$0-1]); this.$ = new ConcatenacionString($$[$0],_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 85: case 118: case 119:
$$[$0].unshift($$[$0-1]); this.$ = $$[$0];
break;
case 87:
this.$ = new If(_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],$$[$0-1],$$[$0],"if");
break;
case 88: case 103:
this.$ = [$$[$0]]
break;
case 89:
this.$ = [new If(_$[$0-1].first_line,_$[$0-1].first_column,null,$$[$0],[],"else")];
break;
case 90:
$$[$0].push($$[$0-1]); this.$ = $$[$0]
break;
case 92:
this.$ = new If(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-2],$$[$0],[],"elseif");
break;
case 93:
this.$ = new For(_$[$0-8].first_line,_$[$0-8].first_column,$$[$0],$$[$0-6],$$[$0-4],$$[$0-2]);
break;
case 94: case 95: case 96:
this.$ = new Forin(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0],$$[$0-3],$$[$0-1]);
break;
case 97:
this.$ = new While(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0],$$[$0-2]);
break;
case 98:
this.$ = new DoWhile(_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-4],$$[$0-1]);
break;
case 99:
this.$ = new Declaracion($$[$0-1],$$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,$$[$0]);
break;
case 100:
this.$ = new Asignacion($$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column,$$[$0]);
break;
case 101:
this.$ = $$[$0-1]
break;
case 106:
this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],$$[$0-1]);
break;
case 107:
let beg = new Primitivo("begin", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,beg,$$[$0-1]);
break;
case 108:
let beg1 = new Primitivo("begin", _$[$0-5].first_line, _$[$0-5].first_column); let end1 = new Primitivo("end", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,beg1,end1);
break;
case 109:
let beg2 = new Primitivo("end", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],beg2);
break;
case 110:
this.$ = Tipo.STRING;
break;
case 111:
this.$ = Tipo.DOUBLE;
break;
case 112:
this.$ = Tipo.INT;
break;
case 113:
this.$ = Tipo.BOOL;
break;
case 114:
this.$ = Tipo.CHAR;
break;
case 116:
 $$[$0-2].push($$[$0]);this.$ = $$[$0-2];
break;
case 134:
this.$ = new AccesoArray($$[$0],_$[$0].first_line, _$[$0].first_column);
break;
case 135:
this.$ = new AccesoAtribArray($$[$0-3],$$[$0-1],_$[$0-3].first_line, _$[$0-3].first_column);
break;
case 137:
this.$ = new AccesoAtributo($$[$0-2],$$[$0],_$[$0-2].first_line, _$[$0-2].first_column);
break;
case 138:
this.$ = new OperacionCadena($$[$0-4],null,null,OperadorCadena.LENGTH,_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 139:
this.$ = new OperacionCadena($$[$0-4],null,null,OperadorCadena.POP,_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 140:
this.$ = new OperacionCadena($$[$0-4],null,null,OperadorCadena.UPPERCASE,_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 141:
this.$ = new OperacionCadena($$[$0-4],null,null,OperadorCadena.LOWERCASE,_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 142:
this.$ = new OperacionCadena($$[$0-5],$$[$0-1],null,OperadorCadena.CHARPOS,_$[$0-5].first_line, _$[$0-5].first_column);
break;
case 143:
this.$ = new OperacionCadena($$[$0-7],$$[$0-3],$$[$0-1],OperadorCadena.SUBSTRING,_$[$0-7].first_line, _$[$0-7].first_column);
break;
case 144:
this.$ = new Ternario($$[$0-4],$$[$0-2],$$[$0],_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 145:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AND, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 146:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.OR, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 147:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.IGUAL_IGUAL, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 148:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIFERENTE_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 149:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 150:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 151:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 152:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 153:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MULTIPLICACION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 154:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIVISION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 155:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.SUMA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 156:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.RESTA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 157:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AMPERSON, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 158:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.ELEVADO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 159:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MODULO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 161:
this.$ = new Operacion($$[$0],null,Operador.MENOS_UNARIO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 162:
this.$ = new Operacion($$[$0],null,Operador.NOT, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 163:
this.$ = new Operacion($$[$0-1],null,Operador.INCREMENTO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 164:
this.$ = new Operacion($$[$0-1],null,Operador.DECREMENTO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 165:
this.$ = new Operacion($$[$0-3],$$[$0-1],Operador.POW, _$[$0-5].first_line, _$[$0-5].first_column);
break;
case 166:
this.$ = new Operacion($$[$0-1],null,Operador.SQRT, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 167:
this.$ = new Operacion($$[$0-1],null,Operador.SIN, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 168:
this.$ = new Operacion($$[$0-1],null,Operador.COS, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 169:
this.$ = new Operacion($$[$0-1],null,Operador.TAN, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 170:
this.$ = new OperacionNativa(OperadorNativa.PARSE,$$[$0-5],$$[$0-1],_$[$0-5].first_line,_$[$0-5].first_column);
break;
case 171:
this.$ = new OperacionNativa(OperadorNativa.TOINT,Tipo.NULL,$$[$0-1],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 172:
this.$ = new OperacionNativa(OperadorNativa.TODOUBLE,Tipo.NULL,$$[$0-1],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 173:
this.$ = new OperacionNativa(OperadorNativa.STRING,Tipo.NULL,$$[$0-1],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 174:
this.$ = new OperacionNativa(OperadorNativa.TYPEOF,Tipo.NULL,$$[$0-1],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 175:
this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column);
break;
case 176:
this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column);
break;
case 177:
this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
break;
case 178:
let primitivo = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);primitivo.isFlotante=true;this.$ = primitivo;
break;
case 179: case 180:
this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 181:
this.$ = new AccesoVariable($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 182:
this.$ = new FuncionReturn($$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 183:
this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column);
break;
}
},
table: [{2:$V0,3:1,4:[1,2],5:3,6:4,7:5,8:6,9:7,10:$V1,11:$V2,19:8,20:$V3,65:10,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8},{1:[3]},{1:[2,1]},{2:$V0,4:[1,19],6:20,7:5,8:6,9:7,10:$V1,11:$V2,19:8,20:$V3,65:10,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8},o($V9,[2,4]),o($V9,[2,5]),o($V9,[2,6]),o($V9,[2,7]),{2:$Va,11:[1,22],63:21,66:23,68:$Vb},{11:$Vc},o($Vd,[2,76]),{11:[1,28],21:[1,27]},{11:[1,29]},{2:$Ve,12:30,13:$Vf},o($Vg,[2,110]),o($Vg,[2,111]),o($Vg,[2,112]),o($Vg,[2,113]),o($Vg,[2,114]),{1:[2,2]},o($V9,[2,3]),{2:$Vh,15:[1,33],18:$Vi,64:34,96:$Vj},o($Vk,$Vl,{22:[1,38]}),{2:$Va,11:$Vm,63:39},o($Vk,[2,117]),{2:$Vn,11:$Vo,19:74,22:$Vp,29:44,66:72,68:$Vb,69:[1,42],83:73,86:41,87:43,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vh,64:79,96:$Vj},{22:[1,80]},{22:[1,81]},{2:$Ve,12:82,13:$Vf},o($V9,[2,9]),{2:$VI,11:$VJ,14:[1,83],16:84,17:85,19:86,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8},o($V9,[2,12]),o($Vd,[2,73]),{15:[1,89]},{11:[1,90]},{2:$Vn,11:$Vo,19:74,22:$Vp,29:91,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{15:[2,122]},o($VK,$VL,{25:92,26:93,19:94,2:$VM,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8}),{2:$Vh,15:[1,96],18:$Vi,64:97,96:$Vj},o($Vk,$Vl),{18:[1,99],69:[1,98]},o($VN,[2,102]),o($VO,[2,103]),o($VO,[2,105],{48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31}),o($V41,[2,123],{51:[1,117],52:[1,118]}),o($V41,[2,124]),o($V41,[2,125]),o($V41,[2,126]),o($V41,[2,127]),o($V41,[2,128]),o($V41,[2,129]),o($V41,[2,130]),o($V41,[2,131]),o($V41,[2,132]),o($V41,[2,133]),o($V51,[2,175]),o($V51,[2,176]),o($V51,[2,177]),o($V51,[2,178]),o($V51,[2,179]),o($V51,[2,180]),o($V51,[2,181],{22:[1,119],68:[1,120]}),o($V51,[2,183]),{2:$Vn,11:$Vo,19:74,22:$Vp,29:121,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:122,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:123,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{22:[1,124]},{22:[1,125]},{22:[1,126]},{22:[1,127]},{22:[1,128]},o($V41,[2,134]),o($V41,[2,136]),{48:[1,129]},{22:[1,130]},{22:[1,131]},{22:[1,132]},{22:[1,133]},{15:[1,134]},{23:[1,135]},o($VK,$VL,{26:93,19:94,25:136,2:$VM,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8}),o($V9,[2,8]),{15:[1,137]},{14:[1,138],18:[1,139]},o($V61,[2,13]),{11:[1,140]},{11:[1,141]},o($V61,[2,17]),o($Vd,[2,74]),o($Vk,[2,116]),{15:[2,121],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{18:$V71,23:[1,142]},o($VK,[2,22]),{11:[1,144]},o($VK,[2,25]),o($Vd,[2,77]),{15:[1,145]},o($VN,[2,101]),{2:$Vn,11:$Vo,19:74,22:$Vp,29:44,66:72,68:$Vb,83:73,87:146,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:147,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:148,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:149,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:150,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:151,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:152,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:153,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:154,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:155,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:156,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:157,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:158,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:159,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:160,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:161,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:162,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{11:[1,163],50:[1,165],107:[1,164],108:[1,166],109:[1,167],110:[1,168],111:[1,169]},o($V41,[2,163]),o($V41,[2,164]),o($VK,$V81,{97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,66:72,83:73,19:74,27:170,28:171,29:172,2:$Vn,11:$Vo,22:$Vp,68:$Vb,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH}),{2:$Vn,11:$Vo,19:74,22:$Vp,29:173,66:72,68:$Vb,83:73,88:$V91,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{23:[1,175],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},o($Va1,[2,161],{48:$VP}),o($Va1,[2,162],{48:$VP}),{2:$Vn,11:$Vo,19:74,22:$Vp,29:176,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:177,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:178,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:179,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:180,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{134:[1,181]},{2:$Vn,11:$Vo,19:74,22:$Vp,29:182,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:183,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:184,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:185,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},o($Vd,[2,75]),{2:$Vb1,13:$Vc1,24:186},{18:$V71,23:[1,189]},o($V9,[2,10]),{15:[1,190]},{2:$VI,11:$VJ,17:191,19:86,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8},o($V61,[2,15]),o($V61,[2,16]),{2:$Vb1,13:$Vc1,24:192},{2:$VM,19:94,26:193,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8},o($VK,[2,24]),o($Vd,[2,78]),o($VO,[2,104]),o([15,18,23,59,69,112,113,114],[2,145],{48:$VP,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31}),o($Vd1,[2,146],{48:$VP,113:$VR,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31}),o($Ve1,[2,153],{48:$VP,126:$V21}),o($Ve1,[2,154],{48:$VP,126:$V21}),o($Vf1,[2,155],{48:$VP,121:$VZ,122:$V_,126:$V21,127:$V31}),o($Vf1,[2,156],{48:$VP,121:$VZ,122:$V_,126:$V21,127:$V31}),o($Vf1,[2,157],{48:$VP,121:$VZ,122:$V_,126:$V21,127:$V31}),o($Va1,[2,158],{48:$VP}),o($Ve1,[2,159],{48:$VP,126:$V21}),o($Vg1,[2,147],{48:$VP,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31}),o($Vg1,[2,148],{48:$VP,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31}),o($Vg1,[2,149],{48:$VP,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31}),o($Vg1,[2,150],{48:$VP,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31}),o($Vg1,[2,151],{48:$VP,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31}),o($Vg1,[2,152],{48:$VP,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31}),{48:$VP,59:[1,194],112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},o($V41,[2,137]),{22:[1,195]},{22:[1,196]},{22:[1,197]},{22:[1,198]},{22:[1,199]},{22:[1,200]},{18:$Vh1,23:[1,201]},o($VK,[2,27]),o($VK,[2,29],{48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31}),{48:$VP,59:$Vi1,69:[1,203],112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{59:[1,205]},o($V41,[2,160]),{18:[1,206],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{23:[1,207],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{23:[1,208],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{23:[1,209],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{23:[1,210],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{22:[1,211]},{23:[1,212],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{23:[1,213],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{23:[1,214],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{23:[1,215],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},o($V9,[2,18]),{2:$Vj1,7:219,11:$Vk1,14:[1,217],19:233,30:216,31:218,32:220,33:221,34:222,35:223,36:224,37:225,38:226,39:227,40:228,41:229,42:230,43:231,44:$Vl1,45:$Vm1,46:$Vn1,47:$Vo1,53:$Vp1,65:10,67:235,70:$Vq1,72:$Vr1,74:$Vs1,80:$Vt1,84:$Vu1,85:$Vv1,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8},o($Vw1,[2,32]),{2:$Vb1,13:$Vc1,24:247},o($V9,[2,11]),o($V61,[2,14]),o($V9,[2,19]),o($VK,[2,21]),{2:$Vn,11:$Vo,19:74,22:$Vp,29:248,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{23:[1,249]},{23:[1,250]},{23:[1,251]},{23:[1,252]},{2:$Vn,11:$Vo,19:74,22:$Vp,29:253,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:254,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},o($V51,[2,182]),{2:$Vn,11:$Vo,19:74,22:$Vp,28:255,29:172,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},o($V41,[2,135]),{2:$Vn,11:$Vo,19:74,22:$Vp,29:256,66:72,68:$Vb,83:73,89:[1,257],90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:258,66:72,68:$Vb,83:73,89:[1,259],90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:260,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},o($V41,[2,166]),o($V41,[2,167]),o($V41,[2,168]),o($V41,[2,169]),{2:$Vn,11:$Vo,19:74,22:$Vp,29:261,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},o($V41,[2,171]),o($V41,[2,172]),o($V41,[2,173]),o($V41,[2,174]),{2:$Vj1,7:219,11:$Vk1,14:[1,262],19:233,31:263,32:220,33:221,34:222,35:223,36:224,37:225,38:226,39:227,40:228,41:229,42:230,43:231,44:$Vl1,45:$Vm1,46:$Vn1,47:$Vo1,53:$Vp1,65:10,67:235,70:$Vq1,72:$Vr1,74:$Vs1,80:$Vt1,84:$Vu1,85:$Vv1,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8},o($Vw1,[2,31]),o($Vx1,[2,34]),o($Vx1,[2,35]),o($Vx1,[2,36]),o($Vx1,[2,37]),o($Vx1,[2,38]),o($Vx1,[2,39]),o($Vx1,[2,40]),o($Vx1,[2,41]),o($Vx1,[2,42]),o($Vx1,[2,43]),o($Vx1,[2,44]),o($Vx1,[2,45]),o($Vx1,[2,46]),o($Vx1,[2,47]),o($Vx1,[2,60],{15:[1,264],23:[1,265]}),{2:$Va,11:$Vm,63:21,66:23,68:$Vb},o($Vy1,$Vz1,{95:271,11:$Vc,22:[1,267],48:[1,270],51:[1,268],52:[1,269],68:[1,266]}),{2:$Vh,64:272,96:$Vj},{22:[1,273]},{22:[1,274]},{22:[1,275]},{11:[1,277],22:[1,276]},{22:[1,278]},{2:$Vb1,13:$Vc1,24:279},{22:[1,280]},{2:$Vn,11:$Vo,15:[1,281],19:74,22:$Vp,29:282,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{15:[1,283]},{15:[1,284]},{22:[1,285]},o($V9,[2,20]),o($Vd1,[2,144],{48:$VP,113:$VR,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31}),o($V41,[2,138]),o($V41,[2,139]),o($V41,[2,140]),o($V41,[2,141]),{23:[1,286],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{18:[1,287],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},o($VK,[2,26]),{48:$VP,69:[1,288],112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{69:[1,289]},{48:$VP,69:[1,290],112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{69:[1,291]},{23:[1,292],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{23:[1,293],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},o($Vw1,[2,30]),o($Vx1,[2,33]),o($Vx1,[2,48]),o($Vx1,[2,83]),{2:$Vn,11:$Vo,19:74,22:$Vp,29:294,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},o($VK,$V81,{97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,66:72,83:73,19:74,28:171,29:172,27:295,2:$Vn,11:$Vo,22:$Vp,68:$Vb,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH}),{15:[1,296]},{15:[1,297]},{11:$VA1,49:[1,298],50:[1,299]},o($Vy1,[2,118]),{15:[1,301]},{2:$Vn,11:$Vo,19:74,22:$Vp,29:303,66:72,68:$Vb,71:302,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:303,66:72,68:$Vb,71:304,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vn,11:$Vo,19:74,22:$Vp,29:305,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{11:[1,309],19:307,67:308,81:306,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8},{82:[1,310]},{2:$Vn,11:$Vo,19:74,22:$Vp,29:311,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{84:[1,312]},{2:$Vn,11:$Vo,19:74,22:$Vp,29:313,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},o($Vx1,[2,52]),{15:[1,314],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},o($Vx1,[2,50]),o($Vx1,[2,51]),{23:[1,315]},o($V41,[2,142]),{2:$Vn,11:$Vo,19:74,22:$Vp,29:316,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},o($VB1,[2,106]),o($VB1,[2,109]),o($VB1,[2,107]),o($VB1,[2,108]),o($V41,[2,165]),o($V41,[2,170]),{48:$VP,69:[1,317],112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{18:$Vh1,23:[1,318]},o($Vx1,[2,56]),o($Vx1,[2,57]),{22:[1,319]},{22:[1,320]},o($Vy1,$Vz1,{95:321,48:$VC1}),o($Vx1,[2,79]),{23:[1,323]},{18:$VD1,23:$VE1,48:$VP,73:324,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{23:[1,326]},{23:[1,327],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{15:[1,328]},{2:$Va,11:$Vm,63:329},{2:$Vh,64:330,96:$Vj},o($Vy1,$Vz1,{95:271,48:$VC1}),{11:[1,331],66:332,68:$Vb,83:333},{23:[1,334],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{22:[1,335]},{23:[1,336],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},o($Vx1,[2,53]),{15:[1,337]},{23:[1,338],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{2:$Vh,64:339,96:$Vj},{15:[1,340]},{2:$Vn,11:$Vo,19:74,22:$Vp,29:341,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{23:[1,342]},o($Vy1,[2,119]),{11:$VA1},{15:[1,343]},{23:[2,84]},{2:$Vn,11:$Vo,19:74,22:$Vp,29:344,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{15:[1,345]},{2:$Vb1,13:$Vc1,24:346},{2:$Vn,11:$Vo,19:74,22:$Vp,29:347,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:$Vh,18:$Vi,64:348,96:$Vj},{15:[2,100]},{2:$Vb1,13:$Vc1,24:349,68:[1,350]},{2:$Vb1,13:$Vc1,24:351},{2:$Vb1,13:$Vc1,24:352},{2:$Vb1,13:$Vc1,24:353},{2:$Vn,11:$Vo,19:74,22:$Vp,29:354,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{2:[1,357],13:[1,356],54:355},o($Vx1,[2,49]),o($V41,[2,143]),{15:[1,358]},o($Vx1,[2,58]),{23:[1,359],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{15:[1,360]},o($Vx1,[2,81]),{18:$VD1,23:$VE1,48:$VP,73:361,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},o($Vx1,[2,82]),o($Vx1,$VF1,{75:362,78:364,77:$VG1,79:$VH1}),{15:[1,366],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{15:[2,99]},o($Vx1,[2,94]),{2:$Vn,11:$Vo,19:74,22:$Vp,29:367,66:72,68:$Vb,83:73,88:$V91,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},o($Vx1,[2,95]),o($Vx1,$Vy1),o($Vx1,[2,97]),{23:[1,368],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},o($Vx1,[2,59]),{14:[1,369],55:370,57:371,58:$VI1},o($Vx1,[2,63]),o($Vx1,[2,80]),{15:[1,373]},o($Vx1,[2,55]),{23:[2,85]},o($Vx1,[2,87]),{2:$Vb1,13:$Vc1,24:374},o($Vx1,$VF1,{78:364,75:375,77:$VG1,79:$VH1}),{22:[1,376]},{2:$Vn,11:$Vo,19:74,22:$Vp,29:377,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{48:$VP,59:$Vi1,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},o($Vx1,[2,98]),o($Vx1,[2,61]),{14:[2,69],56:378,57:379,58:$VI1,61:[1,380]},o($VJ1,[2,65]),{2:$Vn,11:$Vo,19:74,22:$Vp,29:381,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},o($Vx1,[2,54]),o($Vx1,[2,89]),o($Vx1,[2,90]),{2:$Vn,11:$Vo,19:74,22:$Vp,29:382,66:72,68:$Vb,83:73,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8,97:45,98:46,99:47,100:48,101:49,102:50,103:51,104:52,105:53,106:54,124:$Vq,128:$Vr,129:$Vs,130:$Vt,131:$Vu,132:$Vv,133:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:$VB,140:$VC,141:$VD,142:$VE,143:$VF,144:$VG,145:$VH},{23:[1,383],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{14:[1,384]},o($VJ1,[2,64]),{59:[1,385]},{48:$VP,59:[1,386],112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{23:[1,387],48:$VP,112:$VQ,113:$VR,114:$VS,115:$VT,116:$VU,117:$VV,118:$VW,119:$VX,120:$VY,121:$VZ,122:$V_,123:$V$,124:$V01,125:$V11,126:$V21,127:$V31},{2:$Vb1,13:$Vc1,24:388},o($Vx1,[2,62]),{2:$Vj1,7:219,11:$Vk1,19:233,30:390,31:218,32:220,33:221,34:222,35:223,36:224,37:225,38:226,39:227,40:228,41:229,42:230,43:231,44:$Vl1,45:$Vm1,46:$Vn1,47:$Vo1,53:$Vp1,60:389,65:10,67:235,70:$Vq1,72:$Vr1,74:$Vs1,80:$Vt1,84:$Vu1,85:$Vv1,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8},{2:$Vj1,7:219,11:$Vk1,19:233,30:390,31:218,32:220,33:221,34:222,35:223,36:224,37:225,38:226,39:227,40:228,41:229,42:230,43:231,44:$Vl1,45:$Vm1,46:$Vn1,47:$Vo1,53:$Vp1,60:391,65:10,67:235,70:$Vq1,72:$Vr1,74:$Vs1,80:$Vt1,84:$Vu1,85:$Vv1,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8},{2:$Vb1,13:$Vc1,24:392},o($Vx1,[2,93]),{14:[2,68]},o($VJ1,[2,67],{65:10,7:219,32:220,33:221,34:222,35:223,36:224,37:225,38:226,39:227,40:228,41:229,42:230,43:231,19:233,67:235,31:263,2:$Vj1,11:$Vk1,44:$Vl1,45:$Vm1,46:$Vn1,47:$Vo1,53:$Vp1,70:$Vq1,72:$Vr1,74:$Vs1,80:$Vt1,84:$Vu1,85:$Vv1,90:$V4,91:$V5,92:$V6,93:$V7,94:$V8}),o($VJ1,[2,66]),o([2,11,14,44,45,46,47,53,58,61,70,72,74,77,79,80,84,85,90,91,92,93,94],[2,92])],
defaultActions: {2:[2,1],19:[2,2],37:[2,122],324:[2,84],330:[2,100],348:[2,99],361:[2,85],389:[2,68]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse (input) {
    var self = this,
        stack = [0],
        tstack = [], // token stack
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    var args = lstack.slice.call(arguments, 1);

    //this.reductionCount = this.shiftCount = 0;

    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    // copy state
    for (var k in this.yy) {
      if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
        sharedState.yy[k] = this.yy[k];
      }
    }

    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);

    var ranges = lexer.options && lexer.options.ranges;

    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }

    function popStack (n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

_token_stack:
    var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length - 1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

_handle_error:
        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {
            var error_rule_depth;
            var errStr = '';

            // Return the rule stack depth where the nearest error rule can be found.
            // Return FALSE when no error recovery rule was found.
            function locateNearestErrorRecoveryRule(state) {
                var stack_probe = stack.length - 1;
                var depth = 0;

                // try to recover from error
                for(;;) {
                    // check for error recovery rule in this state
                    if ((TERROR.toString()) in table[state]) {
                        return depth;
                    }
                    if (state === 0 || stack_probe < 2) {
                        return false; // No suitable error recovery rule available.
                    }
                    stack_probe -= 2; // popStack(1): [symbol, action]
                    state = stack[stack_probe];
                    ++depth;
                }
            }

            if (!recovering) {
                // first see if there's any chance at hitting an error recovery rule:
                error_rule_depth = locateNearestErrorRecoveryRule(state);

                // Report error
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push("'"+this.terminals_[p]+"'");
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == EOF ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected,
                    recoverable: (error_rule_depth !== false)
                });
            } else if (preErrorSymbol !== EOF) {
                error_rule_depth = locateNearestErrorRecoveryRule(state);
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol === EOF || preErrorSymbol === EOF) {
                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                }

                // discard current lookahead and grab another
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            if (error_rule_depth === false) {
                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
            }
            popStack(error_rule_depth);

            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {
            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = lexer.yyleng;
                    yytext = lexer.yytext;
                    yylineno = lexer.yylineno;
                    yyloc = lexer.yylloc;
                    if (recovering > 0) {
                        recovering--;
                    }
                } else {
                    // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2:
                // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                }
                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3:
                // accept
                return true;
        }

    }

    return true;
}};

    //const {ErrorCom} = require(['../ts/ErrorCom']);
    /*---CLASES IMPORTADAS---*/
    const {Tipo} = require("../dist/AST/Tipo");
    const {Print} = require("../dist/Instrucciones/Print");
    const {Declaracion} = require("../dist/Instrucciones/Declaracion");
    const {DeclaracionArray} = require("../dist/Instrucciones/DeclaracionArray");
    const {Asignacion} = require("../dist/Instrucciones/Asignacion");
    const {While} = require("../dist/Instrucciones/While");
    const {If} = require("../dist/Instrucciones/If");
    const {DoWhile} = require("../dist/Instrucciones/DoWhile");
    const {Funcion} = require("../dist/Instrucciones/Funcion");
    const {Struct} = require("../dist/Instrucciones/Struct");
    const {Switch} = require("../dist/Instrucciones/Switch");
    const {GraficarTS} = require("../dist/Instrucciones/GraficarTS");
    const {Ternario} = require("../dist/Expresiones/Ternario");
    const {AccesoAtributo} = require("../dist/Expresiones/AccesoAtributo");
    const {DeclaracionStruct} = require("../dist/Instrucciones/DeclaracionStruct");
    const {SwitchCaso} = require("../dist/Instrucciones/SwitchCaso");
    const {Break} = require("../dist/Instrucciones/Break");
    const {Return} = require("../dist/Instrucciones/Return");
    const {Continue} = require("../dist/Instrucciones/Continue");
    const {FuncionReturn} = require("../dist/Instrucciones/FuncionReturn");
    const {Parametro} = require("../dist/Instrucciones/Parametro");
    const {ParametroReturn} = require("../dist/Expresiones/ParametroReturn");
    const {For} = require("../dist/Instrucciones/For");
    const {Forin} = require("../dist/Instrucciones/Forin");
    const {Primitivo} = require("../dist/Expresiones/Primitivo");
    const {AccesoVariable} = require("../dist/Expresiones/AccesoVariable");
    const {ArrbegEnd} = require("../dist/Expresiones/ArrbegEnd");
    const {Operacion, Operador} = require("../dist/Expresiones/Operacion");
    const {Objeto} = require("../dist/Expresiones/Objeto");
    const {Atributo} = require("../dist/Expresiones/Atributo");
    const {AccesoArray} = require("../dist/Expresiones/AccesoArray");
    const {AccesoAtribArray} = require("../dist/Expresiones/AccesoAtribArray");
    const {AsignacionArray} = require("../dist/Instrucciones/AsignacionArray");
    const {IncrDecr} = require("../dist/Instrucciones/IncrDecr");
    const {Push} = require("../dist/Instrucciones/Push");
    const {Pop} = require("../dist/Instrucciones/Pop");
    const {OperacionCadena, OperadorCadena} = require("../dist/Expresiones/OperacionCadena");
    const {OperadorNativa, OperacionNativa} = require("../dist/Expresiones/OperacionNativa");
    const {ConcatenacionString} = require("../dist/Expresiones/ConcatenacionString");
    const {ErrorG} = require("../dist/Objetos/ErrorG");

    /*---CODIGO INCRUSTADO---*/
    var errores = [];
    var elementos = [];

    function genError(desc,linea,columna){
        let erro =  new ErrorG('sintactico',desc,linea,columna);
        errores.push(erro);
    }

    function reiniciarArrays(instrucciones){
        var elemento = {'id':'instrucciones','cont':instrucciones};
        var elemento1 = {'id':'listaErrores','cont':errores};
        elementos.push(elemento);
        elementos.push(elemento1);
        var aux = elementos;
        elementos = [];
        errores = [];
        return aux;
    }
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"ranges":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip comments */
break;
case 1:this.begin('comment');
break;
case 2:this.popState();
break;
case 3:/* skip comment content*/
break;
case 4:/* skip whitespace */
break;
case 5:return 13; 
break;
case 6:return 14;
break;
case 7:return 22;
break;
case 8:return 23;
break;
case 9:return 68;
break;
case 10:return 69;
break;
case 11:return 18;
break;
case 12:return 59;
break;
case 13:return 15;
break;
case 14:return "PRINTLN";
break;
case 15:return "PRINT";
break;
case 16:return 20;
break;
case 17:return 21;
break;
case 18:return 74;
break;
case 19:return 79;
break;
case 20:return 77;
break;
case 21:return 84;
break;
case 22:return 85;
break;
case 23:return 80;
break;
case 24:return 45;
break;
case 25:return 46;
break;
case 26:return 53;
break;
case 27:return 58;
break;
case 28:return 61;
break;
case 29:return 140;
break;
case 30:return 139;
break;
case 31:return 47;
break;
case 32:return 93;
break;
case 33:return 92;
break;
case 34:return 91;
break;
case 35:return 94;
break;
case 36:return 90;
break;
case 37:return 10;
break;
case 38:return 88;
break;
case 39:return 89;
break;
case 40:return 'STR_FUNCTION';
break;
case 41:return 82;
break;
case 42:return 129;
break;
case 43:return 130;
break;
case 44:return 131;
break;
case 45:return 132;
break;
case 46:return 133;
break;
case 47:return 134;
break;
case 48:return 135;
break;
case 49:return 136;
break;
case 50:return 137;
break;
case 51:return 138;
break;
case 52:return 49;
break;
case 53:return 50;
break;
case 54:return 44;
break;
case 55:return 110;
break;
case 56:return 111;
break;
case 57:return 107;
break;
case 58:return 108;
break;
case 59:return 109;
break;
case 60:return 118;
break;
case 61:return 119;
break;
case 62:return 115;
break;
case 63:return 117;
break;
case 64:return 120;
break;
case 65:return 116;
break;
case 66:return 114;
break;
case 67:return 113;
break;
case 68:return 125;
break;
case 69:return 128;
break;
case 70:return 96;
break;
case 71:return 'OP_MASIG';
break;
case 72:return 'OP_RESIG';
break;
case 73:return 'OP_PORIG';
break;
case 74:return 'OP_DIVIG';
break;
case 75:return 'OP_MODIG';
break;
case 76:return 51;
break;
case 77:return 123;
break;
case 78:return 52;
break;
case 79:return 124;
break;
case 80:return 121;
break;
case 81:return 122;
break;
case 82:return 127;
break;
case 83:return 48;
break;
case 84:return 126;
break;
case 85:return 112;
break;
case 86:return 'OP_HASH';
break;
case 87:return 145;
break;
case 88:return 11;
break;
case 89:return 11;
break;
case 90:return 142;
break;
case 91:return 141;
break;
case 92:yy_.yytext = yy_.yytext.slice(1,-1); return 143;
break;
case 93:yy_.yytext = yy_.yytext.slice(1,-1); return 143;
break;
case 94:return 144;
break;
case 95:return 144;
break;
case 96:return 4;
break;
case 97:return 'INVALID';
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:\/\*)/,/^(?:\*\/)/,/^(?:.)/,/^(?:\s+)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?::)/,/^(?:;)/,/^(?:println\b)/,/^(?:print\b)/,/^(?:void\b)/,/^(?:main\b)/,/^(?:if\b)/,/^(?:elseif\b)/,/^(?:else\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:for\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:return\b)/,/^(?:boolean\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:String\b)/,/^(?:struct\b)/,/^(?:begin\b)/,/^(?:end\b)/,/^(?:function\b)/,/^(?:in\b)/,/^(?:pow\b)/,/^(?:sqrt\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:string\b)/,/^(?:typeof\b)/,/^(?:push\b)/,/^(?:pop\b)/,/^(?:graficar_ts\b)/,/^(?:caracterOfPosition\b)/,/^(?:subString\b)/,/^(?:length\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:<=)/,/^(?:<)/,/^(?:==)/,/^(?:>=)/,/^(?:>)/,/^(?:!=)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:&)/,/^(?:!)/,/^(?:=)/,/^(?:\+=)/,/^(?:-=)/,/^(?:\*=)/,/^(?:\/=)/,/^(?:%=)/,/^(?:\+\+)/,/^(?:\+)/,/^(?:--)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:\.)/,/^(?:\^)/,/^(?:\?)/,/^(?:#)/,/^(?:null\b)/,/^(?:[A-Z][a-zA-Z0-9_]*)/,/^(?:[a-zA-Z][a-zA-Z0-9_]*)/,/^(?:(((0|([1-9])([0-9])*))\.((0|([1-9])([0-9])*))?(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD]?|\.((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD]?|((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))[fFdD]?|((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD])(?=([^\w]|$)))/,/^(?:((0|([1-9])([0-9])*)))/,/^(?:"")/,/^(?:"([^"]|(\\.))*")/,/^(?:\\'([^']|(\\.))*\\')/,/^(?:\\'\\')/,/^(?:$)/,/^(?:.)/],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97],"inclusive":true},"INITIAL":{"rules":[0,1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = Gramatica;
exports.Parser = Gramatica.Parser;
exports.parse = function () { return Gramatica.parse.apply(Gramatica, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"../dist/AST/Tipo":3,"../dist/Expresiones/AccesoArray":4,"../dist/Expresiones/AccesoAtribArray":5,"../dist/Expresiones/AccesoAtributo":6,"../dist/Expresiones/AccesoVariable":7,"../dist/Expresiones/ArrbegEnd":8,"../dist/Expresiones/Atributo":9,"../dist/Expresiones/ConcatenacionString":10,"../dist/Expresiones/Objeto":11,"../dist/Expresiones/Operacion":12,"../dist/Expresiones/OperacionCadena":13,"../dist/Expresiones/OperacionNativa":14,"../dist/Expresiones/ParametroReturn":15,"../dist/Expresiones/Primitivo":16,"../dist/Expresiones/Ternario":17,"../dist/Instrucciones/Asignacion":18,"../dist/Instrucciones/AsignacionArray":19,"../dist/Instrucciones/Break":20,"../dist/Instrucciones/Continue":21,"../dist/Instrucciones/Declaracion":22,"../dist/Instrucciones/DeclaracionArray":23,"../dist/Instrucciones/DeclaracionStruct":24,"../dist/Instrucciones/DoWhile":25,"../dist/Instrucciones/For":26,"../dist/Instrucciones/Forin":27,"../dist/Instrucciones/Funcion":28,"../dist/Instrucciones/FuncionReturn":29,"../dist/Instrucciones/GraficarTS":30,"../dist/Instrucciones/If":31,"../dist/Instrucciones/IncrDecr":32,"../dist/Instrucciones/Parametro":33,"../dist/Instrucciones/Pop":34,"../dist/Instrucciones/Print":35,"../dist/Instrucciones/Push":36,"../dist/Instrucciones/Return":37,"../dist/Instrucciones/Struct":38,"../dist/Instrucciones/Switch":39,"../dist/Instrucciones/SwitchCaso":40,"../dist/Instrucciones/While":41,"../dist/Objetos/ErrorG":43,"_process":56,"fs":54,"path":55}],45:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var stringExpresion = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,14],$V1=[1,19],$V2=[1,21],$V3=[1,22],$V4=[1,23],$V5=[1,24],$V6=[1,25],$V7=[1,26],$V8=[1,27],$V9=[1,28],$Va=[1,29],$Vb=[1,30],$Vc=[1,31],$Vd=[1,32],$Ve=[1,33],$Vf=[1,15],$Vg=[1,16],$Vh=[1,17],$Vi=[1,18],$Vj=[1,20],$Vk=[1,51],$Vl=[1,50],$Vm=[1,35],$Vn=[1,36],$Vo=[1,44],$Vp=[1,45],$Vq=[1,46],$Vr=[1,47],$Vs=[1,48],$Vt=[1,49],$Vu=[1,37],$Vv=[1,38],$Vw=[1,39],$Vx=[1,40],$Vy=[1,41],$Vz=[1,42],$VA=[1,43],$VB=[4,18,19,22,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],$VC=[4,18,19,22,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,47,48],$VD=[4,18,22,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],$VE=[4,18,22,28,29,30,32],$VF=[4,18,22,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45],$VG=[4,18,22,28,29,30,31,32,33,34,35,36,37,38,41,42,43],$VH=[4,18,22,28,29,30,31,32,33,34,35,36,37,38];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"EOF":4,"expresion":5,"primitivas":6,"logicas":7,"operadores":8,"relacionales":9,"expresion_ternario":10,"incr_decr":11,"nativas":12,"expresion_arr_arreglo":13,"expresion_atributos":14,"otras_nativas":15,"ID_VAR":16,"CORCHI":17,"CORCHD":18,"OP_CALL":19,"LENGTH":20,"PARI":21,"PARD":22,"STR_POP":23,"UPPERCASE":24,"LOWERCASE":25,"CHARPOS":26,"SUBSTRING":27,"COMA":28,"OP_TER":29,"DOSPUNT":30,"OP_AND":31,"OP_OR":32,"OP_DOBIG":33,"OP_DIF":34,"OP_MAYIG":35,"OP_MENIG":36,"OP_MEN":37,"OP_MAY":38,"OP_MULT":39,"OP_DIVI":40,"OP_SUMA":41,"OP_RESTA":42,"OP_AMP":43,"OP_ELV":44,"OP_MOD":45,"OP_NEG":46,"OP_INCR":47,"OP_DECR":48,"STR_POW":49,"STR_SQRT":50,"STR_SIN":51,"STR_COS":52,"STR_TAN":53,"tiposVar":54,"STR_PARSE":55,"STR_TOINT":56,"STR_TODOUBLE":57,"STR_string":58,"STR_TYPEOF":59,"STR_FALSE":60,"STR_TRUE":61,"ENTERO":62,"FLOTANTE":63,"parametros_funcion_return":64,"STR_NULL":65,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",16:"ID_VAR",17:"CORCHI",18:"CORCHD",19:"OP_CALL",20:"LENGTH",21:"PARI",22:"PARD",23:"STR_POP",24:"UPPERCASE",25:"LOWERCASE",26:"CHARPOS",27:"SUBSTRING",28:"COMA",29:"OP_TER",30:"DOSPUNT",31:"OP_AND",32:"OP_OR",33:"OP_DOBIG",34:"OP_DIF",35:"OP_MAYIG",36:"OP_MENIG",37:"OP_MEN",38:"OP_MAY",39:"OP_MULT",40:"OP_DIVI",41:"OP_SUMA",42:"OP_RESTA",43:"OP_AMP",44:"OP_ELV",45:"OP_MOD",46:"OP_NEG",47:"OP_INCR",48:"OP_DECR",49:"STR_POW",50:"STR_SQRT",51:"STR_SIN",52:"STR_COS",53:"STR_TAN",54:"tiposVar",55:"STR_PARSE",56:"STR_TOINT",57:"STR_TODOUBLE",58:"STR_string",59:"STR_TYPEOF",60:"STR_FALSE",61:"STR_TRUE",62:"ENTERO",63:"FLOTANTE",64:"parametros_funcion_return",65:"STR_NULL"},
productions_: [0,[3,1],[3,2],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[13,4],[14,3],[14,5],[14,5],[14,5],[14,5],[14,6],[14,8],[10,5],[7,3],[7,3],[9,3],[9,3],[9,3],[9,3],[9,3],[9,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,2],[8,2],[11,2],[11,2],[12,6],[12,4],[12,4],[12,4],[12,4],[15,6],[15,4],[15,4],[15,4],[15,4],[6,1],[6,1],[6,1],[6,1],[6,1],[6,4],[6,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
console.log("EOF encontrado");return [];
break;
case 2:
this.$ = $$[$0-1];return this.$;
break;
case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11: case 12:
this.$ = $$[$0];
break;
case 14:
this.$ = new AccesoAtribArray($$[$0-3],$$[$0-1],_$[$0-3].first_line, _$[$0-3].first_column);
break;
case 15:
this.$ = new AccesoAtributo($$[$0-2],$$[$0],_$[$0-2].first_line, _$[$0-2].first_column);
break;
case 16:
this.$ = new OperacionCadena($$[$0-4],null,null,OperadorCadena.LENGTH,_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 17:
this.$ = new OperacionCadena($$[$0-4],null,null,OperadorCadena.POP,_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 18:
this.$ = new OperacionCadena($$[$0-4],null,null,OperadorCadena.UPPERCASE,_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 19:
this.$ = new OperacionCadena($$[$0-4],null,null,OperadorCadena.LOWERCASE,_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 20:
this.$ = new OperacionCadena($$[$0-5],$$[$0-1],null,OperadorCadena.CHARPOS,_$[$0-5].first_line, _$[$0-5].first_column);
break;
case 21:
this.$ = new OperacionCadena($$[$0-7],$$[$0-3],$$[$0-1],OperadorCadena.SUBSTRING,_$[$0-7].first_line, _$[$0-7].first_column);
break;
case 22:
this.$ = new Ternario($$[$0-4],$$[$0-2],$$[$0],_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 23:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AND, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 24:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.OR, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 25:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.IGUAL_IGUAL, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 26:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIFERENTE_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 27:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 28:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 29:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 30:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 31:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MULTIPLICACION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 32:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIVISION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 33:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.SUMA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 34:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.RESTA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 35:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AMPERSON, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 36:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.ELEVADO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 37:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MODULO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 38:
this.$ = $$[$0-1];
break;
case 39:
this.$ = new Operacion($$[$0],null,Operador.MENOS_UNARIO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 40:
this.$ = new Operacion($$[$0],null,Operador.NOT, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 41:
this.$ = new Operacion($$[$0-1],null,Operador.INCREMENTO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 42:
this.$ = new Operacion($$[$0-1],null,Operador.DECREMENTO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 43:
this.$ = new Operacion($$[$0-3],$$[$0-1],Operador.POW, _$[$0-5].first_line, _$[$0-5].first_column);
break;
case 44:
this.$ = new Operacion($$[$0-1],null,Operador.SQRT, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 45:
this.$ = new Operacion($$[$0-1],null,Operador.SIN, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 46:
this.$ = new Operacion($$[$0-1],null,Operador.COS, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 47:
this.$ = new Operacion($$[$0-1],null,Operador.TAN, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 48:
this.$ = new OperacionNativa(OperadorNativa.PARSE,$$[$0-5],$$[$0-1],_$[$0-5].first_line,_$[$0-5].first_column);
break;
case 49:
this.$ = new OperacionNativa(OperadorNativa.TOINT,Tipo.NULL,$$[$0-1],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 50:
this.$ = new OperacionNativa(OperadorNativa.TODOUBLE,Tipo.NULL,$$[$0-1],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 51:
this.$ = new OperacionNativa(OperadorNativa.STRING,Tipo.NULL,$$[$0-1],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 52:
this.$ = new OperacionNativa(OperadorNativa.TYPEOF,Tipo.NULL,$$[$0-1],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 53:
this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column);
break;
case 54:
this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column);
break;
case 55:
this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
break;
case 56:
let primitivo = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);primitivo.isFlotante=true;this.$ = primitivo;
break;
case 57:
this.$ = new AccesoVariable($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 58:
this.$ = new FuncionReturn($$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 59:
this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column);
break;
}
},
table: [{2:$V0,3:1,4:[1,2],5:3,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{1:[3]},{1:[2,1]},{4:[1,34],19:$Vk,29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},o($VB,[2,3],{47:[1,52],48:[1,53]}),o($VB,[2,4]),o($VB,[2,5]),o($VB,[2,6]),o($VB,[2,7]),o($VB,[2,8]),o($VB,[2,9]),o($VB,[2,10]),o($VB,[2,11]),o($VB,[2,12]),o($VB,[2,13]),o($VC,[2,53]),o($VC,[2,54]),o($VC,[2,55]),o($VC,[2,56]),o($VC,[2,57],{17:[1,55],21:[1,54]}),o($VC,[2,59]),{2:$V0,5:56,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:57,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:58,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{21:[1,59]},{21:[1,60]},{21:[1,61]},{21:[1,62]},{21:[1,63]},{19:[1,64]},{21:[1,65]},{21:[1,66]},{21:[1,67]},{21:[1,68]},{1:[2,2]},{2:$V0,5:69,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:70,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:71,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:72,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:73,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:74,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:75,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:76,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:77,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:78,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:79,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:80,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:81,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:82,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:83,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:84,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{16:[1,85],20:[1,86],23:[1,87],24:[1,88],25:[1,89],26:[1,90],27:[1,91]},o($VB,[2,41]),o($VB,[2,42]),{64:[1,92]},{2:$V0,5:93,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{19:$Vk,22:[1,94],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},o($VD,[2,39],{19:$Vk}),o($VD,[2,40],{19:$Vk}),{2:$V0,5:95,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:96,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:97,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:98,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:99,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{55:[1,100]},{2:$V0,5:101,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:102,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:103,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:104,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},o([4,18,22,28,29,30,31,32],[2,23],{19:$Vk,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA}),o($VE,[2,24],{19:$Vk,31:$Vm,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA}),o($VF,[2,31],{19:$Vk,44:$Vz}),o($VF,[2,32],{19:$Vk,44:$Vz}),o($VG,[2,33],{19:$Vk,39:$Vu,40:$Vv,44:$Vz,45:$VA}),o($VG,[2,34],{19:$Vk,39:$Vu,40:$Vv,44:$Vz,45:$VA}),o($VG,[2,35],{19:$Vk,39:$Vu,40:$Vv,44:$Vz,45:$VA}),o($VD,[2,36],{19:$Vk}),o($VF,[2,37],{19:$Vk,44:$Vz}),o($VH,[2,25],{19:$Vk,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA}),o($VH,[2,26],{19:$Vk,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA}),o($VH,[2,27],{19:$Vk,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA}),o($VH,[2,28],{19:$Vk,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA}),o($VH,[2,29],{19:$Vk,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA}),o($VH,[2,30],{19:$Vk,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA}),{19:$Vk,29:$Vl,30:[1,105],31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},o($VB,[2,15]),{21:[1,106]},{21:[1,107]},{21:[1,108]},{21:[1,109]},{21:[1,110]},{21:[1,111]},{22:[1,112]},{18:[1,113],19:$Vk,29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},o($VB,[2,38]),{19:$Vk,28:[1,114],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},{19:$Vk,22:[1,115],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},{19:$Vk,22:[1,116],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},{19:$Vk,22:[1,117],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},{19:$Vk,22:[1,118],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},{21:[1,119]},{19:$Vk,22:[1,120],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},{19:$Vk,22:[1,121],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},{19:$Vk,22:[1,122],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},{19:$Vk,22:[1,123],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},{2:$V0,5:124,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{22:[1,125]},{22:[1,126]},{22:[1,127]},{22:[1,128]},{2:$V0,5:129,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},{2:$V0,5:130,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},o($VC,[2,58]),o($VB,[2,14]),{2:$V0,5:131,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},o($VB,[2,44]),o($VB,[2,45]),o($VB,[2,46]),o($VB,[2,47]),{2:$V0,5:132,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},o($VB,[2,49]),o($VB,[2,50]),o($VB,[2,51]),o($VB,[2,52]),o($VE,[2,22],{19:$Vk,31:$Vm,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA}),o($VB,[2,16]),o($VB,[2,17]),o($VB,[2,18]),o($VB,[2,19]),{19:$Vk,22:[1,133],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},{19:$Vk,28:[1,134],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},{19:$Vk,22:[1,135],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},{19:$Vk,22:[1,136],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},o($VB,[2,20]),{2:$V0,5:137,6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,16:$V1,21:$V2,42:$V3,46:$V4,49:$V5,50:$V6,51:$V7,52:$V8,53:$V9,54:$Va,56:$Vb,57:$Vc,58:$Vd,59:$Ve,60:$Vf,61:$Vg,62:$Vh,63:$Vi,65:$Vj},o($VB,[2,43]),o($VB,[2,48]),{19:$Vk,22:[1,138],29:$Vl,31:$Vm,32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,41:$Vw,42:$Vx,43:$Vy,44:$Vz,45:$VA},o($VB,[2,21])],
defaultActions: {2:[2,1],34:[2,2]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse (input) {
    var self = this,
        stack = [0],
        tstack = [], // token stack
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    var args = lstack.slice.call(arguments, 1);

    //this.reductionCount = this.shiftCount = 0;

    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    // copy state
    for (var k in this.yy) {
      if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
        sharedState.yy[k] = this.yy[k];
      }
    }

    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);

    var ranges = lexer.options && lexer.options.ranges;

    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }

    function popStack (n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

_token_stack:
    var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length - 1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

_handle_error:
        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {
            var error_rule_depth;
            var errStr = '';

            // Return the rule stack depth where the nearest error rule can be found.
            // Return FALSE when no error recovery rule was found.
            function locateNearestErrorRecoveryRule(state) {
                var stack_probe = stack.length - 1;
                var depth = 0;

                // try to recover from error
                for(;;) {
                    // check for error recovery rule in this state
                    if ((TERROR.toString()) in table[state]) {
                        return depth;
                    }
                    if (state === 0 || stack_probe < 2) {
                        return false; // No suitable error recovery rule available.
                    }
                    stack_probe -= 2; // popStack(1): [symbol, action]
                    state = stack[stack_probe];
                    ++depth;
                }
            }

            if (!recovering) {
                // first see if there's any chance at hitting an error recovery rule:
                error_rule_depth = locateNearestErrorRecoveryRule(state);

                // Report error
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push("'"+this.terminals_[p]+"'");
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == EOF ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected,
                    recoverable: (error_rule_depth !== false)
                });
            } else if (preErrorSymbol !== EOF) {
                error_rule_depth = locateNearestErrorRecoveryRule(state);
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol === EOF || preErrorSymbol === EOF) {
                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                }

                // discard current lookahead and grab another
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            if (error_rule_depth === false) {
                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
            }
            popStack(error_rule_depth);

            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {
            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = lexer.yyleng;
                    yytext = lexer.yytext;
                    yylineno = lexer.yylineno;
                    yyloc = lexer.yylloc;
                    if (recovering > 0) {
                        recovering--;
                    }
                } else {
                    // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2:
                // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                }
                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3:
                // accept
                return true;
        }

    }

    return true;
}};

    //const {ErrorCom} = require(['../ts/ErrorCom']);
    /*---CLASES IMPORTADAS---*/
    const {Tipo} = require("../../dist/AST/Tipo");
    const {Print} = require("../../dist/Instrucciones/Print");
    const {Declaracion} = require("../../dist/Instrucciones/Declaracion");
    const {DeclaracionArray} = require("../../dist/Instrucciones/DeclaracionArray");
    const {Asignacion} = require("../../dist/Instrucciones/Asignacion");
    const {While} = require("../../dist/Instrucciones/While");
    const {If} = require("../../dist/Instrucciones/If");
    const {DoWhile} = require("../../dist/Instrucciones/DoWhile");
    const {Funcion} = require("../../dist/Instrucciones/Funcion");
    const {Struct} = require("../../dist/Instrucciones/Struct");
    const {Switch} = require("../../dist/Instrucciones/Switch");
    const {Ternario} = require("../../dist/Expresiones/Ternario");
    const {AccesoAtributo} = require("../../dist/Expresiones/AccesoAtributo");
    const {DeclaracionStruct} = require("../../dist/Instrucciones/DeclaracionStruct");
    const {SwitchCaso} = require("../../dist/Instrucciones/SwitchCaso");
    const {Break} = require("../../dist/Instrucciones/Break");
    const {Return} = require("../../dist/Instrucciones/Return");
    const {Continue} = require("../../dist/Instrucciones/Continue");
    const {FuncionReturn} = require("../../dist/Instrucciones/FuncionReturn");
    const {Parametro} = require("../../dist/Instrucciones/Parametro");
    const {ParametroReturn} = require("../../dist/Expresiones/ParametroReturn");
    const {For} = require("../../dist/Instrucciones/For");
    const {Forin} = require("../../dist/Instrucciones/Forin");
    const {Primitivo} = require("../../dist/Expresiones/Primitivo");
    const {AccesoVariable} = require("../../dist/Expresiones/AccesoVariable");
    const {ArrbegEnd} = require("../../dist/Expresiones/ArrbegEnd");
    const {Operacion, Operador} = require("../../dist/Expresiones/Operacion");
    const {Objeto} = require("../../dist/Expresiones/Objeto");
    const {Atributo} = require("../../dist/Expresiones/Atributo");
    const {AccesoArray} = require("../../dist/Expresiones/AccesoArray");
    const {AccesoAtribArray} = require("../../dist/Expresiones/AccesoAtribArray");
    const {AsignacionArray} = require("../../dist/Instrucciones/AsignacionArray");
    const {IncrDecr} = require("../../dist/Instrucciones/IncrDecr");
    const {Push} = require("../../dist/Instrucciones/Push");
    const {Pop} = require("../../dist/Instrucciones/Pop");
    const {OperacionCadena, OperadorCadena} = require("../../dist/Expresiones/OperacionCadena");
    const {OperadorNativa, OperacionNativa} = require("../../dist/Expresiones/OperacionNativa");
    const {ConcatenacionString} = require("../../dist/Expresiones/ConcatenacionString");
    // const {ErrorG} = require("../../dist/Objetos/ErrorG");

    /*---CODIGO INCRUSTADO---*/
    // var errores = [];
    // var elementos = [];

    // function genError(desc,linea,columna){
    //     let erro =  new ErrorG('sintactico',desc,linea,columna);
    //     errores.push(erro);
    // }

    // function reiniciarArrays(instrucciones){
    //     var elemento = {'id':'instrucciones','cont':instrucciones};
    //     var elemento1 = {'id':'listaErrores','cont':errores};
    //     elementos.push(elemento);
    //     elementos.push(elemento1);
    //     var aux = elementos;
    //     elementos = [];
    //     errores = [];
    //     return aux;
    // }
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"ranges":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip comments */
break;
case 1:this.begin('comment');
break;
case 2:this.popState();
break;
case 3:/* skip comment content*/
break;
case 4:/* skip whitespace */
break;
case 5:return 'BRACKI'; 
break;
case 6:return 'BRACKD';
break;
case 7:return 21;
break;
case 8:return 22;
break;
case 9:return 17;
break;
case 10:return 18;
break;
case 11:return 28;
break;
case 12:return 30;
break;
case 13:return 'PUNTCOMA';
break;
case 14:return 49;
break;
case 15:return 50;
break;
case 16:return 51;
break;
case 17:return 52;
break;
case 18:return 53;
break;
case 19:return 55;
break;
case 20:return 56;
break;
case 21:return 57;
break;
case 22:return 58;
break;
case 23:return 59;
break;
case 24:return 'STR_PUSH';
break;
case 25:return 23;
break;
case 26:return 26;
break;
case 27:return 27;
break;
case 28:return 20;
break;
case 29:return 24;
break;
case 30:return 25;
break;
case 31:return 36;
break;
case 32:return 37;
break;
case 33:return 33;
break;
case 34:return 35;
break;
case 35:return 38;
break;
case 36:return 34;
break;
case 37:return 32;
break;
case 38:return 31;
break;
case 39:return 43;
break;
case 40:return 46;
break;
case 41:return 'OP_IGUAL';
break;
case 42:return 'OP_MASIG';
break;
case 43:return 'OP_RESIG';
break;
case 44:return 'OP_PORIG';
break;
case 45:return 'OP_DIVIG';
break;
case 46:return 'OP_MODIG';
break;
case 47:return 47;
break;
case 48:return 41;
break;
case 49:return 48;
break;
case 50:return 42;
break;
case 51:return 39;
break;
case 52:return 40;
break;
case 53:return 45;
break;
case 54:return 19;
break;
case 55:return 44;
break;
case 56:return 29;
break;
case 57:return 'OP_HASH';
break;
case 58:return 65;
break;
case 59:return 16;
break;
case 60:return 16;
break;
case 61:return 63;
break;
case 62:return 62;
break;
case 63:yy_.yytext = yy_.yytext.slice(1,-1); return 'STRINGL';
break;
case 64:yy_.yytext = yy_.yytext.slice(1,-1); return 'STRINGL';
break;
case 65:return 'CHARL';
break;
case 66:return 'CHARL';
break;
case 67:return 4;
break;
case 68:return 'INVALID';
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:\/\*)/,/^(?:\*\/)/,/^(?:.)/,/^(?:\s+)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?::)/,/^(?:;)/,/^(?:pow\b)/,/^(?:sqrt\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:string\b)/,/^(?:typeof\b)/,/^(?:push\b)/,/^(?:pop\b)/,/^(?:caracterOfPosition\b)/,/^(?:subString\b)/,/^(?:length\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:<=)/,/^(?:<)/,/^(?:==)/,/^(?:>=)/,/^(?:>)/,/^(?:!=)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:&)/,/^(?:!)/,/^(?:=)/,/^(?:\+=)/,/^(?:-=)/,/^(?:\*=)/,/^(?:\/=)/,/^(?:%=)/,/^(?:\+\+)/,/^(?:\+)/,/^(?:--)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:\.)/,/^(?:\^)/,/^(?:\?)/,/^(?:#)/,/^(?:null\b)/,/^(?:[A-Z][a-zA-Z0-9_]*)/,/^(?:[a-zA-Z][a-zA-Z0-9_]*)/,/^(?:(((0|([1-9])([0-9])*))\.((0|([1-9])([0-9])*))?(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD]?|\.((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD]?|((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))[fFdD]?|((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD])(?=([^\w]|$)))/,/^(?:((0|([1-9])([0-9])*)))/,/^(?:"")/,/^(?:"([^"]|(\\.))*")/,/^(?:\\'([^']|(\\.))*\\')/,/^(?:\\'\\')/,/^(?:$)/,/^(?:.)/],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68],"inclusive":true},"INITIAL":{"rules":[0,1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = stringExpresion;
exports.Parser = stringExpresion.Parser;
exports.parse = function () { return stringExpresion.parse.apply(stringExpresion, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"../../dist/AST/Tipo":3,"../../dist/Expresiones/AccesoArray":4,"../../dist/Expresiones/AccesoAtribArray":5,"../../dist/Expresiones/AccesoAtributo":6,"../../dist/Expresiones/AccesoVariable":7,"../../dist/Expresiones/ArrbegEnd":8,"../../dist/Expresiones/Atributo":9,"../../dist/Expresiones/ConcatenacionString":10,"../../dist/Expresiones/Objeto":11,"../../dist/Expresiones/Operacion":12,"../../dist/Expresiones/OperacionCadena":13,"../../dist/Expresiones/OperacionNativa":14,"../../dist/Expresiones/ParametroReturn":15,"../../dist/Expresiones/Primitivo":16,"../../dist/Expresiones/Ternario":17,"../../dist/Instrucciones/Asignacion":18,"../../dist/Instrucciones/AsignacionArray":19,"../../dist/Instrucciones/Break":20,"../../dist/Instrucciones/Continue":21,"../../dist/Instrucciones/Declaracion":22,"../../dist/Instrucciones/DeclaracionArray":23,"../../dist/Instrucciones/DeclaracionStruct":24,"../../dist/Instrucciones/DoWhile":25,"../../dist/Instrucciones/For":26,"../../dist/Instrucciones/Forin":27,"../../dist/Instrucciones/Funcion":28,"../../dist/Instrucciones/FuncionReturn":29,"../../dist/Instrucciones/If":31,"../../dist/Instrucciones/IncrDecr":32,"../../dist/Instrucciones/Parametro":33,"../../dist/Instrucciones/Pop":34,"../../dist/Instrucciones/Print":35,"../../dist/Instrucciones/Push":36,"../../dist/Instrucciones/Return":37,"../../dist/Instrucciones/Struct":38,"../../dist/Instrucciones/Switch":39,"../../dist/Instrucciones/SwitchCaso":40,"../../dist/Instrucciones/While":41,"_process":56,"fs":54,"path":55}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{"./Tipo":51}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerarNativas = void 0;
var Resultado3D_1 = require("../AST/Resultado3D");
var GenerarNativas = /** @class */ (function () {
    function GenerarNativas() {
    }
    GenerarNativas.prototype.generar = function (temporales) {
        var resultado = '';
        if (temporales.usoPrintStrings) {
            resultado += 'void printString()\{\n';
            temporales.ultimoTemp += 1;
            resultado += '\tt' + temporales.ultimoTemp + '= P + 1;\n';
            temporales.ultimoTemp += 1;
            resultado += '\tt' + temporales.ultimoTemp + '= stack[(int)t' + (temporales.ultimoTemp - 1) + '];\n';
            temporales.ultLiteral += 1;
            resultado += '\tL' + temporales.ultLiteral + ':\n';
            temporales.ultimoTemp += 1;
            resultado += '\tt' + temporales.ultimoTemp + '= heap[(int)t' + (temporales.ultimoTemp - 1) + '];\n';
            temporales.ultLiteral += 1;
            resultado += '\tif (t' + temporales.ultimoTemp + '==-1) goto L' + temporales.ultLiteral + ';\n';
            resultado += '\tprintf("%c", (char)t' + temporales.ultimoTemp + ');\n';
            resultado += '\tt' + (temporales.ultimoTemp - 1) + '= t' + (temporales.ultimoTemp - 1) + '+1;\n';
            resultado += '\tgoto L' + (temporales.ultLiteral - 1) + ';\n';
            resultado += '\tL' + (temporales.ultLiteral) + ':\n';
            resultado += '\treturn; \n\}\n';
        }
        return resultado;
    };
    GenerarNativas.prototype.generarFunciones = function (ent, arbol, temporales, listaErrores) {
        var resultado = '';
        for (var _i = 0, _a = arbol.funciones; _i < _a.length; _i++) {
            var element = _a[_i];
            if (element.nombrefuncion != 'main') {
                var resultado3d = new Resultado3D_1.Resultado3D;
                //Abrir funcion
                resultado3d.codigo3D += 'void ' + element.nombrefuncion + '(){\n';
                element.traducir(ent, arbol, resultado3d, temporales, listaErrores);
                resultado3d.codigo3D += 'return;\n}\n';
                resultado += resultado3d.codigo3D;
            }
        }
        return resultado;
    };
    return GenerarNativas;
}());
exports.GenerarNativas = GenerarNativas;

},{"../AST/Resultado3D":49}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resultado3D = void 0;
var Resultado3D = /** @class */ (function () {
    function Resultado3D() {
        this.codigo3D = "";
    }
    Resultado3D.prototype.setTemporal = function (temporal) {
        this.temporal = temporal;
    };
    return Resultado3D;
}());
exports.Resultado3D = Resultado3D;

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Temporales = void 0;
var Tipo_1 = require("./Tipo");
var Temporales = /** @class */ (function () {
    function Temporales() {
        this.ultimoTemp = 0;
        this.ultstack = 0;
        this.ultheap = 0;
        this.ultLiteral = 0;
        this.ultLitEscr = 0;
        this.usoConcatStrings = false;
        this.usoPrintStrings = false;
        this.ultimoTipo = Tipo_1.Tipo.NULL;
        this.esFuncion = false;
        this.cantidadParametrosFunc = 0;
    }
    return Temporales;
}());
exports.Temporales = Temporales;

},{"./Tipo":51}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo = void 0;
var Tipo;
(function (Tipo) {
    Tipo[Tipo["STRING"] = 0] = "STRING";
    Tipo[Tipo["INT"] = 1] = "INT";
    Tipo[Tipo["DOUBLE"] = 2] = "DOUBLE";
    Tipo[Tipo["BOOL"] = 3] = "BOOL";
    Tipo[Tipo["VOID"] = 4] = "VOID";
    Tipo[Tipo["STRUCT"] = 5] = "STRUCT";
    Tipo[Tipo["NULL"] = 6] = "NULL";
    Tipo[Tipo["ATRIBUTO"] = 7] = "ATRIBUTO";
    Tipo[Tipo["CHAR"] = 8] = "CHAR";
    Tipo[Tipo["ARRAY"] = 9] = "ARRAY";
    Tipo[Tipo["TIPO_STRUCT"] = 10] = "TIPO_STRUCT";
})(Tipo = exports.Tipo || (exports.Tipo = {}));

},{}],52:[function(require,module,exports){
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
        console.log(entornoGlobal_1);
        //Buscar la funcion main    
        funcionesG.forEach(function (element) {
            if (element.nombrefuncion == "main") {
                console.log("Se ejecutara");
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
                console.log("Se ejecutara");
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

},{"../jison/Gramatica":44,"./AST/AST":46,"./AST/Entorno":47,"./AST/GenerarNativas":48,"./AST/Resultado3D":49,"./AST/Temporales":50,"./Objetos/FuncionesReportes":53}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){

},{}],55:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":56}],56:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[52]);
