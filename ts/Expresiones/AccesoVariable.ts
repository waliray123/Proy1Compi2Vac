import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Simbolo } from "../AST/Simbolo";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Declaracion } from "../Instrucciones/Declaracion";
import { Expresion } from "../Interfaces/Expresion";
import { Arreglo } from "../Objetos/Arreglo";
import { ErrorG } from "../Objetos/ErrorG";

export class AccesoVariable implements Expresion {
    linea: number;
    columna: number;
    public id: string;
    public isAlone: boolean;

    constructor(id: string, linea: number, columna: number) {
        this.id = id
        this.linea = linea;
        this.columna = columna;
        this.isAlone = true;
    }

    traducir(ent: Entorno, arbol: AST, resultado3d: Resultado3D, temporales: Temporales,recursivo: number) {
        if (ent.existe(this.id)) {
            let simbol: Simbolo = ent.getSimbolo(this.id);
            
            //TODO: Alv ya me canse de esto mejor hago la declaracion de los strings  AAAAAAAAAAAAAA

            let valor = 'stack[(int)'+simbol.valor + ']';
            temporales.ultimoTemp += 1;
            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '=' + valor + ';\n';
            let valR = 't' + temporales.ultimoTemp;            
            temporales.ultimoTipo = this.getTipo(ent,arbol,[]);
            return valR;
        } else {
            console.log('No existe el id ' + this.id + ' no hay tipo');
        }
    }

    getTipo(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>): Tipo {
        if (ent.existe(this.id)) {
            let simbol:Simbolo = ent.getSimbolo(this.id);
            return simbol.getTipo(ent,arbol);
        }else{
            // console.log('No existe el id ' + this.id + ' no hay tipo');
            listaErrores.push(new ErrorG('semantico','no existe la variable ' + this.id,this.linea,this.columna));
        }
        return Tipo.NULL;
    }

    getValorImplicito(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        if (ent.existe(this.id)) {
            let simbol: Simbolo = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo.TIPO_STRUCT && this.isAlone) {
                let sendResultado = simbol.getTipoStruct(ent, arbol) + '(';
                let atributos: Array<Declaracion> = simbol.getValorImplicito(ent, arbol);
                let i = 0;
                atributos.forEach((atributo:Declaracion) =>{
                    sendResultado += atributo.expresion.getValorImplicito(ent, arbol,listaErrores)
                    if (i == atributos.length - 1) {
                        sendResultado += ')';
                    } else {
                        sendResultado += ' , ';
                    }
                    i++;
                })
                return sendResultado;
            } else if (simbol.getTipo(ent, arbol) == Tipo.ARRAY && this.isAlone) {
                let sendResultado = '[';
                let valor: Arreglo = simbol.getValorImplicito(ent, arbol);
                let exprs: Array<Expresion> = valor.contenido;
                let i = 0;
                exprs.forEach((expr:Expresion)=>{
                    sendResultado += expr.getValorImplicito(ent, arbol,listaErrores);
                    if (i == exprs.length - 1) {
                        sendResultado += ']';
                    } else {
                        sendResultado += ',';
                    }
                    i++;
                })
                return sendResultado;
            }
            else {
                return simbol.valor;
            }            
        }else{
            // console.log('No existe el id ' + this.id);
            listaErrores.push(new ErrorG('semantico','no existe la variable ' + this.id,this.linea,this.columna));
        }
    }

    getId() {
        return this.id;
    }

}