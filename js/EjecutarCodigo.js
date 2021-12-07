function ejecutar(){
    let codigo = editor.getValue();    
    console.log(codigo);
    var erroresCom = [];
    var objetos = Gramatica.parse(codigo);
    console.log(objetos);


}


