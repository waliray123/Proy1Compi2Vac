import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Simbolo } from "../AST/Simbolo";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { AccesoArray } from "../Expresiones/AccesoArray";
import { AccesoVariable } from "../Expresiones/AccesoVariable";
import { Primitivo } from "../Expresiones/Primitivo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Arreglo } from "../Objetos/Arreglo";
import { ErrorG } from "../Objetos/ErrorG";
import { Declaracion } from "./Declaracion";
import { Struct } from "./Struct";

export class Asignacion implements Instruccion{
    linea: number;
    columna: number;
    public id:Array<string>;
    public expresion:Expresion;

    constructor(id:Array<string>, linea:number, columna:number,expresion:Expresion){
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent:Entorno, arbol:AST,resultado3d:Resultado3D,temporales:Temporales,listaErrores:Array<ErrorG>) {
        
        if (this.id.length == 1) {
            let id = this.id[0];
            if (ent.existe(id)) {
                let simbol: Simbolo = ent.getSimbolo(id);
                let tipo: Tipo = simbol.getTipo(ent,arbol);
                if (tipo == this.expresion.getTipo(ent,arbol,listaErrores)) {
                    //Asignar al stack
                    let valAsign = this.expresion.traducir(ent,arbol,resultado3d,temporales,0);
                    if(temporales.ultimoTipo == Tipo.BOOL){
                        if(temporales.esFuncion){
                            temporales.ultimoTemp += 1;
                            resultado3d.codigo3D += 't'+temporales.ultimoTemp + '= P +'+(simbol.valor) + ';\n';
                            temporales.ultLiteral += 3;
                            let ultLit = temporales.ultLiteral-2;
                            resultado3d.codigo3D += '\tif('+valAsign+') goto L'+ultLit+';\n';
                            resultado3d.codigo3D += '\tgoto L'+(ultLit+1)+';\n';
                            resultado3d.codigo3D += '\tL'+ultLit+':\n';
                            resultado3d.codigo3D += '\tstack[(int)t'+temporales.ultimoTemp+'] = 1;\n';
                            resultado3d.codigo3D += '\tgoto L'+(ultLit+2)+';\n';
                            resultado3d.codigo3D += '\tL'+(ultLit+1)+':\n';
                            resultado3d.codigo3D += '\tstack[(int)t'+temporales.ultimoTemp+'] = 0;\n';
                            resultado3d.codigo3D += '\tL'+(ultLit+2)+':\n';
                            temporales.ultLitEscr = (ultLit+2);
                        }else{
                            temporales.ultLiteral += 3;
                            let ultLit = temporales.ultLiteral-2;
                            resultado3d.codigo3D += '\tif('+valAsign+') goto L'+ultLit+';\n';
                            resultado3d.codigo3D += '\tgoto L'+(ultLit+1)+';\n';
                            resultado3d.codigo3D += '\tL'+ultLit+':\n';
                            resultado3d.codigo3D += '\tstack[(int)'+simbol.valor+'] = 1;\n';
                            resultado3d.codigo3D += '\tgoto L'+(ultLit+2)+';\n';
                            resultado3d.codigo3D += '\tL'+(ultLit+1)+':\n';
                            resultado3d.codigo3D += '\tstack[(int)'+simbol.valor+'] = 0;\n';
                            resultado3d.codigo3D += '\tL'+(ultLit+2)+':\n';
                            temporales.ultLitEscr = (ultLit+2);
                        }                                            
                    }else{
                        if(temporales.esFuncion){
                            temporales.ultimoTemp += 1;
                            resultado3d.codigo3D += '\tt'+temporales.ultimoTemp + '= P +'+(simbol.valor) + ';\n';                            
                            resultado3d.codigo3D += '\tstack[(int)t'+temporales.ultimoTemp+'] ='+ valAsign  +';\n';
                        }else{
                            resultado3d.codigo3D += '\tstack[(int)'+simbol.valor+'] ='+ valAsign  +';\n';
                        }                        
                    }                    
                }else{
                    console.log('Error semantico, El tipo de la variable (' + tipo +') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent,arbol,listaErrores) + ') en la linea '+ this.linea + ' y columna ' + this.columna);
                }
            }else{
                console.log('Error semantico, no existe la variable ' + id +' en la linea '+ this.linea + ' y columna ' + this.columna);
            }            
        }
        //TODO: traducir asignacion de array 
        else {
            for (let i = 0; i < (this.id.length-1); i++){
                let id = this.id[i];
                if (ent.existe(id)) {
                    let simbol: Simbolo = ent.getSimbolo(id);
                    let tipo: Tipo = simbol.getTipo(ent,arbol);
                    if (tipo == Tipo.TIPO_STRUCT) {
                        let atributos:Array<Declaracion> = simbol.getValorImplicito(ent, arbol);
                        let idSig = this.id[i+1];
                        for (var atributo of atributos){
                            if (atributo.id[0] === idSig ) {
                                atributo.expresion = this.expresion;
                                break;
                            }
                        }                      
                    }
                }else{
                    console.log('Error semantico, no existe ' + id +' en la linea '+ this.linea + ' y columna ' + this.columna);
                }

            }
        }
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        if (this.id.length == 1) {
            let id = this.id[0];
            if (ent.existe(id)) {
                let simbol: Simbolo = ent.getSimbolo(id);
                let tipo: Tipo = simbol.getTipo(ent,arbol);
                let tipoExpr:Tipo = this.expresion.getTipo(ent,arbol,listaErrores);
                if ( tipo == tipoExpr ||  (tipoExpr==Tipo.INT && tipo == Tipo.DOUBLE)) {
                    if (tipo == Tipo.ARRAY) {
                        let arreglo:Arreglo = simbol.valor;
                        arreglo.cambiarContenido(this.expresion.getValorImplicito(ent,arbol,listaErrores));
                    }else{
                        simbol.valor = this.expresion.getValorImplicito(ent,arbol,listaErrores);
                    }                    
                }else{
                    // console.log('Error semantico, El tipo de la variable (' + tipo +') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent,arbol) + ') en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG('semantico','El tipo de la variable (' + this.getNameTipo(tipo) +') no concuerda con el tipo asignado',this.linea,this.columna));
                }
            }else{
                // console.log('Error semantico, no existe la variable ' + id +' en la linea '+ this.linea + ' y columna ' + this.columna);
                listaErrores.push(new ErrorG('semantico','no existe la variable ' + id,this.linea,this.columna));
            }            
        }
        else {
            let i  = 0;
            let id = this.id[i];              
                if (ent.existe(id)) {
                    let simbol: Simbolo = ent.getSimbolo(id);
                    let tipo: Tipo = simbol.getTipo(ent,arbol);
                    if (tipo == Tipo.TIPO_STRUCT) {
                        let atributos:Array<Declaracion> = simbol.getValorImplicito(ent, arbol);
                        this.asignacionStruct(i,atributos,ent,arbol,listaErrores);                                          
                    }else{
                        listaErrores.push(new ErrorG('semantico','la variable ' + id + ' no es de tipo Struct',this.linea,this.columna));
                    }
                }else{
                    // console.log('Error semantico, no existe ' + id +' en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG('semantico','no existe la variable ' + id,this.linea,this.columna));
                }

        }
    }
    getTipo(){
        return "asignacion";
    }

