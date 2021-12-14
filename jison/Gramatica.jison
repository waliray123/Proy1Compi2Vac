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
"in"                 	return 'STR_IN';


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
    const {Tipo} = require("../dist/AST/Tipo");
    const {Print} = require("../dist/Instrucciones/Print");
    const {Declaracion} = require("../dist/Instrucciones/Declaracion");
    const {DeclaracionArray} = require("../dist/Instrucciones/DeclaracionArray");
    const {Asignacion} = require("../dist/Instrucciones/Asignacion");
    const {While} = require("../dist/Instrucciones/While");
    const {DoWhile} = require("../dist/Instrucciones/DoWhile");
    const {Funcion} = require("../dist/Instrucciones/Funcion");
    const {Struct} = require("../dist/Instrucciones/Struct");
    const {Switch} = require("../dist/Instrucciones/Switch");
    const {Ternario} = require("../dist/Expresiones/Ternario");
    const {AccesoAtributo} = require("../dist/Expresiones/AccesoAtributo");
    const {DeclaracionStruct} = require("../dist/Instrucciones/DeclaracionStruct");
    const {SwitchCaso} = require("../dist/Instrucciones/SwitchCaso");
    const {Break} = require("../dist/Instrucciones/Break");
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

%left 'OP_OR' 'COMA' 'OP_CALL' 'OP_TER'
%left 'OP_AND'
%left 'OP_MEN' 'OP_MENIG' 'OP_MAY' 'OP_MAYIG' 'OP_IGUAL' 'OP_DOBIG' 'OP_DIF'
%left 'OP_SUMA' 'OP_RESTA' 'OP_AMP'
%left 'OP_MULT' 'OP_DIVI' 'OP_MOD'
%left 'OP_ELV' 
%left 'OP_NEG'
%left  UMINUS

%left 'PARI' 'PARD' 'CORCHI' 'CORCHD'
%right 'OP_INCR' 'OP_DECR'

%% /* Definición de la gramática */

ini 
    : EOF                   {console.log("EOF encontrado");return [];}    
    | instrucciones EOF     {$$ = $1;return $$;}
;


instrucciones
    : instrucciones instruccion {$1.push($2); $$ = $1;}
    | instruccion               {$$ = [$1];}
;

instruccion 
    : declaracion_bloque    {$$ = $1;}        
    | asignacion_funcion    {$$ = $1;}
    | struct_declaracion    {$$ = $1;}
    | error                 {}
;

struct_declaracion 
    : STR_STRUCT ID_VAR cuerpo_struct {$$ = new Struct($2,$3,@1.first_line,@1.first_column); }
;

cuerpo_struct 
    : BRACKI BRACKD PUNTCOMA      {$$ = []; }
    | BRACKI contenido_struct BRACKD PUNTCOMA {$$ = $2;}
;

contenido_struct 
    : declaracion_struct                            {$$ = [$1];}
    | contenido_struct COMA declaracion_struct     {$1.push($3); $$= $1; }
;

declaracion_struct
    : tiposVar ID_VAR       {$$ = new Declaracion($2,$1,@1.first_line,@1.first_column,null);}
    | ID_VAR ID_VAR         {$$ = new Declaracion($2,$1,@1.first_line,@1.first_column,null);}
;

asignacion_funcion
    : VOID MAIN PARI PARD cuerpoFuncion                             {$$ = new Funcion("main","void",@1.first_line,@1.first_column,$5);}
    | tiposVar ID_VAR PARI parametros_funcion PARD cuerpoFuncion    {$$ = new Funcion($2,$1,@1.first_line,@1.first_column,$6,$4);}
;

parametros_funcion
    :   parametros_funcion COMA parametro_funcion   {$1.push($3);$$ = $1;}
    |   parametro_funcion                           {$$ = [$1];}
    |   {$$ = [];}
;

parametro_funcion
    : tiposVar ID_VAR {$$ = new Parametro($2,$1,@1.first_line,@1.first_column);}
;

parametros_funcion_return
    : parametros_funcion_return COMA parametro_funcion_return   {$1.push($3);$$ = $1;}
    | parametro_funcion_return                                  {$$ = [$1];}
    |                                                           {$$ = [];}
;

parametro_funcion_return
    : expresion {$$ = new ParametroReturn($1,@1.first_line,@1.first_column);}
; 

cuerpoFuncion
    : BRACKI instrucciones_funciones BRACKD {$$ = $2;}
    | BRACKI BRACKD {$$ = null;}
;

instrucciones_funciones
    : instrucciones_funciones instruccion_funcion
    {        
        $1.push($2);
        $$ = $1;
    }
    | instruccion_funcion
    {                
        $$ = [$1];
    }
;

