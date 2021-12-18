import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Simbolo } from "../AST/Simbolo";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { AccesoVariable } from "../Expresiones/AccesoVariable";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
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

    traducir(ent:Entorno, arbol:AST,resultado3d:Resultado3D,temporales:Temporales) {
        
        if (this.id.length == 1) {
            let id = this.id[0];
            if (ent.existe(id)) {
                let simbol: Simbolo = ent.getSimbolo(id);
                let tipo: Tipo = simbol.getTipo(ent,arbol);
                if (tipo == this.expresion.getTipo(ent,arbol)) {
                    //Asignar al stack
                    let valAsign = this.expresion.traducir(ent,arbol,resultado3d,temporales,0);
                    resultado3d.codigo3D += '\tstack[(int)'+simbol.valor+'] ='+ valAsign  +';\n';
                }else{
                    console.log('Error semantico, El tipo de la variable (' + tipo +') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent,arbol) + ') en la linea '+ this.linea + ' y columna ' + this.columna);
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
                if (tipo == this.expresion.getTipo(ent,arbol)) {
                    simbol.valor = this.expresion.getValorImplicito(ent,arbol);
                }else{
                    console.log('Error semantico, El tipo de la variable (' + tipo +') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent,arbol) + ') en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG('semantico','El tipo de la variable (' + tipo +') no concuerda con el tipo asignado',this.linea,this.columna));
                }
            }else{
                console.log('Error semantico, no existe la variable ' + id +' en la linea '+ this.linea + ' y columna ' + this.columna);
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
                    }
                }else{
                    console.log('Error semantico, no existe ' + id +' en la linea '+ this.linea + ' y columna ' + this.columna);
                    listaErrores.push(new ErrorG('semantico','no existe la variable ' + id,this.linea,this.columna));
                }

        }
    }
    getTipo(){
        return "asignacion";
    }

    asignacionStruct(i:number,atributos:Array<Declaracion>,ent:Entorno, arbol: AST,listaErrores:Array<ErrorG>){
        if ((i + 1) >= this.id.length) {
            console.log("No se encontro");
            listaErrores.push(new ErrorG('semantico','No se encontro el atributo ' + this.id[i],this.linea,this.columna));
            return;
        }
        let idSig = this.id[i+1];
        for (var atributo of atributos){
            if (atributo.id[0] === idSig ) {
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
                        let val1:Array<Declaracion> = atributo.expresion.getValorImplicito(ent, arbol);
                        atributo.expresion.isAlone = true;
                        this.asignacionStruct(i+1,val1,ent,arbol,listaErrores);
                    }                    
                }else{
                    atributo.expresion = this.expresion;
                }                               
                return;
            }
        }
    }

}