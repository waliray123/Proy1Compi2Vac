import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Simbolo } from "../AST/Simbolo";
import { Temporales } from "../AST/Temporales";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";

export class If implements Instruccion {
    linea: number;
    columna: number;
    public instrucciones: Array<Instruccion>;
    public condicion: Expresion;
    public sinos: Array<If>;
    public tipo: string;


    constructor(linea: number, columna: number, condicion: Expresion, instrucciones: Array<Instruccion>, sinos: Array<If>, tipo: string) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.condicion = condicion;
        this.sinos = sinos;
        this.tipo = tipo;
    }

    traducir(ent: Entorno, arbol: AST, resultado3D: Resultado3D, temporales: Temporales, listaErrores: Array<ErrorG>) {
        const entornolocal: Entorno = new Entorno(ent);
        let valAsign = this.condicion.traducir(entornolocal, arbol, resultado3D, temporales, 0);

        let ultLit = temporales.ultLiteral + 1;
        let cantidadSinos = this.sinos.length;

        temporales.ultLiteral += cantidadSinos + 2;

        resultado3D.codigo3D += '\tif(' + valAsign + ') goto L' + ultLit + ';\n';
        resultado3D.codigo3D += '\tgoto L' + (ultLit + 1) + ';\n';
        resultado3D.codigo3D += '\tL' + ultLit + ':\n';
        this.instrucciones.forEach((element: Instruccion) => {
            element.traducir(entornolocal, arbol, resultado3D, temporales, listaErrores);
        });
        resultado3D.codigo3D += '\tgoto L' + (ultLit + 1 + cantidadSinos) + ';\n';

        let cont = ultLit + 1;
        for (let i = cantidadSinos - 1; i >= 0; i--) {
            let sino = this.sinos[i];
            sino.traducirSinos(ent, arbol, resultado3D, temporales, cont, (ultLit + cantidadSinos + 1), listaErrores);
            cont += 1;
        }
        resultado3D.codigo3D += '\tL' + (ultLit + cantidadSinos + 1) + ':\n';
        temporales.ultLitEscr = ultLit + cantidadSinos + 1;
    }

    traducirSinos(ent: Entorno, arbol: AST, resultado3D: Resultado3D, temporales: Temporales, literalAsign: number, ultAsign: number, listaErrores: Array<ErrorG>) {
        if (this.tipo == "elseif") {
            const entornolocal: Entorno = new Entorno(ent);
            let valAsign = this.condicion.traducir(entornolocal, arbol, resultado3D, temporales, 0);
            resultado3D.codigo3D += '\tif(' + valAsign + ') goto L' + literalAsign + ';\n';
            resultado3D.codigo3D += '\tgoto L' + (literalAsign + 1) + ';\n';
            resultado3D.codigo3D += '\tL' + literalAsign + ':\n';
            this.instrucciones.forEach((element: Instruccion) => {
                element.traducir(entornolocal, arbol, resultado3D, temporales, listaErrores);
            });
            resultado3D.codigo3D += '\tgoto L' + ultAsign + ';\n';
        } else {
            const entornolocal: Entorno = new Entorno(ent);
            resultado3D.codigo3D += '\tL' + literalAsign + ':\n';
            this.instrucciones.forEach((element: Instruccion) => {
                element.traducir(entornolocal, arbol, resultado3D, temporales, listaErrores);
            });
            resultado3D.codigo3D += '\tgoto L' + ultAsign + ';\n';

        }
    }

    ejecutar(ent: Entorno, arbol: AST, listaErrores: Array<ErrorG>) {
        console.log('ejecutado...ifnormal');


        //Revisar la condicion del if
        if (this.tipo == "if" || this.tipo == "elseif") {
            if (this.condicion.getValorImplicito(ent, arbol, listaErrores) == true) {
                const entornolocal: Entorno = new Entorno(ent);

                for (let element of this.instrucciones) {
                    let valR = element.ejecutar(entornolocal, arbol, listaErrores);
                    if (valR == 'RETORNAR') {
                        ent.valorReturn = entornolocal.valorReturn;
                        return 'RETORNAR';
                    }else if(valR == 'ROMPER'){
                        return 'ROMPER';
                    }else if(valR == 'CONTINUAR'){
                        return 'CONTINUAR';
                    }
                }
            } else {
                let seEncontro = false;
                for (let i = 0; i < this.sinos.length; i++) {
                    let element = this.sinos[i];
                    if (element.tipo == "elseif") {
                        if (element.condicion.getValorImplicito(ent, arbol, listaErrores) == true) {
                            //Se encontro un elseif que cumple con la condicion
                            const entornolocal: Entorno = new Entorno(ent);
                            let valR = element.ejecutar(entornolocal, arbol, listaErrores);
                            if (valR == 'RETORNAR') {
                                ent.valorReturn = entornolocal.valorReturn;
                                return 'RETORNAR';
                            }else if(valR == 'ROMPER'){
                                return 'ROMPER';
                            }else if(valR == 'CONTINUAR'){
                                return 'CONTINUAR';
                            }
                            break;
                        }
                    }
                }
                if (seEncontro == false) {
                    for (let i = 0; i < this.sinos.length; i++) {
                        let element = this.sinos[i];
                        if (element.tipo == "else") {
                            //Se encontro un else  
                            const entornolocal: Entorno = new Entorno(ent);
                            let valR = element.ejecutar(entornolocal, arbol, listaErrores);
                            if (valR == 'RETORNAR') {
                                ent.valorReturn = entornolocal.valorReturn;
                                return 'RETORNAR';
                            }else if(valR == 'ROMPER'){
                                return 'ROMPER';
                            }else if(valR == 'CONTINUAR'){
                                return 'CONTINUAR';
                            }
                            break;
                        }
                    }
                }
            }
        } else {
            const entornolocal: Entorno = new Entorno(ent);

            for (let element of this.instrucciones) {
                let valR = element.ejecutar(entornolocal, arbol, listaErrores);
                if (valR == 'RETORNAR') {
                    ent.valorReturn = entornolocal.valorReturn;
                    console.log('VAl return');
                    console.log(ent.valorReturn);
                    return 'RETORNAR';
                }else if(valR == 'ROMPER'){
                    return 'ROMPER';
                }else if(valR == 'CONTINUAR'){
                    return 'CONTINUAR';
                }
            }
        }
    }
}