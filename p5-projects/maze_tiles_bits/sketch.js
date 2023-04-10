// https://editor.p5js.org/jht9629-gmail/sketches/IagYeywkY
// maze tiles bits

let len = 40;
let a_now = [];
let a_next = [];

let draw_step;
let maze_step_period = 1.0;

let a_timer;

let a_strokeWeight = 8;

function setup() {
  createCanvas(400, 400);
  noFill();
  strokeWeight(a_strokeWeight);

  fill_zero(a_now);
  fill_zero(a_next);
  fill_incr(a_next);

  a_timer = new SecondsTimer(maze_step_period);
  draw_step = draw_maze_step;
}

function draw() {
  draw_step();
}

function draw_maze_step() {
  background(220);

  let a_angle = HALF_PI * (a_timer.lapse() / a_timer.period);

  let half = len / 2;
  let index = 0;
  for (let y = 0; y < height; y += len) {
    for (let x = 0; x < width; x += len) {
      let now = a_now[index];
      let target = a_next[index];
      let angle = now == target ? 0 : a_angle;
      if (now) {
        drawLeft(x, y, half, angle);
      } else {
        drawRight(x, y, half, angle);
      }
      index++;
    }
  }

  if (a_timer.arrived()) {
    fill_incr(a_now);
    fill_incr(a_next);

    draw_step = draw_maze_pause;
  }
}

function draw_maze_pause() {
  if (a_timer.arrived()) {
    draw_step = draw_maze_step;
  }
}

function secsTime() {
  return millis() / 1000;
}

function fill_zero(arr) {
  // Fill array a_arr with random true/false values
  let index = 0;
  for (let y = 0; y < height; y += len) {
    for (let x = 0; x < width; x += len) {
      arr[index] = 0;
      index++;
    }
  }
}

function fill_incr(arr) {
  for (let index = 0; index < arr.length; index++) {
    let bit = arr[index] + 1;
    if (bit == 1) {
      arr[index] = 1;
      break;
    }
    arr[index] = 0;
  }
}

function fill_copy_to_from(to, from) {
  for (let index = 0; index < to.length; index++) {
    to[index] = from[index];
  }
}

function fill_random(arr) {
  for (let index = 0; index < arr.length; index++) {
    let bit = random([0, 1]);
    arr[index] = bit;
    index++;
  }
}

function mousePressed() {
  console.log('mousePressed');
}

function drawLeft(x, y, half, angle) {
  push();
  translate(x + half, y + half);
  rotate(angle);
  line(-half + 0, -half + 0, -half + len, -half + len);
  pop();
}

function drawRight(x, y, half, angle) {
  push();
  noFill();
  translate(x + half, y + half);
  rotate(angle);
  line(-half + len, -half + 0, -half + 0, -half + len);
  pop();
}

// https://editor.p5js.org/jht9629-gmail/sketches/abgeEnTyf
// maze tiles count

// https://editor.p5js.org/jht9629-gmail/sketches/i2hCaC36l
// maze tiles pause

// https://editor.p5js.org/jht9629-gmail/sketches/LnPplI2CR
// truchet tiles pause

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
