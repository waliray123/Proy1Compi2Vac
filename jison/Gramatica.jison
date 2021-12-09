/* Definición Léxica */
%lex

%options ranges

D                 [0-9]
NZ                [1-9]
Ds                ("0"|{NZ}{D}*)
EXPO              ([Ee][+-]?{Ds})
BSL               "\\".
%s                comment

%%

\/\/.*                  /* skip comments */
\/\*                    this.begin('comment');
<comment>\*\/           this.popState();
<comment>.            	/* skip comment content*/
\s+                   	/* skip whitespace */

/*---SIMBOLOS BASICOS---*/
"{"                   	return 'BRACKI'; 
"}"                   	return 'BRACKD';
"("                   	return 'PARI';
")"                   	return 'PARD';
"["                   	return 'CORCHI';
"]"                   	return 'CORCHD';
","                   	return 'COMA';
":"                   	return 'DOSPUNT';
";"                  	return 'PUNTCOMA';

/*---PALABRAS RESERVADAS ---*/
"println"  				return "PRINTLN";
"print"  				return "PRINT";

"void"                	return 'VOID';
"main"                	return 'MAIN';
"if"                  	return 'STR_IF';
"elseif"                return 'STR_ELSEIF';
"else"                	return 'STR_ELSE';
"while"               	return 'STR_WHILE';
"do"                  	return 'STR_DO';
"for"                 	return 'STR_FOR';
"break"               	return 'BREAK';
"continue"              return 'CONTINUE';
"switch"              	return 'STR_SWITCH';
"case"                	return 'STR_CASE';
"default"             	return 'STR_DEFAULT';
"true"                	return 'STR_TRUE';
"false"               	return 'STR_FALSE';
"return"              	return 'STR_RETURN';
"boolean"             	return 'STR_BOOLEAN';
"int"                 	return 'STR_INTEGER';
"double"              	return 'STR_DOUBLE';
"char"              	return 'STR_CHAR';
"String"              	return 'STR_STRING';
"struct"              	return 'STR_STRUCT';
"begin"              	return 'STR_BEGIN';
"end"              	    return 'STR_END';
"function"              return 'STR_FUNCTION';


/*---PALABRAS FUNCIONES NATIVAS---*/
"pow"              	    return 'STR_POW';
"sqrt"              	return 'STR_SQRT';
"sin"              	    return 'STR_SIN';
"cos"              	    return 'STR_COS';
"tan"              	    return 'STR_TAN';
"parse"              	return 'STR_PARSE';
"toInt"              	return 'STR_TOINT';
"toDouble"              return 'STR_TODOUBLE';
"string"                return 'STR_string';
"typeof"                return 'STR_TYPEOF';
"push"                  return 'STR_PUSH';
"pop"                   return 'STR_POP';



/*---PALABRAS FUNCIONES DE CADENAS---*/
"caracterOfPosition"    return 'CHARPOS';
"subString"             return 'SUBSTRING';
"length"                return 'LENGTH';
"toUppercase"           return 'UPPERCASE';
"toLowercase"           return 'LOWERCASE';



/*---OPERADORES BASICOS---*/
"<="                  	return 'OP_MENIG';
"<"                   	return 'OP_MEN';
"=="                  	return 'OP_DOBIG';
">="                  	return 'OP_MAYIG';
">"                   	return 'OP_MAY';
"!="                  	return 'OP_DIF';
"||"                  	return 'OP_OR';
"&&"                  	return 'OP_AND';
"&"                  	return 'OP_AMP';
"!"                   	return 'OP_NEG';
"="                   	return 'OP_IGUAL';
"+="                  	return 'OP_MASIG';
"-="                  	return 'OP_RESIG';
"*="                  	return 'OP_PORIG';
"/="                  	return 'OP_DIVIG';
"%="                  	return 'OP_MODIG';
"++"                  	return 'OP_INCR';
"+"                   	return 'OP_SUMA';
"--"                  	return 'OP_DECR';
"-"                   	return 'OP_RESTA';
"*"                   	return 'OP_MULT';
"/"                   	return 'OP_DIVI';
"%"                   	return 'OP_MOD';
"."						return 'OP_CALL';
"^"						return 'OP_ELV';
"?"						return 'OP_TER';
"#"						return 'OP_HASH';
"null"                	return 'STR_NULL';
//"~"                   	return 'OPERATOR_BITWISE_NEGATION';

/*---EXPRESIONES REGULARES---*/
[A-Z][a-zA-Z0-9_]*   	return 'ID_VAR';

[a-zA-Z][a-zA-Z0-9_]*   return 'ID_VAR';

