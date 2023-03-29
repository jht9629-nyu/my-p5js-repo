// https://editor.p5js.org/jht9629-nyu/sketches/1CpIVSqp_d
// truchet tiles tweeked

let a_len = 40;

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  noLoop();
  noFill();
  strokeWeight(4)
}

function draw() {
  background(220);
  for (x = 0; x < width; x += a_len) {
    for (y = 0; y < height; y += a_len) {
      // listCell = random([drawCellA, drawCellB]);
      // listCell(x, y);
      if (random() > 0.5) {
        drawLeft(x,y)
      }
      else {
        drawRight(x,y)
      }
    }
  }
}

function drawLeft(x, y) {
  // push();
  // noFill();
  // translate(x, y);
  arc(x+0, y+0, a_len, a_len, 0, 90);
  arc(x+a_len, y+a_len, a_len, a_len, 180, 270);
  // pop();
}

function drawRight(x, y) {
  // push();
  // noFill();
  // translate(x, y);
  arc(x+a_len, y+0, a_len, a_len, 90, 180);
  arc(x+0, y+a_len, a_len, a_len, 270, 360);
  // pop();
}

// https://editor.p5js.org/jht9629-nyu/sketches/lBrb1cBQ7
// truchet tiles copy

// https://editor.p5js.org/ambikajo/sketches/cKu3Gn0Po
// truchet tiles by ambikajo
