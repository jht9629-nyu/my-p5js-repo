// https://editor.p5js.org/jht9629-nyu/sketches/miVmKSy3t
// if, boolean - match

let s1 = 0;
let s2 = 0;
let s3 = 0;
let match = 0;

function setup() {
  createCanvas(600, 390);
  s1 = random([0, 1, 2]);
  s2 = random([0, 1, 2]);
  s3 = random([0, 1, 2]);
}

function draw() {
  background(200);
  textSize(100);
  text(s1, 100, 200);
  text(s2, 250, 200);
  text(s3, 400, 200);

  line(100, 0, 100, height);
  line(250, 0, 250, height);
  line(400, 0, 400, height);

  if (match) {
    text('Match!', 100, 300);
  }
}

function mouseClicked() {
  // text(s1, 10, 100);
  if (mouseX < 250) {
    s1 = (s1 + 1) % 3;
  }
  if (mouseX > 250 && mouseX < 400) {
    s2 = (s2 + 1) % 3;
  }
  if (mouseX > 400 && mouseX < 600) {
    s3 = (s3 + 1) % 3;
  }
  // if (s1 == s2 && s2 == s3) {
  //   match = 1;
  // } else {
  //   match = 0;
  // }
  match = s1 == s2 && s2 == s3;
}
