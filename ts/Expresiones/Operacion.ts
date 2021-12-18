import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";

export enum Operador {
    SUMA,
    RESTA,
    MULTIPLICACION,
    AMPERSON,
    DIVISION,
    MODULO,
    MENOS_UNARIO,
    ELEVADO,
    MAYOR_QUE,
    MENOR_QUE,
    IGUAL_IGUAL,
    DIFERENTE_QUE,
    OR,
    AND,
    NOT,
    MAYOR_IGUA_QUE,
    MENOR_IGUA_QUE,
    INCREMENTO,
    DECREMENTO,
    POW,
    SQRT,
    SIN,
    COS,
    TAN,
    DESCONOCIDO
}

export class Operacion implements Expresion {
    linea: number;
    columna: number;
    public op_izquierda: Expresion;
    public op_derecha: Expresion;
    operador: Operador;

    constructor(op_izquierda: Expresion, op_derecha: Expresion, operacion: Operador, linea: number, columna: number) {
        this.linea = linea;
        this.columna = columna;
        this.op_izquierda = op_izquierda;
        this.op_derecha = op_derecha;
        this.operador = operacion;
    }

    traducir(ent: Entorno, arbol: AST, resultado3d: Resultado3D, temporales: Temporales, recursivo: number) {
        console.log("Traduciendo operacion");

        let resultado = "";
        if (this.operador !== Operador.MENOS_UNARIO && this.operador !== Operador.NOT
            && this.operador != Operador.SQRT && this.operador != Operador.SIN && this.operador != Operador.COS
            && this.operador != Operador.TAN && this.operador != Operador.INCREMENTO && this.operador != Operador.DECREMENTO) {
            let val1 = this.op_izquierda.traducir(ent, arbol, resultado3d, temporales, recursivo + 1);
            let val2 = this.op_derecha.traducir(ent, arbol, resultado3d, temporales, recursivo + 1);
            let valor = this.unirResultado(val1, val2);
            if (recursivo == 0) {
                return valor;
            } else {
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '=' + valor + ';\n';
                let valR = 't' + temporales.ultimoTemp;
                temporales.ultimoTemp += 1;
                return valR;
            }
        }else{
            let val1 = this.op_izquierda.traducir(ent, arbol, resultado3d, temporales, recursivo + 1);
            let valor = this.unirResultadoUnico(val1);
            if (recursivo == 0) {
                return valor;
            } else {
                resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '=' + valor + ';\n';
                let valR = 't' + temporales.ultimoTemp;
                temporales.ultimoTemp += 1;
                return valR;
            }
        }


    }

    unirResultado(val1: any, val2: any) {
        let resultadoR = '';
        if (this.operador == Operador.SUMA) {
            resultadoR = val1 + "+" + val2;
        } else if (this.operador == Operador.RESTA) {
            resultadoR = val1 + "-" + val2;
        } else if (this.operador == Operador.MULTIPLICACION) {
            resultadoR = val1 + "*" + val2;
        } else if (this.operador == Operador.DIVISION) {
            resultadoR = val1 + "/" + val2;
        } else if (this.operador == Operador.MAYOR_QUE) {
            resultadoR = val1 + ">" + val2;
        } else if (this.operador == Operador.MENOR_QUE) {
            resultadoR = val1 + "<" + val2;
        } else if (this.operador == Operador.MAYOR_IGUA_QUE) {
            resultadoR = val1 + ">=" + val2;
        } else if (this.operador == Operador.MENOR_IGUA_QUE) {
            resultadoR = val1 + "<=" + val2;
        } else if (this.operador == Operador.IGUAL_IGUAL) {
            resultadoR = val1 + "<=" + val2;
        } else if (this.operador == Operador.MODULO) {
            resultadoR = 'fmod(' + val1 + ',' + val2 + ')';
        }

        return resultadoR;
    }

    unirResultadoUnico(val1: any){
        let resultadoR = '';
        if (this.operador == Operador.MENOS_UNARIO) {
            resultadoR = '-'+val1;
        }
        return resultadoR;
    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        const valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'boolean') {
            return Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo.INT;
            }
            return Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo.NULL;
        }

        return Tipo.VOID;
    }


    getValorImplicito(ent: Entorno, arbol: AST) {
        if (this.operador !== Operador.MENOS_UNARIO && this.operador !== Operador.NOT
            && this.operador != Operador.SQRT && this.operador != Operador.SIN && this.operador != Operador.COS
            && this.operador != Operador.TAN && this.operador != Operador.INCREMENTO && this.operador != Operador.DECREMENTO) {
            let op1 = this.op_izquierda.getValorImplicito(ent, arbol);
            let op2 = this.op_derecha.getValorImplicito(ent, arbol);

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
            //AMPERSON
            else if (this.operador == Operador.AMPERSON) {
                if (typeof (op1 === 'string') && typeof (op2 === 'string')) {
                    return op1.concat(op2.toString());
                }
                else {
                    console.log('Error semantico, Solo se puede concatenar (&) Strings en la linea ' + this.linea + ' y columna ' + this.columna);
                    return null;
                }
            }
            //ELEVADO
            else if (this.operador == Operador.ELEVADO) {
                if (this.op_izquierda.getTipo(ent, arbol) == Tipo.STRING && this.op_derecha.getTipo(ent, arbol) == Tipo.INT) {
                    return op1.repeat(Number(op2));
                } else {
                    console.log('Error semantico, No se puede completar la accion ^ en la linea ' + this.linea + ' y columna ' + this.columna);
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
                    } else {
                        console.log("Error de tipos de datos no permitidos realizando una potencia");
                    }
                }

            }
            catch (e) {
                console.log(e);
            }
        } else {
            try {
                let op1 = this.op_izquierda.getValorImplicito(ent, arbol);
                if (this.operador == Operador.MENOS_UNARIO) {
                    if (typeof (op1 === "number")) {
                        return -1 * op1;
                    }
                    else {
                        console.log("Error de tipos de datos no permitidos realizando una operación unaria");
                        return null;
                    }
                }
                else if (this.operador == Operador.NOT) {
                    return !op1;
                }
                else if (this.operador == Operador.SIN) {
                    if (typeof (op1 === "number")) {
                        return Math.sin(this.gradosRadianes(op1));
                    } else {
                        console.log("Error de tipos de datos no permitidos realizando una operacion seno");
                    }
                }
                else if (this.operador == Operador.COS) {
                    if (typeof (op1 === "number")) {
                        return Math.cos(this.gradosRadianes(op1));
                    } else {
                        console.log("Error de tipos de datos no permitidos realizando una operacion coseno");
                    }
                }
                else if (this.operador == Operador.TAN) {
                    if (typeof (op1 === "number")) {
                        return Math.tan(this.gradosRadianes(op1));
                    } else {
                        console.log("Error de tipos de datos no permitidos realizando una operacion tangente");
                    }
                }
                else if (this.operador == Operador.SQRT) {
                    if (typeof (op1 === "number")) {
                        return Math.sqrt(op1);
                    } else {
                        console.log("Error de tipos de datos no permitidos realizando una raiz");
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
    }

    isInt(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

    gradosRadianes(n: number) {
        return (n * (Math.PI / 180));
    }
}