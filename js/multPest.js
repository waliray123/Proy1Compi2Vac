
//variables usadas tambien en funBasicas.js
var list_editors = [];
var index_tab_active=0;

function editor(){
    var editors = document.getElementsByClassName('editor');
    for (var i = 0; i < editors.length; i++) {
      var self = editors[i];
      var editor = CodeMirror.fromTextArea(self, {
        mode: "javascript",
        lineNumbers: true,
        autoRefresh: true,
        theme: "abcdef"
      });
      editor.save();
      list_editors.push(editor);
    }
}

editor();
function tabs_click(){
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
    var self = tabs[i];
    self.addEventListener('click', function() {
        var data = this.getAttribute('data-tab');
        index_tab_active = data;
        document.querySelectorAll('.tab-pane.active')[0].classList.remove('active');
        document.querySelectorAll('.tab-pane[data-pane="'+data+'"]')[0].classList.add('active');
        document.querySelectorAll('.tab.active')[0].classList.remove('active');
        this.classList.add('active');
    });
    }
}
tabs_click();
autoRefresh();


var indexTab = 4;
function addTab(){
    indexTab += 1;
    var tabs = document.getElementById('tabs');
    tabs.innerHTML += `<li class="tab" data-tab="${indexTab}" id="tab-${indexTab}">${indexTab+1}</li>`
    var tabs_editors = document.getElementById('tab-editors');
    tabs_editors.innerHTML += `<div class="tab-pane" data-pane="${indexTab}"><textarea class="editor" id="editor-${indexTab}">// Aqui la pestaña ${indexTab+1}</textarea></div>`
    CreateEditor(`editor-${indexTab}`);
    tabs_click();
    autoRefresh();
}

function CreateEditor(name){
    var editors = document.getElementById(name)
    var editor = CodeMirror.fromTextArea(editors, {
        mode: "javascript",
        lineNumbers: true,
        autoRefresh: true,
        theme: "abcdef"
      });
      editor.save();
      list_editors.push(editor);
}

function autoRefresh(){
  list_editors.forEach(function(editor, indice, array) {
    // editor.setOption("viewportMargin", Infinity)
    editor.refresh()
  })
}