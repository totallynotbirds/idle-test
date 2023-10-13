var score = 0; 
var title = new Title('eternity');
let button = new Button('gather time');
var scr = new Text(score);    

function btnPress() {
  score++;
  scr.edit(score);
}
