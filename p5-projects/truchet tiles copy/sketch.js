// https://editor.p5js.org/jht9629-nyu/sketches/lBrb1cBQ7
// truchet tiles copy

let cellSize = 40;

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  noLoop();
}

function draw() {
  background(220);
  for (i = 0; i < width; i += cellSize) {
    for (j = 0; j < height; j += cellSize) {
      listCell = random([drawCellA, drawCellB]);
      listCell(i, j);
    }
  }
}

function drawCellA(x, y) {
  push();
  noFill();
  translate(x, y);
  arc(0, 0, cellSize, cellSize, 0, 90);
  arc(cellSize, cellSize, cellSize, cellSize, 180, 270);
  pop();
}

function drawCellB(x, y) {
  push();
  noFill();
  translate(x, y);
  arc(cellSize, 0, cellSize, cellSize, 90, 180);
  arc(0, cellSize, cellSize, cellSize, 270, 360);
  pop();
}

// https://editor.p5js.org/ambikajo/sketches/cKu3Gn0Po
// truchet tiles by ambikajo
