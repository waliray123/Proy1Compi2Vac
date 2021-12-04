 //(sorry for the grammer mistakes)

/*Caret function sources: https://jsfiddle.net/nrx9yvw9/5/ && https://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022*/
function createRange(e,t,n){if(n||((n=document.createRange()).selectNode(e),n.setStart(e,0)),0===t.count)n.setEnd(e,t.count);else if(e&&t.count>0)if(e.nodeType===Node.TEXT_NODE)e.textContent.length<t.count?t.count-=e.textContent.length:(n.setEnd(e,t.count),t.count=0);else for(var o=0;o<e.childNodes.length&&(n=createRange(e.childNodes[o],t,n),0!==t.count);o++);return n}function getCurrentCaretPosition(e){var t,n=0,o=e.ownerDocument||e.document,a=o.defaultView||o.parentWindow;if(void 0!==a.getSelection){if((t=a.getSelection()).rangeCount>0){var r=a.getSelection().getRangeAt(0),c=r.cloneRange();c.selectNodeContents(e),c.setEnd(r.endContainer,r.endOffset),n=c.toString().length}}else if((t=o.selection)&&"Control"!=t.type){var i=t.createRange(),g=o.body.createTextRange();g.moveToElementText(e),g.setEndPoint("EndToEnd",i),n=g.text.length}return n}function setCurrentCaretPosition(e,t){if(t>=0){var n=window.getSelection();range=createRange(e,{count:t}),range&&(range.collapse(!1),n.removeAllRanges(),n.addRange(range))}}
/*Caret functions end*/


/*
 * -> required | [...,...] -> example | {...} -> value type | || -> or 

  id:         Position of words for where they should be colored  [undefined,0,1,...] {int||string}
  color:      Color for words  [aqua,rgba(0,255,0,1),#ff25d0] {string}
  fontStyle:  Font style for words  [italic,oblique,normal] {string}
  decoration: Text decoration for words  [underlined,blink,dashes] {string}
* words:      Words that should be colored  {array}
*/
var keywords = [
   {
      color: "orange",
      words: [
         "SELECT",
         "FROM",
         "WHERE",
         "LIKE",
         "BETWEEN",
         "NOT",
         "FALSE",
         "NULL",
         "TRUE",
         "IN",
      ],
   },
   {
      id: 0,
      color: "red",
      fontStyle: "italic",
      decoration: "underline",
      words: ["TEST"],
   },
];

//defining node object as "editor"
var editor = document.getElementById("contenedor-consola");

//listening editor for keyup event
editor.addEventListener("keyup", function (e) {
   // if ctrl or alt or shift or backspace and keyname's length is not 1, don't check
   if( e.ctrlKey || e.altKey || ( e.key.length - 1 && e.key != "Backspace" ) || ( e.shiftKey && e.char ) ) return;
   console.log("Esta ");

   //getting caret position for applying it in the end, because after checking and coloring done; it's gonna be at the beginning.
   pos = getCurrentCaretPosition(this);

   
   text = this.innerText; //getting input's just text value
   words = text.split(/\s/gm); //splitting it from all whitespace characters

   for (var i = 0; i < keywords.length; i++)
      for (var n = 0; n < words.length; n++) {
         //looks for is word in our "keywords"' object and check's position if it's id entered
         if (keywords[i].words.indexOf(words[n].toUpperCase().trim()) > -1 && (keywords[i].id >= 0 ? keywords[i].id == n : true) )
            //applys options to word
            words[n] = `<span style="color:${ keywords[i].color ?? "white" };font-style:${ keywords[i].fontStyle ?? "normal" };text-decoration:${ keywords[i].decoration ?? "normal" }">${words[n]}</span>`;
      }

   //joining array elements with whitespace caracter and apply it to input
   this.innerHTML = words.join("&nbsp;");
   //restoring caret position
   setCurrentCaretPosition(this, pos);
});