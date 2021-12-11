(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AST = /** @class */ (function () {
    function AST(instrucciones) {
        this.instrucciones = instrucciones;
        this.structs = [];
        this.funciones = [];
    }
    return AST;
}());
exports.AST = AST;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entorno = /** @class */ (function () {
    function Entorno(anterior) {
        this.tabla = {};
        this.anterior = anterior;
    }
    Entorno.prototype.agregar = function (id, simbolo) {
        id = id.toLowerCase();
        simbolo.indentificador = simbolo.indentificador.toLowerCase();
        this.tabla[id] = simbolo;
    };
    Entorno.prototype.eliminar = function (id) {
        id = id.toLowerCase();
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
        id = id.toLowerCase();
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                return true;
            }
        }
        return false;
    };
    Entorno.prototype.existeEnActual = function (id) {
        id = id.toLowerCase();
        if (this.tabla[id] !== undefined) {
            return true;
        }
        return false;
    };
    Entorno.prototype.getSimbolo = function (id) {
        id = id.toLowerCase();
        for (var e = this; e != null; e = e.anterior) {
            if (e.tabla[id] !== undefined) {
                return e.tabla[id];
            }
        }
        return null;
    };
    Entorno.prototype.reemplazar = function (id, nuevoValor) {
        id = id.toLowerCase();
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                e.tabla[id] = nuevoValor;
            }
        }
    };
    return Entorno;
}());
exports.Entorno = Entorno;

},{}],3:[function(require,module,exports){
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
    Tipo[Tipo["ARRAY"] = 8] = "ARRAY";
})(Tipo = exports.Tipo || (exports.Tipo = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var ArrbegEnd = /** @class */ (function () {
    function ArrbegEnd(id, linea, columna, expresion1, expresion2) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }
    ArrbegEnd.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    ArrbegEnd.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
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
    ArrbegEnd.prototype.getValorImplicito = function (ent, arbol) {
        return this.id;
    };
    ArrbegEnd.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return ArrbegEnd;
}());
exports.ArrbegEnd = ArrbegEnd;

},{"../AST/Tipo":3}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"../AST/Entorno":2}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
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
    Operacion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Operacion.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
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
    Operacion.prototype.getValorImplicito = function (ent, arbol) {
        if (this.operador !== Operador.MENOS_UNARIO && this.operador !== Operador.NOT) {
            var op1 = this.op_izquierda.getValorImplicito(ent, arbol);
            var op2 = this.op_derecha.getValorImplicito(ent, arbol);
            //suma
            if (this.operador == Operador.SUMA) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 + op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una suma");
                    return null;
                }
            }
            //resta
            else if (this.operador == Operador.RESTA) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 - op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una suma");
                    return null;
                }
            }
            //multiplicación
            else if (this.operador == Operador.MULTIPLICACION) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 * op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una suma");
                    return null;
                }
            }
            //division
            else if (this.operador == Operador.DIVISION) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    if (op2 === 0) {
                        console.log("Resultado indefinido, no puede ejecutarse operación sobre cero.");
                        return null;
                    }
                    return op1 / op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una suma");
                    return null;
                }
            }
            //modulo
            else if (this.operador == Operador.MODULO) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    if (op2 === 0) {
                        console.log("Resultado indefinido, no puede ejecutarse operación sobre cero.");
                        return null;
                    }
                    return op1 % op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una suma");
                    return null;
                }
            }
        }
        else {
            var op1 = this.op_izquierda.getValorImplicito(ent, arbol);
            if (this.operador == Operador.MENOS_UNARIO) {
                if (typeof (op1 === "number")) {
                    return -1 * op1;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una operación unaria");
                    return null;
                }
            }
        }
        return null;
    };
    Operacion.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Operacion;
}());
exports.Operacion = Operacion;

},{"../AST/Tipo":3}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo_1 = require("../AST/Tipo");
var Primitivo = /** @class */ (function () {
    function Primitivo(valor, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
    }
    Primitivo.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Primitivo.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
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
    Primitivo.prototype.getValorImplicito = function (ent, arbol) {
        return this.valor;
    };
    Primitivo.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Primitivo;
}());
exports.Primitivo = Primitivo;

},{"../AST/Tipo":3}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Asignacion = /** @class */ (function () {
    function Asignacion(id, linea, columna, expresion) {
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Asignacion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Asignacion.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...' + this.id);
    };
    return Asignacion;
}());
exports.Asignacion = Asignacion;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// print("hola mundo");
var Break = /** @class */ (function () {
    function Break(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
    Break.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Break.prototype.ejecutar = function (ent, arbol) {
        // console.log('ejecutado...'+ this.id);
    };
    return Break;
}());
exports.Break = Break;

},{}],11:[function(require,module,exports){
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
    Continue.prototype.ejecutar = function (ent, arbol) {
        // console.log('ejecutado...'+ this.id);
    };
    return Continue;
}());
exports.Continue = Continue;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// print("hola mundo");
var Declaracion = /** @class */ (function () {
    function Declaracion(id, tipo, linea, columna, expresion) {
        if (expresion === void 0) { expresion = null; }
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
        console.log('ejecutado...' + this.id);
    };
    return Declaracion;
}());
exports.Declaracion = Declaracion;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DoWhile = /** @class */ (function () {
    function DoWhile(linea, columna, instrucciones, expresion) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion = expresion;
    }
    DoWhile.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    DoWhile.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...fornormal');
    };
    return DoWhile;
}());
exports.DoWhile = DoWhile;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var For = /** @class */ (function () {
    function For(linea, columna, instrucciones, declAsign, expresion1, expresion2) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.declAsign = declAsign;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }
    For.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    For.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...fornormal');
    };
    return For;
}());
exports.For = For;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    Forin.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...fornormal');
    };
    return Forin;
}());
exports.Forin = Forin;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AST_1 = require("../AST/AST");
var Entorno_1 = require("../AST/Entorno");
var Funcion = /** @class */ (function () {
    function Funcion(nombrefuncion, tipoFuncion, linea, columna, instrucciones, parametros) {
        if (parametros === void 0) { parametros = []; }
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.tipoFuncion = tipoFuncion;
        this.parametros = parametros;
    }
    Funcion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Funcion.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado funcion ...' + this.nombrefuncion);
        var ast = new AST_1.AST(this.instrucciones);
        var entornoGlobal = new Entorno_1.Entorno(null);
        //recorro todas las raices  RECURSIVA
        this.instrucciones.forEach(function (element) {
            element.ejecutar(entornoGlobal, ast);
        });
        // console.log(this.instrucciones);
    };
    return Funcion;
}());
exports.Funcion = Funcion;

},{"../AST/AST":1,"../AST/Entorno":2}],17:[function(require,module,exports){
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
    FuncionReturn.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    FuncionReturn.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado funcion retorno ...' + this.nombrefuncion);
    };
    return FuncionReturn;
}());
exports.FuncionReturn = FuncionReturn;

},{}],18:[function(require,module,exports){
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
    Parametro.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...' + this.id);
    };
    return Parametro;
}());
exports.Parametro = Parametro;

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// print("hola mundo");
var Print = /** @class */ (function () {
    function Print(exp, linea, columna, haysalto) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
        this.haysalto = haysalto;
    }
    Print.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Print.prototype.ejecutar = function (ent, arbol) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
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
        }
    };
    return Print;
}());
exports.Print = Print;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    Struct.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...' + this.id);
    };
    return Struct;
}());
exports.Struct = Struct;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// print("hola mundo");
var SwitchCaso = /** @class */ (function () {
    function SwitchCaso(id, lista_intstrucciones, linea, columna) {
        this.id = id;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    SwitchCaso.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    SwitchCaso.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...' + this.id);
    };
    return SwitchCaso;
}());
exports.SwitchCaso = SwitchCaso;

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var While = /** @class */ (function () {
    function While(linea, columna, instrucciones, expresion) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion = expresion;
    }
    While.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    While.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...fornormal');
    };
    return While;
}());
exports.While = While;

},{}],24:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,9],$V1=[1,13],$V2=[1,19],$V3=[1,12],$V4=[1,14],$V5=[1,15],$V6=[1,16],$V7=[1,17],$V8=[1,18],$V9=[2,4,11,12,21,70,71,72,73,74],$Va=[1,25],$Vb=[16,75],$Vc=[2,83],$Vd=[1,28],$Ve=[1,47],$Vf=[1,48],$Vg=[1,49],$Vh=[1,50],$Vi=[1,51],$Vj=[1,52],$Vk=[1,53],$Vl=[1,54],$Vm=[1,41],$Vn=[1,42],$Vo=[1,43],$Vp=[1,44],$Vq=[1,45],$Vr=[1,46],$Vs=[2,4,11,12,15,21,36,42,46,47,48,51,52,53,58,63,64,70,71,72,73,74],$Vt=[2,21],$Vu=[1,78],$Vv=[1,63],$Vw=[1,64],$Vx=[1,72],$Vy=[1,73],$Vz=[1,74],$VA=[1,75],$VB=[1,76],$VC=[1,77],$VD=[1,65],$VE=[1,66],$VF=[1,67],$VG=[1,68],$VH=[1,69],$VI=[1,70],$VJ=[1,71],$VK=[1,79],$VL=[1,80],$VM=[16,19,24,43,67,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100],$VN=[1,93],$VO=[16,19,24,43,67,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98],$VP=[1,120],$VQ=[16,19,24,43,67,84,85,86,87,88,89,90,91,92,93,94,95,96,98],$VR=[16,19,24,43,67,84,85,86,87,88,89,90,91,94,95,96],$VS=[16,19,24,43,67,84,85,86,87,88,89,90,91],$VT=[1,153],$VU=[1,154],$VV=[1,152],$VW=[1,146],$VX=[1,147],$VY=[1,148],$VZ=[1,149],$V_=[1,150],$V$=[1,151],$V01=[15,19],$V11=[2,4,11,12,15,21,36,42,46,47,48,51,52,53,56,57,58,63,64,70,71,72,73,74],$V21=[2,12,15,36,42,46,47,48,51,52,53,58,63,64,70,71,72,73,74],$V31=[2,62],$V41=[1,212],$V51=[1,213],$V61=[19,67],$V71=[1,223],$V81=[15,42,46],$V91=[2,49],$Va1=[1,254],$Vb1=[1,255];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"EOF":4,"instrucciones":5,"instruccion":6,"declaracion_bloque":7,"asignacion_bloque":8,"asignacion_funcion":9,"struct_declaracion":10,"STR_STRUCT":11,"ID_VAR":12,"cuerpo_struct":13,"BRACKI":14,"BRACKD":15,"PUNTCOMA":16,"contenido_struct":17,"declaracion_struct":18,"COMA":19,"tiposVar":20,"VOID":21,"MAIN":22,"PARI":23,"PARD":24,"cuerpoFuncion":25,"parametros_funcion":26,"parametro_funcion":27,"instrucciones_funciones":28,"instruccion_funcion":29,"print_bloque":30,"if_bloque":31,"for_bloque":32,"while_bloque":33,"switch_bloque":34,"funcion_return":35,"STR_SWITCH":36,"expresion":37,"switch_cuerpo":38,"casos_switch":39,"opcional_default":40,"caso_switch":41,"STR_CASE":42,"DOSPUNT":43,"contenido_caso":44,"opcional_break":45,"STR_DEFAULT":46,"BREAK":47,"CONTINUE":48,"nombreVars":49,"asignacion":50,"PRINT":51,"PRINTLN":52,"STR_IF":53,"sinos_bloque":54,"instruccion_devuelta":55,"STR_ELSE":56,"STR_ELSEIF":57,"STR_FOR":58,"decl_asign":59,"STR_IN":60,"arr_decl":61,"arr_begin_end":62,"STR_WHILE":63,"STR_DO":64,"CORCHI":65,"parametros_arreglo":66,"CORCHD":67,"STR_BEGIN":68,"STR_END":69,"STR_STRING":70,"STR_DOUBLE":71,"STR_INTEGER":72,"STR_BOOLEAN":73,"STR_CHAR":74,"OP_IGUAL":75,"primitivas":76,"logicas":77,"operadores":78,"relacionales":79,"expresion_ternario":80,"incr_decr":81,"nativas":82,"OP_TER":83,"OP_AND":84,"OP_OR":85,"OP_DOBIG":86,"OP_DIF":87,"OP_MAYIG":88,"OP_MENIG":89,"OP_MEN":90,"OP_MAY":91,"OP_MULT":92,"OP_DIVI":93,"OP_SUMA":94,"OP_RESTA":95,"OP_AMP":96,"OP_ELV":97,"OP_MOD":98,"OP_INCR":99,"OP_DECR":100,"STR_POW":101,"STR_SQRT":102,"STR_SIN":103,"STR_COS":104,"STR_TAN":105,"STR_FALSE":106,"STR_TRUE":107,"ENTERO":108,"FLOTANTE":109,"STRINGL":110,"CHARL":111,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",11:"STR_STRUCT",12:"ID_VAR",14:"BRACKI",15:"BRACKD",16:"PUNTCOMA",19:"COMA",21:"VOID",22:"MAIN",23:"PARI",24:"PARD",36:"STR_SWITCH",42:"STR_CASE",43:"DOSPUNT",46:"STR_DEFAULT",47:"BREAK",48:"CONTINUE",51:"PRINT",52:"PRINTLN",53:"STR_IF",56:"STR_ELSE",57:"STR_ELSEIF",58:"STR_FOR",60:"STR_IN",63:"STR_WHILE",64:"STR_DO",65:"CORCHI",67:"CORCHD",68:"STR_BEGIN",69:"STR_END",70:"STR_STRING",71:"STR_DOUBLE",72:"STR_INTEGER",73:"STR_BOOLEAN",74:"STR_CHAR",75:"OP_IGUAL",83:"OP_TER",84:"OP_AND",85:"OP_OR",86:"OP_DOBIG",87:"OP_DIF",88:"OP_MAYIG",89:"OP_MENIG",90:"OP_MEN",91:"OP_MAY",92:"OP_MULT",93:"OP_DIVI",94:"OP_SUMA",95:"OP_RESTA",96:"OP_AMP",97:"OP_ELV",98:"OP_MOD",99:"OP_INCR",100:"OP_DECR",101:"STR_POW",102:"STR_SQRT",103:"STR_SIN",104:"STR_COS",105:"STR_TAN",106:"STR_FALSE",107:"STR_TRUE",108:"ENTERO",109:"FLOTANTE",110:"STRINGL",111:"CHARL"},
productions_: [0,[3,1],[3,2],[5,2],[5,1],[6,1],[6,1],[6,1],[6,1],[6,1],[10,3],[13,3],[13,4],[17,1],[17,3],[18,2],[18,2],[9,5],[9,6],[26,3],[26,1],[26,0],[27,2],[25,3],[25,2],[28,2],[28,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[35,5],[34,5],[34,1],[38,2],[38,4],[39,2],[39,1],[41,4],[44,2],[44,1],[40,3],[40,0],[45,2],[45,2],[45,0],[7,3],[7,4],[8,3],[30,5],[30,5],[31,6],[31,5],[55,1],[54,2],[54,2],[54,6],[54,5],[54,0],[32,9],[32,5],[32,5],[32,5],[33,5],[33,6],[59,3],[59,2],[61,3],[66,1],[66,3],[62,6],[62,6],[62,6],[62,6],[20,1],[20,1],[20,1],[20,1],[20,1],[49,1],[49,3],[50,2],[37,1],[37,1],[37,1],[37,1],[37,1],[37,1],[37,1],[80,5],[77,3],[77,3],[79,3],[79,3],[79,3],[79,3],[79,3],[79,3],[78,3],[78,3],[78,3],[78,3],[78,3],[78,3],[78,3],[78,3],[78,2],[81,2],[81,2],[82,4],[82,4],[82,4],[82,4],[82,4],[76,1],[76,1],[76,1],[76,1],[76,1],[76,1],[76,1]],
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
case 3: case 40:
$$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 4: case 13: case 20: case 41: case 83:
this.$ = [$$[$0]];
break;
case 5: case 6: case 7: case 8: case 27: case 28: case 29: case 30: case 31: case 32: case 33: case 34: case 85: case 86: case 87: case 88: case 89: case 90: case 91:
this.$ = $$[$0];
break;
case 10:
this.$ = new Struct($$[$0-1],$$[$0],_$[$0-2].first_line,_$[$0-2].first_column); 
break;
case 11:
this.$ = []; 
break;
case 12:
this.$ = $$[$0-2];
break;
case 14:
$$[$0].push($$[$0-2]); this.$= $$[$0]; 
break;
case 15: case 16:
this.$ = new Declaracion($$[$0],$$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 17:
this.$ = new Funcion("main","void",_$[$0-4].first_line,_$[$0-4].first_column,$$[$0]);
break;
case 18:
this.$ = new Funcion($$[$0-4],$$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0],$$[$0-2]);
break;
case 19:
$$[$0].push($$[$0-2]);this.$ = $$[$0];
break;
case 21:
this.$ = [];
break;
case 22:
this.$ = new Parametro($$[$0],$$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 23: case 109:
this.$ = $$[$0-1];
break;
case 24: case 46: case 49:
this.$ = null;
break;
case 25:
        
        $$[$0-1].push($$[$0]);
        this.$ = $$[$0-1];
    
break;
case 26:
                
        this.$ = [$$[$0]];
    
break;
case 35:
this.$ = new FuncionReturn($$[$0-4],_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-2]);
break;
case 36:
this.$ = new Switch($$[$0-2],$$[$0],_$[$0-4].first_line,_$[$0-4].first_column);
break;
case 38:
this.$= [];
break;
case 39:

            if ($$[$0-1] != null){
                $$[$0-2].push($$[$0-1]);
            }
            this.$ = $$[$0-2];
        
break;
case 42:
this.$ = new SwitchCaso($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 43:

            if ($$[$0] != null){
                $$[$0-1].push($$[$0]);
            }
            this.$ = $$[$0-1];
        
break;
case 44:

            if ($$[$0] == null){
                this.$ = [];
            }else{
                this.$ = [$$[$0]];
            }
        
break;
case 45:
this.$ = new SwitchCaso('DEFAULT',$$[$0],_$[$0-2].first_line,_$[$0-2].first_column);
break;
case 47:
this.$ = new Break(_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 48:
this.$ = new Continue(_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 50:
this.$ = new Declaracion($$[$0-1],$$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column);
break;
case 51:
this.$ = new Declaracion($$[$0-2],$$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 52:
this.$ = new Asignacion($$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,$$[$0-1]);
break;
case 53:
this.$ = new Print($$[$0-2],_$[$0-4].first_line,_$[$0-4].first_column,false);
break;
case 54:
this.$ = new Print($$[$0-2],_$[$0-4].first_line,_$[$0-4].first_column,true);
break;
case 57: case 72:
this.$ = [$$[$0]]
break;
case 63:
this.$ = new For(_$[$0-8].first_line,_$[$0-8].first_column,$$[$0],$$[$0-6],$$[$0-4],$$[$0-2]);
break;
case 64: case 65: case 66:
this.$ = new Forin(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0],$$[$0-3],$$[$0-1]);
break;
case 67:
this.$ = new While(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0],$$[$0-2]);
break;
case 68:
this.$ = new DoWhile(_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-4],$$[$0-1]);
break;
case 69:
this.$ = new Declaracion($$[$0-1],$$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,$$[$0]);
break;
case 70:
this.$ = new Asignacion($$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column,$$[$0]);
break;
case 71:
this.$ = $$[$0-1]
break;
case 73:
$$[$0-2].push($$[$0-1]);this.$ = $$[$0-2];
break;
case 74:
this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],$$[$0-1]);
break;
case 75:
let beg = new Primitivo("begin", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,beg,$$[$0-1]);
break;
case 76:
let beg1 = new Primitivo("begin", _$[$0-5].first_line, _$[$0-5].first_column); let end1 = new Primitivo("end", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,beg1,end1);
break;
case 77:
let beg2 = new Primitivo("end", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],beg2);
break;
case 78:
this.$ = "STRING";
break;
case 79:
this.$ = "DOUBLE";
break;
case 80:
this.$ = "INTEGER";
break;
case 81:
this.$ = "BOOLEAN";
break;
case 82:
this.$ = "CHAR";
break;
case 84:
 $$[$0].push($$[$0-2]);this.$ = $$[$0];
