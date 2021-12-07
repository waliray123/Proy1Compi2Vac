function ejecutar(){
    let codigo = list_editors[index_tab_active].getValue();    
    console.log(codigo);
    var erroresCom = [];
    var objetos = Gramatica.parse(codigo);
    console.log(objetos);


}


