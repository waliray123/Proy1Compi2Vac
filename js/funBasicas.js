//abrir un archivo
function leerArchivo(e){
    var archivo = e.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
      var contenido = e.target.result;
      mostrarContenido(contenido);
    };
    lector.readAsText(archivo);
  }
  
  function mostrarContenido(contenido) {
      list_editors[index_tab_active].setValue(contenido) //variables declaradas en multPest
      document.getElementById('file-input').value ='';
    }
  
    document.getElementById('file-input')
    .addEventListener('change', leerArchivo, false);
  //
  
  //guardar un archivo
  
  function download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
  
      element.style.display = 'none';
      document.body.appendChild(element);
  
      element.click();
  
      document.body.removeChild(element);
  }
  
  // Start file download.
  document.getElementById("dwn-btn").addEventListener("click", function(){
      // Generate download of hello.txt file with some content
      var text = list_editors[index_tab_active].getValue();
      //var filename = "hello.txt";
      var filename = prompt('Ingrese el nombre del archivo')
      if (filename!= null){
          download(filename, text);
      }    
  }, false);