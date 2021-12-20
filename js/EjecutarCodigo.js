
function compilar(){
   ejecutarCodigo(list_editors[index_tab_active].getValue());
}

function traducir(){
   traducirCodigo(list_editors[index_tab_active].getValue());
}

let isActiveReportError = false;
function generarReportError(){
   reporteError(isActiveReportError);
   let boton = document.getElementById('report-error');
   if(isActiveReportError){
      isActiveReportError = false;
      boton.innerText = 'Ver Reporte de errores';
   }else{
      isActiveReportError = true;
      boton.innerText = 'Ocultar Reporte de errores';
   }
}

