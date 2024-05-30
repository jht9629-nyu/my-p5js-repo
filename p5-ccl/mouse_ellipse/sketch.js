// https://editor.p5js.org/jht9629-gmail/sketches/1qrEj3-wr
// mouse ellipse

function setup() {
  createCanvas(windowWidth, windowHeight - 50);
  // createA('../rect','next')
}

function draw() {
  background(220, 5);
  noStroke();
  fill(mouseX, 0, mouseY);
  ellipse(width / 2, height / 2, mouseX, mouseY);
}
