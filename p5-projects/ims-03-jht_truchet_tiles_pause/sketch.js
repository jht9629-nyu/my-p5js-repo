//https://editor.p5js.org/jht9629-nyu/sketches/CYMdD77ySc
// jht truchet tiles pause copy

// https://editor.p5js.org/jht9629-gmail/sketches/LnPplI2CR
// truchet tiles pause

let len = 40;
let a_angle = 0;
let a_arr = [];
// {count: seconds,...}
let a_pause_dict = {0: 2.0, 90: 2.0, 180: 2.0, 270: 2.0}
let a_pause_start = -1;
let a_pause_lapse;

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  noFill();
  strokeWeight(4);
  // Fill array a_arr with random true/false values
  for (let x = 0; x < width; x += len) {
    for (let y = 0; y < height; y += len) {
      let odd = random() > 0.5
      a_arr.push(odd)
    }
  }
}

function draw() {
  let half = len / 2;
  background(220);
  let index = 0
  for (let x = 0; x < width; x += len) {
    for (let y = 0; y < height; y += len) {
      let odd = a_arr[index]
      if (odd) {
        drawLeft(x, y, half);
      } else {
        drawRight(x, y, half);
      }
      index++;
    }
  }
  if (check_cycle()) {
    a_angle = (a_angle + 1) % 360;
  }
}

// return true to advance cycle
// use a_angle to find seconds to pause in a_pause_dict
function check_cycle() {
  if (a_pause_start > 0) {
    let now = millis(); 
    if (now - a_pause_start > a_pause_lapse) {
      a_pause_start = 0;
      return true;
    }
    else {
      return false
    }
  }
  let lapse = a_pause_dict[a_angle];
  if (lapse) {
    a_pause_start = millis();
    a_pause_lapse = lapse * 1000;
    return false
  }
  else {  
    return true; 
  }
}

function drawLeft(x, y, half) {
  push();
  translate(x + half, y + half);
  rotate(a_angle);
  arc(-half + 0, -half + 0, len, len, 0, 90);
  arc(-half + len, -half + len, len, len, 180, 270);
  pop();
}

function drawRight(x, y, half) {
  push();
  noFill();
  translate(x + half, y + half);
  rotate(a_angle);
  arc(-half + len, -half + 0, len, len, 90, 180);
  arc(-half + 0, -half + len, len, len, 270, 360);
  pop();
}

// https://editor.p5js.org/jht9629-gmail/sketches/EfQDCJ5aR
// truchet tiles array

// https://editor.p5js.org/jht9629-nyu/sketches/5TSs5XB6o
// truchet tiles rotate

// https://editor.p5js.org/jht9629-nyu/sketches/1CpIVSqp_d
// truchet tiles re-factored

// https://editor.p5js.org/jht9629-nyu/sketches/lBrb1cBQ7
// truchet tiles copy

// https://editor.p5js.org/ambikajo/sketches/cKu3Gn0Po
// truchet tiles by ambikajo