instruccion_funcion
    : declaracion_bloque    {$$ = $1;} //TODO: FALTA AGREGAR EL IF, SWITCH, DEMAS...
    | asignacion_bloque     {$$ = $1;}
    | print_bloque          {$$ = $1;}
    | if_bloque             {$$ = $1;}
    | for_bloque            {$$ = $1;}
    | while_bloque          {$$ = $1;}
    | switch_bloque         {$$ = $1;}
    | funcion_return        {$$ = $1;}
;

funcion_return
    : ID_VAR PARI parametros_funcion_return PARD PUNTCOMA      {$$ = new FuncionReturn($1,@1.first_line,@1.first_column,$3);}
;

switch_bloque
    : STR_SWITCH PARI expresion PARD switch_cuerpo      {$$ = new Switch($3,$5,@1.first_line,@1.first_column);}
    |error
;
 
switch_cuerpo
    : BRACKI BRACKD     {$$= [];}
    | BRACKI casos_switch opcional_default BRACKD   
        {
            if ($3 != null){
                $2.push($3);
            }
            $$ = $2;
        }
;

casos_switch
    : casos_switch caso_switch    {$1.push($2); $$ = $1;}       
    | caso_switch                 {$$ = [$1];}
;

caso_switch
    : STR_CASE expresion DOSPUNT contenido_caso        {$$ = new SwitchCaso($2,$4,@1.first_line,@1.first_column);}
;

contenido_caso
    : instrucciones_funciones opcional_break        
        {
            if ($2 != null){
                $1.push($2);
            }
            $$ = $1;
        }
    | opcional_break                                
        {
            if ($1 == null){
                $$ = [];
            }else{
                $$ = [$1];
            }
        }
;

opcional_default
    : STR_DEFAULT DOSPUNT contenido_caso            {$$ = new SwitchCaso('DEFAULT',$3,@1.first_line,@1.first_column);}
    |                                               {$$ = null;}
;

opcional_break
    : BREAK PUNTCOMA            {$$ = new Break(@1.first_line,@1.first_column);}
    | CONTINUE PUNTCOMA         {$$ = new Continue(@1.first_line,@1.first_column);}
    |                           {$$ = null;}
;

declaracion_bloque
    : tiposVar nombreVars PUNTCOMA              {$$ = new Declaracion($2,$1,@1.first_line,@1.first_column,null);}
    | tiposVar nombreVars asignacion PUNTCOMA   {$$ = new Declaracion($2,$1,@1.first_line,@1.first_column,$3);}
    | ID_VAR ID_VAR asignacion PUNTCOMA         {$$ =  new DeclaracionStruct($2,$1,@1.first_line,@1.first_column,$3);}
    | declaracion_arreglo                       {$$ = $1;}
;

declaracion_arreglo
    : tiposVar arr_decl nombreVars PUNTCOMA                 {$$ = new DeclaracionArray($3,$1,$2,@1.first_line,@1.first_column,null);}
    | tiposVar arr_decl nombreVars asignacion PUNTCOMA      {$$ = new DeclaracionArray($3,$1,$2,@1.first_line,@1.first_column,$4);}
;

asignacion_bloque
    : nombreAtributos asignacion PUNTCOMA        {$$ = new Asignacion($1,@1.first_line,@1.first_column,$2);}
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

for_bloque
    : STR_FOR PARI decl_asign PUNTCOMA expresion PUNTCOMA expresion PARD cuerpoFuncion      {$$ = new For(@1.first_line,@1.first_column,$9,$3,$5,$7);}
    | STR_FOR ID_VAR STR_IN ID_VAR cuerpoFuncion                                            {$$ = new Forin(@1.first_line,@1.first_column,$5,$2,$4);}
    | STR_FOR ID_VAR STR_IN arr_decl cuerpoFuncion                                          {$$ = new Forin(@1.first_line,@1.first_column,$5,$2,$4);}
    | STR_FOR ID_VAR STR_IN arr_begin_end cuerpoFuncion                                     {$$ = new Forin(@1.first_line,@1.first_column,$5,$2,$4);}
;

while_bloque
    : STR_WHILE PARI expresion PARD cuerpoFuncion           {$$ = new While(@1.first_line,@1.first_column,$5,$3);}
    | STR_DO cuerpoFuncion STR_WHILE PARI expresion PARD    {$$ = new DoWhile(@1.first_line,@1.first_column,$2,$5);}
;

decl_asign
    : tiposVar nombreVars asignacion    {$$ = new Declaracion($2,$1,@1.first_line,@1.first_column,$3);}
    | nombreVars asignacion             {$$ = new Asignacion($1,@1.first_line,@1.first_column,$2);}
;


arr_decl
    : CORCHI parametros_arreglo CORCHD {$$ = $2}
    | CORCHI CORCHD {$$ = [];}
