import { AST } from "../AST/AST";
import { Entorno } from "../AST/Entorno";
import { Resultado3D } from "../AST/Resultado3D";
import { Simbolo } from "../AST/Simbolo";
import { Temporales } from "../AST/Temporales";
import { Tipo } from "../AST/Tipo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { ErrorG } from "../Objetos/ErrorG";

// print("hola mundo");

export class Declaracion implements Instruccion{
    linea: number;
    columna: number;
    public id:Array<string>;
    public expresion:Expresion;
    public tipo:Tipo;

    constructor(id:Array<string>,tipo:Tipo, linea:number, columna:number,expresion:Expresion){
        this.id = id;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }

    traducir(ent:Entorno, arbol:AST,resultado3d:Resultado3D,temporales:Temporales,listaErrores:Array<ErrorG>) {
        
        this.id.forEach((id:string)=>{
            if (ent.existeEnActual(id) ){
                console.log('Id '+ id +' ya existe');
            }else{
                if(this.expresion == null){
                    //Se genera el simbolo y se le asigna un lugar en el stack

                    let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,temporales.ultstack);
                    temporales.ultstack += 1;
                    ent.agregar(id,simbol);
                    if(temporales.esFuncion){
                        temporales.ultimoTemp += 1;
                        resultado3d.codigo3D += '\tt'+temporales.ultimoTemp + '= P +'+(temporales.cantidadParametrosFunc) + ';\n';
                        simbol.valor = (temporales.cantidadParametrosFunc);
                        temporales.cantidadParametrosFunc += 1;
                        resultado3d.codigo3D += '\tstack[(int)t'+temporales.ultimoTemp+'];\n';
                    }else{
                        resultado3d.codigo3D += '\tstack[(int)'+simbol.valor+'];\n';
                    } 
                    
                }else{
                    let tipoExpr:Tipo = this.expresion.getTipo(ent,arbol,listaErrores);
                    if(tipoExpr == this.tipo){
                        
                        //Se genera el simbolo y se le asigna un lugar en el stack

                        //this.expresion.getValorImplicito(ent,arbol)                        
                        let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,temporales.ultstack);
                        ent.agregar(id,simbol);
                        
                        
                        temporales.ultstack += 1;                        
                        //Asignar el valor al stack
                        let valAsign = this.expresion.traducir(ent,arbol,resultado3d,temporales,0);
                        if(temporales.ultimoTipo == Tipo.BOOL){
                            if(temporales.esFuncion){
                                temporales.ultimoTemp += 1;
                                resultado3d.codigo3D += 't'+temporales.ultimoTemp + '= P +'+(temporales.cantidadParametrosFunc) + ';\n';
                                simbol.valor = (temporales.cantidadParametrosFunc);
                                temporales.cantidadParametrosFunc += 1;
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
                                resultado3d.codigo3D += '\tt'+temporales.ultimoTemp + '= P +'+(temporales.cantidadParametrosFunc) + ';\n';
                                simbol.valor = (temporales.cantidadParametrosFunc);
                                temporales.cantidadParametrosFunc += 1;
                                resultado3d.codigo3D += '\tstack[(int)t'+temporales.ultimoTemp+'] ='+ valAsign  +';\n';
                            }else{
                                resultado3d.codigo3D += '\tstack[(int)'+simbol.valor+'] ='+ valAsign  +';\n';
                            }                            
                        }
                        
                        
                    }else{
                        console.log('Error semantico, El tipo declarado (' + this.tipo +') no concuerda con el tipo asignado (' + tipoExpr + ') en la linea '+ this.linea + ' y columna ' + this.columna);
                    }                    
                }
            }
        })
        
    }

    ejecutar(ent: Entorno, arbol: AST,listaErrores:Array<ErrorG>) {
        // console.log('ejecutado...'+ this.id);
        this.id.forEach((id:string)=>{
            if (ent.existeEnActual(id) ){
                // console.log('Id '+ id +' ya existe');
                listaErrores.push(new ErrorG('semantico','la variable ' + id + ' ya existe',this.linea,this.columna));
            }else{
                if(this.expresion == null){
                    let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,this.getValDefault());
                    ent.agregar(id,simbol);
                }else{
                    let tipoExpr:Tipo = this.expresion.getTipo(ent,arbol,listaErrores);            
                    if(tipoExpr == this.tipo ||  (tipoExpr==Tipo.INT && this.tipo == Tipo.DOUBLE)){
                        let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,this.expresion.getValorImplicito(ent,arbol,listaErrores));
                        ent.agregar(id,simbol);
                    }else{
                        // console.log('Error semantico, El tipo declarado (' + this.tipo +') no concuerda con el tipo asignado (' + tipoExpr + ') en la linea '+ this.linea + ' y columna ' + this.columna);
                        listaErrores.push(new ErrorG('semantico', 'El tipo declarado (' + ent.getNameTipo(this.tipo) +') no concuerda con el tipo asignado',this.linea,this.columna));
                    }                    
                }
            }
        })
    }

    getValDefault():any {
        if (this.tipo == Tipo.STRING) {
            return "undefined";
        }else if (this.tipo == Tipo.BOOL){
            return true;
        }else if (this.tipo == Tipo.INT){
            return 0;
        }else if (this.tipo == Tipo.CHAR){
            return 'a';
        }else if (this.tipo == Tipo.DOUBLE) {
            return 0.0;
        }else{
            return null;
        }
    }
    getTipo(){
        return "declaracion";
    }

}