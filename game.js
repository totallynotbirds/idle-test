var score = 1; // Create a variable to store the score in

var title = new Title('eternity');
//hidden.hide();
var scr = new Text(score);    

function btnPress() {
  score++;
  scr.edit(score);
}