({Ds}"."{Ds}?{EXPO}?[fFdD]?|"."{Ds}{EXPO}?[fFdD]?|{Ds}{EXPO}[fFdD]?|{Ds}{EXPO}?[fFdD])/([^\w]|$)   return 'FLOTANTE';
{Ds}          			return 'ENTERO';
"\"\""                	return 'STRINGL';
"\""([^"]|{BSL})*"\"" 	return 'STRINGL';

"\'"([^']|{BSL})*"\'" 	return 'CHARL';
"\'""\'" 	            return 'CHARL';


<<EOF>>               return 'EOF';
.                     return 'INVALID';
/lex


%start ini

%{
    //const {ErrorCom} = require(['../ts/ErrorCom']);
    /*---CLASES IMPORTADAS---*/
    const {Print} = require("../dist/Instrucciones/Print");
    const {Declaracion} = require("../dist/Instrucciones/Declaracion");    
    const {Asignacion} = require("../dist/Instrucciones/Asignacion");
    const {Funcion} = require("../dist/Instrucciones/Funcion");
    const {Parametro} = require("../dist/Instrucciones/Parametro");
    const {Primitivo} = require("../dist/Expresiones/Primitivo");
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
%}

/*---DEFINICION DE PRESEDENCIA DE OPERADORES---*/

%left 'OP_OR'
%left 'OP_AND'
%left 'OP_MEN' 'OP_MENIG' 'OP_MAY' 'OP_MAYIG' 'OP_IGUAL' 'OP_DOBIG' 'OP_DIF'
%left 'OP_SUMA' 'OP_RESTA' 'OP_AMP'
%left 'OP_MULT' 'OP_DIVI' 'OP_MOD'
%left 'OP_ELV'
%left 'OP_NEG'
%left  UMINUS

%left 'PARI' 'PARD'

%% /* Definición de la gramática */

ini 
    : EOF
    {        
        console.log("EOF encontrado");
        return $$;
    }    
    | instrucciones EOF
    {
        $$ = $1;     
        return $$;   
    }
;


instrucciones
    : instruccion instrucciones
    {
        $2.push($1);
        $$ = $2;
    }
    | instruccion
    {        
        $$ = [$1];
    }
    | error instrucciones
    {                
        //$2.push([new ErrorCom("Sintactico",@1.first_line,@1.last_column,$1)]);
        $$ = $2;
    }
    | error 
    {             
        //$$ = [new ErrorCom("Sintactico",@1.first_line,@1.last_column,$1)];
    }
;

instruccion 
    : declaracion_bloque    {$$ = $1;}
    | asignacion_bloque     {$$ = $1;}    
    | asignacion_funcion    {$$ = $1;}
;

asignacion_funcion
    : VOID MAIN PARI PARD cuerpoFuncion                             {$$ = new Funcion("main","void",@1.first_line,@1.first_column,$5);}
    | tiposVar ID_VAR PARI parametros_funcion PARD cuerpoFuncion    {$$ = new Funcion($2,$1,@1.first_line,@1.first_column,$6,$4);}
;

parametros_funcion
    :   parametro_funcion COMA parametros_funcion   {$3.push($1);$$ = $3;}
    |   parametro_funcion                           {$$ = [$1];}
    |   {$$ = [];}
;

parametro_funcion
    : tiposVar ID_VAR {$$ = new Parametro($2,$1,@1.first_line,@1.first_column);}
;

cuerpoFuncion
    : BRACKI instrucciones_funciones BRACKD {$$ = $2;}
    | BRACKI BRACKD {$$ = null;}
;

instrucciones_funciones
    : instruccion_funcion instrucciones_funciones   {$2.push($1);$$ = $2;}
    | instruccion_funcion                           {$$ = [$1];}
    | error instrucciones_funciones                 {$$ = $2;}
    | error 
;

instruccion_funcion
    : declaracion_bloque    {$$ = $1;} //TODO: FALTA AGREGAR EL IF, SWITCH, DEMAS...
    | asignacion_bloque     {$$ = $1;}
    | print_bloque          {$$ = $1;}
    | if_bloque             {$$ = $1;}
;

declaracion_bloque
    : tiposVar nombreVars PUNTCOMA              {$$ = new Declaracion($2,$1,@1.first_line,@1.first_column);}
    | tiposVar nombreVars asignacion PUNTCOMA   {$$ = new Declaracion($2,$1,@1.first_line,@1.first_column,$3);}
;

asignacion_bloque
    : nombreVars asignacion PUNTCOMA {$$ = new Asignacion($1,@1.first_line,@1.first_column,$2);}
;

print_bloque
    : PRINT PARI expresion PARD PUNTCOMA        {$$ = new Print($3,@1.first_line,@1.first_column,false);}
    | PRINTLN PARI expresion PARD PUNTCOMA      {$$ = new Print($3,@1.first_line,@1.first_column,true);}
;

if_bloque
    : STR_IF PARI expresion PARD cuerpoFuncion sinos_bloque
    | STR_IF PARI expresion PARD instruccion_funcion 
;

instruccion_devuelta
    : instruccion_funcion {$$ = [$1]}
;

sinos_bloque
    : STR_ELSE cuerpoFuncion
    | STR_ELSE instruccion_devuelta
    | STR_ELSEIF PARI expresion PARD cuerpoFuncion sinos_bloque
    | STR_ELSEIF PARI expresion PARD instruccion_devuelta 
    |
;

tiposVar 
    : STR_STRING    {$$ = "STRING";}
    | STR_DOUBLE    {$$ = "DOUBLE";}
    | STR_INTEGER   {$$ = "INTEGER";}
    | STR_BOOLEAN   {$$ = "BOOLEAN";}
    | STR_CHAR      {$$ = "CHAR";}
;

nombreVars 
    : ID_VAR {$$ = [$1];}
    | ID_VAR COMA nombreVars { $3.push($1);$$ = $3;}
;

asignacion
    : OP_IGUAL expresion {$$ = $2;}
;

expresion
    : primitivas    {$$ = $1;}
    | logicas       {$$ = $1;}
    | operadores    {$$ = $1;}
    | relacionales  {$$ = $1;}
;

logicas
    : expresion OP_AND expresion    {$$ = new Operacion($1,$3,Operador.AND, @1.first_line, @1.first_column);}
    | expresion OP_OR expresion     {$$ = new Operacion($1,$3,Operador.OR, @1.first_line, @1.first_column);}
;

relacionales
    : expresion OP_DOBIG expresion  {$$ = new Operacion($1,$3,Operador.IGUAL_IGUAL, @1.first_line, @1.first_column);}
    | expresion OP_DIF expresion    {$$ = new Operacion($1,$3,Operador.DIFERENTE_QUE, @1.first_line, @1.first_column);}
    | expresion OP_MAYIG expresion  {$$ = new Operacion($1,$3,Operador.MAYOR_IGUA_QUE, @1.first_line, @1.first_column);}
    | expresion OP_MENIG expresion  {$$ = new Operacion($1,$3,Operador.MENOR_IGUA_QUE, @1.first_line, @1.first_column);}
    | expresion OP_MEN expresion    {$$ = new Operacion($1,$3,Operador.MENOR_QUE, @1.first_line, @1.first_column);}
    | expresion OP_MAY expresion    {$$ = new Operacion($1,$3,Operador.MAYOR_QUE, @1.first_line, @1.first_column);}
;

operadores
    : expresion OP_MULT expresion   {$$ = new Operacion($1,$3,Operador.MULTIPLICACION, @1.first_line, @1.first_column);}
    | expresion OP_DIVI expresion   {$$ = new Operacion($1,$3,Operador.DIVISION, @1.first_line, @1.first_column);}
    | expresion OP_SUMA expresion   {$$ = new Operacion($1,$3,Operador.SUMA, @1.first_line, @1.first_column);}
    | expresion OP_RESTA expresion  {$$ = new Operacion($1,$3,Operador.RESTA, @1.first_line, @1.first_column);}
    | expresion OP_AMP expresion    {$$ = new Operacion($1,$3,Operador.AMPERSON, @1.first_line, @1.first_column);}
    | expresion OP_ELV expresion    {$$ = new Operacion($1,$3,Operador.ELEVADO, @1.first_line, @1.first_column);}
    | expresion OP_MOD expresion    {$$ = new Operacion($1,$3,Operador.MODULO, @1.first_line, @1.first_column);}
    | PARI expresion PARD           {$$ = $2;}
    | OP_RESTA expresion %prec UMINUS   {$$ = new Operacion($1,$3,Operador.MENOS_UNARIO, @1.first_line, @1.first_column);}
;

primitivas
    : STR_FALSE             {$$ = new Primitivo(false, @1.first_line, @1.first_column);}
    | STR_TRUE              {$$ = new Primitivo(true, @1.first_line, @1.first_column);}
    | ENTERO                {$$ = new Primitivo(Number($1), @1.first_line, @1.first_column);}
    | FLOTANTE              {$$ = new Primitivo(Number($1), @1.first_line, @1.first_column);}
    | STRINGL               {$$ = new Primitivo($1, @1.first_line, @1.first_column);}
;