;

parametros_arreglo
    : expresion_arreglo                         {$$ = [$1]}
    | parametros_arreglo COMA parametros_arreglo  {$1.push($3);$$ = $1;}
;

expresion_arreglo
    : expresion         {$$ = $1;}
;

arr_begin_end
    : ID_VAR CORCHI expresion DOSPUNT expresion CORCHD  {$$ = new ArrbegEnd($1,@1.first_line,@1.first_column,$3,$5);}
    | ID_VAR CORCHI STR_BEGIN DOSPUNT expresion CORCHD  {let beg = new Primitivo("begin", @1.first_line, @1.first_column); $$ = new ArrbegEnd($1,@1.first_line,@1.first_column,beg,$5);}
    | ID_VAR CORCHI STR_BEGIN DOSPUNT STR_END CORCHD    {let beg1 = new Primitivo("begin", @1.first_line, @1.first_column); let end1 = new Primitivo("end", @1.first_line, @1.first_column); $$ = new ArrbegEnd($1,@1.first_line,@1.first_column,beg1,end1);}
    | ID_VAR CORCHI expresion DOSPUNT STR_END CORCHD    {let beg2 = new Primitivo("end", @1.first_line, @1.first_column); $$ = new ArrbegEnd($1,@1.first_line,@1.first_column,$3,beg2);}
;


tiposVar 
    : STR_STRING    {$$ = Tipo.STRING;}
    | STR_DOUBLE    {$$ = Tipo.DOUBLE;}
    | STR_INTEGER   {$$ = Tipo.INT;}
    | STR_BOOLEAN   {$$ = Tipo.BOOL;}
    | STR_CHAR      {$$ = Tipo.CHAR;}
;

nombreVars 
    : ID_VAR {$$ = [$1];}
    | nombreVars COMA ID_VAR  { $1.push($3);$$ = $1;}
;

nombreAtributos
    : nombreAtributos OP_CALL ID_VAR       {$1.push($3); $$ = $1;}
    | ID_VAR                               {$$ = [$1];}
;

asignacion
    : OP_IGUAL expresion {$$ = $2;}
;

expresion
    : primitivas            {$$ = $1;}
    | logicas               {$$ = $1;}
    | operadores            {$$ = $1;}
    | relacionales          {$$ = $1;}
    | expresion_ternario    {$$ = $1;}
    | incr_decr             {$$ = $1;}
    | nativas               {$$ = $1;}
    | arr_decl              {$$ = $1;}
    | expresion_atributos   {$$ = $1;}
;

expresion_atributos
    : expresion OP_CALL expresion                           {$$ = new AccesoAtributo($1,$3,@1.first_line, @1.first_column);}
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
    : expresion OP_INCR         {$$ = new Operacion($1,null,Operador.INCREMENTO, @1.first_line, @1.first_column);}
    | expresion OP_DECR         {$$ = new Operacion($1,null,Operador.DECREMENTO, @1.first_line, @1.first_column);}
;

nativas
    : STR_POW PARI expresion COMA expresion PARD  {$$ = new Operacion($3,$5,Operador.POW, @1.first_line, @1.first_column);}
    | STR_SQRT PARI expresion PARD {$$ = new Operacion($3,null,Operador.SQRT, @1.first_line, @1.first_column);}
    | STR_SIN PARI expresion PARD  {$$ = new Operacion($3,null,Operador.SIN, @1.first_line, @1.first_column);}
    | STR_COS PARI expresion PARD  {$$ = new Operacion($3,null,Operador.COS, @1.first_line, @1.first_column);}
    | STR_TAN PARI expresion PARD  {$$ = new Operacion($3,null,Operador.TAN, @1.first_line, @1.first_column);}
;

primitivas
    : STR_FALSE             {$$ = new Primitivo(false, @1.first_line, @1.first_column);}
    | STR_TRUE              {$$ = new Primitivo(true, @1.first_line, @1.first_column);}
    | ENTERO                {$$ = new Primitivo(Number($1), @1.first_line, @1.first_column);}
    | FLOTANTE              {$$ = new Primitivo(Number($1), @1.first_line, @1.first_column);}
    | STRINGL               {$$ = new Primitivo($1, @1.first_line, @1.first_column);}
    | CHARL                 {$$ = new Primitivo($1, @1.first_line, @1.first_column);}
    | ID_VAR                {$$ = new AccesoVariable($1, @1.first_line, @1.first_column);}
    | ID_VAR PARI parametros_funcion_return PARD       {$$ = new FuncionReturn($1,@1.first_line,@1.first_column,$3);}
    | STR_NULL              {$$ = new Primitivo(null, @1.first_line, @1.first_column);}
;


