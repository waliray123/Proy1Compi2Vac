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
"\"\""                	 yytext = yytext.slice(1,-1); return 'STRINGL';
"\""([^"]|{BSL})*"\"" 	 yytext = yytext.slice(1,-1); return 'STRINGL';

"\'"([^']|{BSL})*"\'" 	return 'CHARL';
"\'""\'" 	            return 'CHARL';


<<EOF>>               return 'EOF';
.                     return 'INVALID';
/lex


%start ini

%{
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
%}

/*---DEFINICION DE PRESEDENCIA DE OPERADORES---*/

%left 'OP_OR' 'COMA' 'OP_TER'
%left 'OP_AND'
%left 'OP_MEN' 'OP_MENIG' 'OP_MAY' 'OP_MAYIG' 'OP_IGUAL' 'OP_DOBIG' 'OP_DIF'
%left 'OP_SUMA' 'OP_RESTA' 'OP_AMP'
%left 'OP_MULT' 'OP_DIVI' 'OP_MOD'
%left 'OP_ELV' 
%left 'OP_NEG'
%left  UMINUS

%left 'PARI' 'PARD' 'CORCHI' 'CORCHD' 'OP_CALL'
%right 'OP_INCR' 'OP_DECR'

%% /* Definición de la gramática */


ini 
    : EOF                   {console.log("EOF encontrado");return [];}    
    | expresion EOF         {$$ = $1;return $$;}
;
expresion
    : primitivas                {$$ = $1;}
    | logicas                   {$$ = $1;}
    | operadores                {$$ = $1;}
    | relacionales              {$$ = $1;}
    | expresion_ternario        {$$ = $1;}
    | incr_decr                 {$$ = $1;}
    | nativas                   {$$ = $1;}
    | expresion_arr_arreglo     {$$ = $1;}
    | expresion_atributos       {$$ = $1;}
    | otras_nativas             {$$ = $1;}
    | error                     {}
;

expresion_arr_arreglo
    : ID_VAR CORCHI expresion CORCHD                    {$$ = new AccesoAtribArray($1,$3,@1.first_line, @1.first_column);}
;

expresion_atributos
    : expresion OP_CALL ID_VAR                           {$$ = new AccesoAtributo($1,$3,@1.first_line, @1.first_column);}
    | expresion OP_CALL LENGTH PARI PARD                 {$$ = new OperacionCadena($1,null,null,OperadorCadena.LENGTH,@1.first_line, @1.first_column);}
    | expresion OP_CALL STR_POP PARI PARD                {$$ = new OperacionCadena($1,null,null,OperadorCadena.POP,@1.first_line, @1.first_column);}
    | expresion OP_CALL UPPERCASE PARI PARD              {$$ = new OperacionCadena($1,null,null,OperadorCadena.UPPERCASE,@1.first_line, @1.first_column);}
    | expresion OP_CALL LOWERCASE PARI PARD              {$$ = new OperacionCadena($1,null,null,OperadorCadena.LOWERCASE,@1.first_line, @1.first_column);}
    | expresion OP_CALL CHARPOS PARI expresion PARD                             {$$ = new OperacionCadena($1,$5,null,OperadorCadena.CHARPOS,@1.first_line, @1.first_column);}
    | expresion OP_CALL SUBSTRING PARI expresion COMA expresion PARD            {$$ = new OperacionCadena($1,$5,$7,OperadorCadena.SUBSTRING,@1.first_line, @1.first_column);}
;

expresion_ternario
    : expresion OP_TER expresion DOSPUNT expresion          {$$ = new Ternario($1,$3,$5,@1.first_line, @1.first_column);}
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
    | OP_RESTA expresion %prec UMINUS   {$$ = new Operacion($2,null,Operador.MENOS_UNARIO, @1.first_line, @1.first_column);}
    | OP_NEG expresion              {$$ = new Operacion($2,null,Operador.NOT, @1.first_line, @1.first_column);}
;

incr_decr
    : primitivas OP_INCR         {$$ = new Operacion($1,null,Operador.INCREMENTO, @1.first_line, @1.first_column);}
    | primitivas OP_DECR         {$$ = new Operacion($1,null,Operador.DECREMENTO, @1.first_line, @1.first_column);}
;

nativas
    : STR_POW PARI expresion COMA expresion PARD  {$$ = new Operacion($3,$5,Operador.POW, @1.first_line, @1.first_column);}
    | STR_SQRT PARI expresion PARD {$$ = new Operacion($3,null,Operador.SQRT, @1.first_line, @1.first_column);}
    | STR_SIN PARI expresion PARD  {$$ = new Operacion($3,null,Operador.SIN, @1.first_line, @1.first_column);}
    | STR_COS PARI expresion PARD  {$$ = new Operacion($3,null,Operador.COS, @1.first_line, @1.first_column);}
    | STR_TAN PARI expresion PARD  {$$ = new Operacion($3,null,Operador.TAN, @1.first_line, @1.first_column);}
;

otras_nativas
    : tiposVar OP_CALL STR_PARSE PARI expresion PARD    {$$ = new OperacionNativa(OperadorNativa.PARSE,$1,$5,@1.first_line,@1.first_column);}
    | STR_TOINT PARI expresion PARD                     {$$ = new OperacionNativa(OperadorNativa.TOINT,Tipo.NULL,$3,@1.first_line,@1.first_column);}
    | STR_TODOUBLE PARI expresion PARD                  {$$ = new OperacionNativa(OperadorNativa.TODOUBLE,Tipo.NULL,$3,@1.first_line,@1.first_column);}                     
    | STR_string PARI expresion PARD                    {$$ = new OperacionNativa(OperadorNativa.STRING,Tipo.NULL,$3,@1.first_line,@1.first_column);}
    | STR_TYPEOF PARI expresion PARD                    {$$ = new OperacionNativa(OperadorNativa.TYPEOF,Tipo.NULL,$3,@1.first_line,@1.first_column);}
;

primitivas
    : STR_FALSE             {$$ = new Primitivo(false, @1.first_line, @1.first_column);}
    | STR_TRUE              {$$ = new Primitivo(true, @1.first_line, @1.first_column);}
    | ENTERO                {$$ = new Primitivo(Number($1), @1.first_line, @1.first_column);}
    | FLOTANTE              {let primitivo = new Primitivo(Number($1), @1.first_line, @1.first_column);primitivo.isFlotante=true;$$ = primitivo;}
    //| STRINGL               {$$ = new Primitivo($1, @1.first_line, @1.first_column);}
    //| CHARL                 {$$ = new Primitivo($1, @1.first_line, @1.first_column);}
    | ID_VAR                {$$ = new AccesoVariable($1, @1.first_line, @1.first_column);}
    | ID_VAR PARI parametros_funcion_return PARD       {$$ = new FuncionReturn($1,@1.first_line,@1.first_column,$3);}
    | STR_NULL              {$$ = new Primitivo(null, @1.first_line, @1.first_column);}
;