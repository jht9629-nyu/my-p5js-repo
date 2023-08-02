function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220,1);
  noStroke()
  fill(mouseX,0,mouseY)
  rect(width/2-mouseX/2,height/2-mouseY/2,mouseX, mouseY)
}