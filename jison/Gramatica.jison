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


<<EOF>>               return 'EOF';
.                     return 'INVALID';
/lex


%start ini

%{
    //const {ErrorCom} = require(['../ts/ErrorCom']);
    

    /*---CODIGO INCRUSTADO---*/
    var errores = [
        "Se esperaba una instruccion como : "
    ];

    function genError(desc,linea,columna,val){
        let errorCom = new ErrorCom("Sintactico",linea,columna,errores[desc],val);
        return errorCom;
    }
%}

%% /* Definición de la gramática */

ini 
    : EOF
    {
        $$.push("aaa");
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
        $2.push([new ErrorCom("Sintactico",@1.first_line,@1.last_column,$1)]);
        $$ = $2;
    }
    | error 
    {             
        $$ = [new ErrorCom("Sintactico",@1.first_line,@1.last_column,$1)];
    }
;

instruccion 
    : declaracion_bloque
    {
        $$ = new Objeto("Declaracion",@1.first_line,@1.last_column,[]);
    }
;

declaracion_bloque
    : tiposVar nombreVars PUNTCOMA
;

tiposVar 
    : STR_STRING
    | STR_DOUBLE
    | STR_INTEGER
    | STR_BOOLEAN
    | STR_CHAR    
;

nombreVars 
    : ID_VAR
    | ID_VAR COMA nombreVars
;