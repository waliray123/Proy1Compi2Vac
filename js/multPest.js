
function editor(){
    var editors = document.getElementsByClassName('editor');
    for (var i = 0; i < editors.length; i++) {
      var self = editors[i];
      var editor = CodeMirror.fromTextArea(self, {
        mode: "javascript",
        lineNumbers: true,
        autoRefresh: true,
        theme: "ayu-dark"
      });
      editor.save();
    }
}

editor();
function tabs_click(){
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
    var self = tabs[i];
    self.addEventListener('click', function() {
        var data = this.getAttribute('data-tab');
        document.querySelectorAll('.tab-pane.active')[0].classList.remove('active');
        document.querySelectorAll('.tab-pane[data-pane="'+data+'"]')[0].classList.add('active');
        document.querySelectorAll('.tab.active')[0].classList.remove('active');
        this.classList.add('active');
    });
    }
}
tabs_click();


var indexTab = 2;
function addTab(){
    indexTab += 1;
    var tabs = document.getElementById('tabs');
    tabs.innerHTML += `<li class="tab" data-tab="${indexTab-1}">${indexTab}</li>`
    var tabs_editors = document.getElementById('tab-editors');
    tabs_editors.innerHTML += `<div class="tab-pane" data-pane="${indexTab-1}"><textarea class="editor" id="editor-${indexTab}">// here is the ${indexTab}</textarea></div>`
    CreateEditor(`editor-${indexTab}`);
    tabs_click();
    showCode();
}

function CreateEditor(name){
    var editors = document.getElementById(name)
    var editor = CodeMirror.fromTextArea(editors, {
        mode: "javascript",
        lineNumbers: true,
        autoRefresh: true,
        theme: "ayu-dark"
      });
      editor.save();
}

function showCode () { 
    const editor= document.querySelector('.editor')
    editor.classList.toggle('active')
    
    // use the object for refresh CodeMirror 
    editor.CodeMirror.refresh()
  }