break;
case 94:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AND, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 95:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.OR, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 96:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.IGUAL_IGUAL, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 97:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIFERENTE_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 98:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 99:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 100:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 101:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 102:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MULTIPLICACION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 103:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIVISION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 104:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.SUMA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 105:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.RESTA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 106:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AMPERSON, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 107:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.ELEVADO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 108:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MODULO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 110:
this.$ = new Operacion($$[$0-1],$$[$01],Operador.MENOS_UNARIO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 111:
this.$ = new Operacion($$[$0-1],null,Operador.INCREMENTO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 112:
this.$ = new Operacion($$[$0-1],null,Operador.DECREMENTO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 113:
this.$ = new Operacion($$[$0-1],null,Operador.POW, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 114:
this.$ = new Operacion($$[$0-1],null,Operador.SQRT, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 115:
this.$ = new Operacion($$[$0-1],null,Operador.SIN, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 116:
this.$ = new Operacion($$[$0-1],null,Operador.COS, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 117:
this.$ = new Operacion($$[$0-1],null,Operador.TAN, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 118:
this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column);
break;
case 119:
this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column);
break;
case 120: case 121:
this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
break;
case 122: case 123: case 124:
this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
}
},
table: [{2:$V0,3:1,4:[1,2],5:3,6:4,7:5,8:6,9:7,10:8,11:$V1,12:$V2,20:10,21:$V3,49:11,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},{1:[3]},{1:[2,1]},{2:$V0,4:[1,20],6:21,7:5,8:6,9:7,10:8,11:$V1,12:$V2,20:10,21:$V3,49:11,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},o($V9,[2,4]),o($V9,[2,5]),o($V9,[2,6]),o($V9,[2,7]),o($V9,[2,8]),o($V9,[2,9]),{12:[1,23],49:22},{50:24,75:$Va},{22:[1,26]},{12:[1,27]},{12:[2,78]},{12:[2,79]},{12:[2,80]},{12:[2,81]},{12:[2,82]},o($Vb,$Vc,{19:$Vd}),{1:[2,2]},o($V9,[2,3]),{16:[1,29],50:30,75:$Va},o($Vb,$Vc,{19:$Vd,23:[1,31]}),{16:[1,32]},{12:$Ve,23:$Vf,37:33,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{23:[1,55]},{13:56,14:[1,57]},{12:$V2,49:58},o($Vs,[2,50]),{16:[1,59]},{20:62,24:$Vt,26:60,27:61,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},o($Vs,[2,52]),{16:[2,85],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},o($VM,[2,86]),o($VM,[2,87]),o($VM,[2,88]),o($VM,[2,89]),o($VM,[2,90]),o($VM,[2,91]),o($VM,[2,92]),o($VM,[2,118]),o($VM,[2,119]),o($VM,[2,120]),o($VM,[2,121]),o($VM,[2,122]),o($VM,[2,123]),o($VM,[2,124]),{12:$Ve,23:$Vf,37:81,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:82,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{23:[1,83]},{23:[1,84]},{23:[1,85]},{23:[1,86]},{23:[1,87]},{24:[1,88]},o($V9,[2,10]),{12:$VN,15:[1,89],17:90,18:91,20:92,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},o($Vb,[2,84]),o($Vs,[2,51]),{24:[1,94]},{19:[1,95],24:[2,20]},{12:[1,96]},{12:$Ve,23:$Vf,37:97,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:98,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:99,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:100,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:101,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:102,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:103,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:104,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:105,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:106,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:107,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:108,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:109,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:110,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:111,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:112,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},o($VM,[2,111]),o($VM,[2,112]),{24:[1,113],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},o($VO,[2,110],{99:$VK,100:$VL}),{12:$Ve,76:114,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,76:115,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,76:116,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,76:117,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,76:118,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{14:$VP,25:119},{16:[1,121]},{15:[1,122]},{15:[2,13],19:[1,123]},{12:[1,124]},{12:[1,125]},{14:$VP,25:126},{20:62,24:$Vt,26:127,27:61,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},o([19,24],[2,22]),o([16,19,24,43,67,84,85],[2,94],{83:$Vu,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL}),o([16,19,24,43,67,85],[2,95],{83:$Vu,84:$Vv,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL}),o($VQ,[2,102],{83:$Vu,97:$VI,99:$VK,100:$VL}),o($VQ,[2,103],{83:$Vu,97:$VI,99:$VK,100:$VL}),o($VR,[2,104],{83:$Vu,92:$VD,93:$VE,97:$VI,98:$VJ,99:$VK,100:$VL}),o($VR,[2,105],{83:$Vu,92:$VD,93:$VE,97:$VI,98:$VJ,99:$VK,100:$VL}),o($VR,[2,106],{83:$Vu,92:$VD,93:$VE,97:$VI,98:$VJ,99:$VK,100:$VL}),o($VO,[2,107],{99:$VK,100:$VL}),o($VQ,[2,108],{83:$Vu,97:$VI,99:$VK,100:$VL}),o($VS,[2,96],{83:$Vu,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL}),o($VS,[2,97],{83:$Vu,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL}),o($VS,[2,98],{83:$Vu,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL}),o($VS,[2,99],{83:$Vu,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL}),o($VS,[2,100],{83:$Vu,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL}),o($VS,[2,101],{83:$Vu,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL}),{43:[1,128],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},o($VM,[2,109]),{24:[1,129]},{24:[1,130]},{24:[1,131]},{24:[1,132]},{24:[1,133]},o($V9,[2,17]),{2:$VT,7:137,8:138,12:$VU,15:[1,135],20:145,28:134,29:136,30:139,31:140,32:141,33:142,34:143,35:144,36:$VV,49:11,51:$VW,52:$VX,53:$VY,58:$VZ,63:$V_,64:$V$,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},o($V9,[2,11]),{16:[1,155]},{12:$VN,17:156,18:91,20:92,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},o($V01,[2,15]),o($V01,[2,16]),o($V9,[2,18]),{24:[2,19]},{12:$Ve,23:$Vf,37:157,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},o($VM,[2,113]),o($VM,[2,114]),o($VM,[2,115]),o($VM,[2,116]),o($VM,[2,117]),{2:$VT,7:137,8:138,12:$VU,15:[1,158],20:145,29:159,30:139,31:140,32:141,33:142,34:143,35:144,36:$VV,49:11,51:$VW,52:$VX,53:$VY,58:$VZ,63:$V_,64:$V$,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},o($V11,[2,24]),o($V21,[2,26]),o($V21,[2,27]),o($V21,[2,28]),o($V21,[2,29]),o($V21,[2,30]),o($V21,[2,31]),o($V21,[2,32]),o($V21,[2,33]),o($V21,[2,34]),{12:$V2,49:22},{23:[1,160]},{23:[1,161]},{23:[1,162]},{12:[1,164],23:[1,163]},{23:[1,165]},{14:$VP,25:166},{23:[1,167]},o($V21,[2,37]),{19:$Vd,23:[1,168],75:$Vc},o($V9,[2,12]),{15:[2,14]},o($VO,[2,93],{99:$VK,100:$VL}),o($V11,[2,23]),o($V21,[2,25]),{12:$Ve,23:$Vf,37:169,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:170,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:171,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$V2,20:173,49:174,59:172,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},{60:[1,175]},{12:$Ve,23:$Vf,37:176,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{63:[1,177]},{12:$Ve,23:$Vf,37:178,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{20:62,24:$Vt,26:179,27:61,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},{24:[1,180],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},{24:[1,181],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},{24:[1,182],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},{16:[1,183]},{12:$V2,49:184},{50:185,75:$Va},{12:[1,186],61:187,62:188,65:[1,189]},{24:[1,190],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},{23:[1,191]},{24:[1,192],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},{24:[1,193]},{16:[1,194]},{16:[1,195]},{2:$VT,7:137,8:138,12:$VU,14:$VP,20:145,25:196,29:197,30:139,31:140,32:141,33:142,34:143,35:144,36:$VV,49:11,51:$VW,52:$VX,53:$VY,58:$VZ,63:$V_,64:$V$,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},{12:$Ve,23:$Vf,37:198,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{50:199,75:$Va},{16:[2,70]},{14:$VP,25:200,65:[1,201]},{14:$VP,25:202},{14:$VP,25:203},{12:$Ve,23:$Vf,37:205,66:204,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{14:$VP,25:206},{12:$Ve,23:$Vf,37:207,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{14:[1,209],38:208},{16:[1,210]},o($V21,[2,53]),o($V21,[2,54]),o($V21,$V31,{54:211,56:$V41,57:$V51}),o($V21,[2,56]),{16:[1,214],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},{16:[2,69]},o($V21,[2,64]),{12:$Ve,23:$Vf,37:215,68:[1,216],76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},o($V21,[2,65]),o($V21,[2,66]),{19:[1,218],67:[1,217]},o($V61,[2,72],{83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL}),o($V21,[2,67]),{24:[1,219],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},o($V21,[2,36]),{15:[1,220],39:221,41:222,42:$V71},o($V21,[2,35]),o($V21,[2,55]),{2:$VT,7:137,8:138,12:$VU,14:$VP,20:145,25:224,29:226,30:139,31:140,32:141,33:142,34:143,35:144,36:$VV,49:11,51:$VW,52:$VX,53:$VY,55:225,58:$VZ,63:$V_,64:$V$,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},{23:[1,227]},{12:$Ve,23:$Vf,37:228,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{43:[1,229],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},{43:[1,230]},{14:[2,71]},{12:$Ve,23:$Vf,37:231,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},o($V21,[2,68]),o($V21,[2,38]),{15:[2,46],40:232,41:233,42:$V71,46:[1,234]},o($V81,[2,41]),{12:$Ve,23:$Vf,37:235,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},o($V21,[2,58]),o($V21,[2,59]),o($V21,[2,57]),{12:$Ve,23:$Vf,37:236,76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{24:[1,237],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},{12:$Ve,23:$Vf,37:238,69:[1,239],76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},{12:$Ve,23:$Vf,37:240,69:[1,241],76:34,77:35,78:36,79:37,80:38,81:39,82:40,95:$Vg,101:$Vh,102:$Vi,103:$Vj,104:$Vk,105:$Vl,106:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr},o($V61,[2,73],{83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL}),{15:[1,242]},o($V81,[2,40]),{43:[1,243]},{43:[1,244],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},{24:[1,245],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},{14:$VP,25:246},{67:[1,247],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},{67:[1,248]},{67:[1,249],83:$Vu,84:$Vv,85:$Vw,86:$Vx,87:$Vy,88:$Vz,89:$VA,90:$VB,91:$VC,92:$VD,93:$VE,94:$VF,95:$VG,96:$VH,97:$VI,98:$VJ,99:$VK,100:$VL},{67:[1,250]},o($V21,[2,39]),{2:$VT,7:137,8:138,12:$VU,15:$V91,20:145,28:252,29:136,30:139,31:140,32:141,33:142,34:143,35:144,36:$VV,44:251,45:253,47:$Va1,48:$Vb1,49:11,51:$VW,52:$VX,53:$VY,58:$VZ,63:$V_,64:$V$,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},o($V81,$V91,{49:11,29:136,7:137,8:138,30:139,31:140,32:141,33:142,34:143,35:144,20:145,28:252,45:253,44:256,2:$VT,12:$VU,36:$VV,47:$Va1,48:$Vb1,51:$VW,52:$VX,53:$VY,58:$VZ,63:$V_,64:$V$,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8}),{2:$VT,7:137,8:138,12:$VU,14:$VP,20:145,25:257,29:226,30:139,31:140,32:141,33:142,34:143,35:144,36:$VV,49:11,51:$VW,52:$VX,53:$VY,55:258,58:$VZ,63:$V_,64:$V$,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8},o($V21,[2,63]),{14:[2,74]},{14:[2,77]},{14:[2,75]},{14:[2,76]},{15:[2,45]},o($V81,$V91,{49:11,7:137,8:138,30:139,31:140,32:141,33:142,34:143,35:144,20:145,29:159,45:259,2:$VT,12:$VU,36:$VV,47:$Va1,48:$Vb1,51:$VW,52:$VX,53:$VY,58:$VZ,63:$V_,64:$V$,70:$V4,71:$V5,72:$V6,73:$V7,74:$V8}),o($V81,[2,44]),{16:[1,260]},{16:[1,261]},o($V81,[2,42]),o($V21,$V31,{54:262,56:$V41,57:$V51}),o($V21,[2,61]),o($V81,[2,43]),o($V81,[2,47]),o($V81,[2,48]),o($V21,[2,60])],
defaultActions: {2:[2,1],14:[2,78],15:[2,79],16:[2,80],17:[2,81],18:[2,82],20:[2,2],127:[2,19],156:[2,14],185:[2,70],199:[2,69],217:[2,71],247:[2,74],248:[2,77],249:[2,75],250:[2,76],251:[2,45]},
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
    const {Print} = require("../dist/Instrucciones/Print");
    const {Declaracion} = require("../dist/Instrucciones/Declaracion");    
    const {Asignacion} = require("../dist/Instrucciones/Asignacion");
    const {While} = require("../dist/Instrucciones/While");
    const {DoWhile} = require("../dist/Instrucciones/DoWhile");
    const {Funcion} = require("../dist/Instrucciones/Funcion");
    const {Struct} = require("../dist/Instrucciones/Struct");
    const {Switch} = require("../dist/Instrucciones/Switch");
    const {SwitchCaso} = require("../dist/Instrucciones/SwitchCaso");
    const {Break} = require("../dist/Instrucciones/Break");
    const {Continue} = require("../dist/Instrucciones/Continue");
    const {FuncionReturn} = require("../dist/Instrucciones/FuncionReturn");
    const {Parametro} = require("../dist/Instrucciones/Parametro");
    const {For} = require("../dist/Instrucciones/For");
    const {Forin} = require("../dist/Instrucciones/Forin");
    const {Primitivo} = require("../dist/Expresiones/Primitivo");
    const {ArrbegEnd} = require("../dist/Expresiones/ArrbegEnd");
    const {Operacion, Operador} = require("../dist/Expresiones/Operacion");
    const {Objeto} = require("../dist/Expresiones/Objeto");
    const {Atributo} = require("../dist/Expresiones/Atributo");

    /*---CODIGO INCRUSTADO---*/
    var errores = [
        "Se esperaba una instruccion como : "
    ];

    function genError(desc,linea,columna,val){
        //let errorCom = new ErrorCom("Sintactico",linea,columna,errores[desc],val);
        return errorCom;
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
case 5:return 14; 
break;
case 6:return 15;
break;
case 7:return 23;
break;
case 8:return 24;
break;
case 9:return 65;
break;
case 10:return 67;
break;
case 11:return 19;
break;
case 12:return 43;
break;
case 13:return 16;
break;
case 14:return "PRINTLN";
break;
case 15:return "PRINT";
break;
case 16:return 21;
break;
case 17:return 22;
break;
case 18:return 53;
break;
case 19:return 57;
break;
case 20:return 56;
break;
case 21:return 63;
break;
case 22:return 64;
break;
case 23:return 58;
break;
case 24:return 47;
break;
case 25:return 48;
break;
case 26:return 36;
break;
case 27:return 42;
break;
case 28:return 46;
break;
case 29:return 107;
break;
case 30:return 106;
break;
case 31:return 'STR_RETURN';
break;
case 32:return 73;
break;
case 33:return 72;
break;
case 34:return 71;
break;
case 35:return 74;
break;
case 36:return 70;
break;
case 37:return 11;
break;
case 38:return 68;
break;
case 39:return 69;
break;
case 40:return 'STR_FUNCTION';
break;
case 41:return 60;
break;
case 42:return 101;
break;
case 43:return 102;
break;
case 44:return 103;
break;
case 45:return 104;
break;
case 46:return 105;
break;
case 47:return 'STR_PARSE';
break;
case 48:return 'STR_TOINT';
break;
case 49:return 'STR_TODOUBLE';
break;
case 50:return 'STR_string';
break;
case 51:return 'STR_TYPEOF';
break;
case 52:return 'STR_PUSH';
break;
case 53:return 'STR_POP';
break;
case 54:return 'CHARPOS';
break;
case 55:return 'SUBSTRING';
break;
case 56:return 'LENGTH';
break;
case 57:return 'UPPERCASE';
break;
case 58:return 'LOWERCASE';
break;
case 59:return 89;
break;
case 60:return 90;
break;
case 61:return 86;
break;
case 62:return 88;
break;
case 63:return 91;
break;
case 64:return 87;
break;
case 65:return 85;
break;
case 66:return 84;
break;
case 67:return 96;
break;
case 68:return 'OP_NEG';
break;
case 69:return 75;
break;
case 70:return 'OP_MASIG';
break;
case 71:return 'OP_RESIG';
break;
case 72:return 'OP_PORIG';
break;
case 73:return 'OP_DIVIG';
break;
case 74:return 'OP_MODIG';
break;
case 75:return 99;
break;
case 76:return 94;
break;
case 77:return 100;
break;
case 78:return 95;
break;
case 79:return 92;
break;
case 80:return 93;
break;
case 81:return 98;
break;
case 82:return 'OP_CALL';
break;
case 83:return 97;
break;
case 84:return 83;
break;
case 85:return 'OP_HASH';
break;
case 86:return 'STR_NULL';
break;
case 87:return 12;
break;
case 88:return 12;
break;
case 89:return 109;
break;
case 90:return 108;
break;
case 91:return 110;
break;
case 92:return 110;
break;
case 93:return 111;
break;
case 94:return 111;
break;
case 95:return 4;
break;
case 96:return 'INVALID';
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:\/\*)/,/^(?:\*\/)/,/^(?:.)/,/^(?:\s+)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?::)/,/^(?:;)/,/^(?:println\b)/,/^(?:print\b)/,/^(?:void\b)/,/^(?:main\b)/,/^(?:if\b)/,/^(?:elseif\b)/,/^(?:else\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:for\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:return\b)/,/^(?:boolean\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:String\b)/,/^(?:struct\b)/,/^(?:begin\b)/,/^(?:end\b)/,/^(?:function\b)/,/^(?:in\b)/,/^(?:pow\b)/,/^(?:sqrt\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:string\b)/,/^(?:typeof\b)/,/^(?:push\b)/,/^(?:pop\b)/,/^(?:caracterOfPosition\b)/,/^(?:subString\b)/,/^(?:length\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:<=)/,/^(?:<)/,/^(?:==)/,/^(?:>=)/,/^(?:>)/,/^(?:!=)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:&)/,/^(?:!)/,/^(?:=)/,/^(?:\+=)/,/^(?:-=)/,/^(?:\*=)/,/^(?:\/=)/,/^(?:%=)/,/^(?:\+\+)/,/^(?:\+)/,/^(?:--)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:\.)/,/^(?:\^)/,/^(?:\?)/,/^(?:#)/,/^(?:null\b)/,/^(?:[A-Z][a-zA-Z0-9_]*)/,/^(?:[a-zA-Z][a-zA-Z0-9_]*)/,/^(?:(((0|([1-9])([0-9])*))\.((0|([1-9])([0-9])*))?(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD]?|\.((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD]?|((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))[fFdD]?|((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD])(?=([^\w]|$)))/,/^(?:((0|([1-9])([0-9])*)))/,/^(?:"")/,/^(?:"([^"]|(\\.))*")/,/^(?:\\'([^']|(\\.))*\\')/,/^(?:\\'\\')/,/^(?:$)/,/^(?:.)/],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96],"inclusive":true},"INITIAL":{"rules":[0,1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96],"inclusive":true}}
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
},{"../dist/Expresiones/ArrbegEnd":4,"../dist/Expresiones/Atributo":5,"../dist/Expresiones/Objeto":6,"../dist/Expresiones/Operacion":7,"../dist/Expresiones/Primitivo":8,"../dist/Instrucciones/Asignacion":9,"../dist/Instrucciones/Break":10,"../dist/Instrucciones/Continue":11,"../dist/Instrucciones/Declaracion":12,"../dist/Instrucciones/DoWhile":13,"../dist/Instrucciones/For":14,"../dist/Instrucciones/Forin":15,"../dist/Instrucciones/Funcion":16,"../dist/Instrucciones/FuncionReturn":17,"../dist/Instrucciones/Parametro":18,"../dist/Instrucciones/Print":19,"../dist/Instrucciones/Struct":20,"../dist/Instrucciones/Switch":21,"../dist/Instrucciones/SwitchCaso":22,"../dist/Instrucciones/While":23,"_process":30,"fs":28,"path":29}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AST = void 0;
var AST = /** @class */ (function () {
    function AST(instrucciones) {
        this.instrucciones = instrucciones;
        this.structs = [];
        this.funciones = [];
    }
    return AST;
}());
exports.AST = AST;

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entorno = void 0;
var Entorno = /** @class */ (function () {
    function Entorno(anterior) {
        this.tabla = {};
        this.anterior = anterior;
    }
    Entorno.prototype.agregar = function (id, simbolo) {
        id = id.toLowerCase();
        simbolo.indentificador = simbolo.indentificador.toLowerCase();
        this.tabla[id] = simbolo;
    };
    Entorno.prototype.eliminar = function (id) {
        id = id.toLowerCase();
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
        id = id.toLowerCase();
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                return true;
            }
        }
        return false;
    };
    Entorno.prototype.existeEnActual = function (id) {
        id = id.toLowerCase();
        if (this.tabla[id] !== undefined) {
            return true;
        }
        return false;
    };
    Entorno.prototype.getSimbolo = function (id) {
        id = id.toLowerCase();
        for (var e = this; e != null; e = e.anterior) {
            if (e.tabla[id] !== undefined) {
                return e.tabla[id];
            }
        }
        return null;
    };
    Entorno.prototype.reemplazar = function (id, nuevoValor) {
        id = id.toLowerCase();
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                e.tabla[id] = nuevoValor;
            }
        }
    };
    return Entorno;
}());
exports.Entorno = Entorno;

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AST_1 = require("./AST/AST");
var Entorno_1 = require("./AST/Entorno");
var gramatica = require('../jison/Gramatica');
window.ejecutarCodigo = function (entrada) {
    //Reiniciar consola
    reiniciarConsola();
    //traigo todas las raices    
    var instrucciones = gramatica.parse(entrada);
    console.log(instrucciones);
    // /*
    var ast = new AST_1.AST(instrucciones);
    var entornoGlobal = new Entorno_1.Entorno(null);
    //recorro todas las raices  RECURSIVA
    instrucciones.forEach(function (element) {
        element.ejecutar(entornoGlobal, ast);
    });
    // */
};
function reiniciarConsola() {
    var areaConsola = document.getElementById('consola');
    areaConsola.value = "";
}
// ejecutarCodigo(`int id12;
// int var2;`)

},{"../jison/Gramatica":24,"./AST/AST":25,"./AST/Entorno":26}],28:[function(require,module,exports){

},{}],29:[function(require,module,exports){
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
},{"_process":30}],30:[function(require,module,exports){
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

},{}]},{},[27]);