    asignacionStruct(i:number,atributos:Array<Declaracion>,ent:Entorno, arbol: AST,listaErrores:Array<ErrorG>){
        if ((i + 1) >= this.id.length) {
            // console.log("No se encontro");
            listaErrores.push(new ErrorG('semantico','No se encontro el atributo ' + this.id[i],this.linea,this.columna));
            return;
        }
        let idSig = this.id[i+1];
        for (var atributo of atributos){
            if (atributo.id.toString() === idSig ) {
                // console.log(atributo.tipo);
                let isStruct = false;
                arbol.structs.forEach((struct:Struct) => {
                    // console.log(struct.id);
                    if (struct.id === atributo.tipo.toString()) {
                        isStruct = true;
                    }
                })
                if (isStruct) {
                    // console.log(atributo.expresion);
                    if (atributo.expresion instanceof AccesoVariable) {
                        atributo.expresion.isAlone = false;
                        // console.log(atributo.expresion.getValorImplicito(ent, arbol));
                        let val1:Array<Declaracion> = atributo.expresion.getValorImplicito(ent, arbol,listaErrores);
                        atributo.expresion.isAlone = true;
                        this.asignacionStruct(i+1,val1,ent,arbol,listaErrores);
                    }                    
                }else{
                    if (this.expresion instanceof Primitivo || this.expresion instanceof AccesoArray ) {
                        atributo.expresion = this.expresion;    
                    }else{
                        let valorC:any = this.expresion.getValorImplicito(ent,arbol,listaErrores);
                        let primitivo = new Primitivo(valorC,this.expresion.linea,this.expresion.columna);
                        atributo.expresion = primitivo;
                    }
                }                               
                return;
            }
        }
    }

    getNameTipo(tipo:Tipo){
        if (tipo == Tipo.STRING) {
            return "string";
        }else if (tipo == Tipo.BOOL){
            return 'boolean';
        }else if (tipo == Tipo.INT){
            return 'int';
        }else if (tipo == Tipo.CHAR){
            return 'char';
        }else if (tipo == Tipo.DOUBLE) {
            return 'double';
        }else if (tipo == Tipo.VOID){
            return 'void';
        }else if (tipo == Tipo.STRUCT){
            return 'struct';
        }else if (tipo == Tipo.ARRAY){
            return 'array';
        }else if (tipo == Tipo.TIPO_STRUCT){
            return 'struct'
        }
        else{
            return 'null';
        }
    }

}