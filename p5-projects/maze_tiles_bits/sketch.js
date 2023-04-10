// https://editor.p5js.org/jht9629-gmail/sketches/IagYeywkY
// maze tiles bits

let a_len = 40;
let a_strokeWeight = 0.3;

let a_now = [];
let a_next = [];
let a_random = [];
let a_target;

let draw_step;
let maze_step_period = 1.0;
let maze_pause_period = 1.0; // 0.5;
let do_random = 1;
let do_report = 20;
let report_lines = [];

let a_timer;

let a_div;

function setup() {
  createCanvas(320, 320);
  noFill();
  strokeWeight(a_len * a_strokeWeight);

  fill_zero(a_now);
  fill_zero(a_next);
  fill_zero(a_random);

  fill_incr(a_next);

  a_target = a_next;

  a_timer = new SecondsTimer();
  a_timer.setPeriod(maze_step_period);
  draw_step = draw_maze_step;

  a_div = createP();
  div_report(a_target, 'setup');
}

function draw() {
  draw_step();
}

function draw_maze() {
  background(220);
  let tangle = HALF_PI * a_timer.progress();
  let half = a_len / 2;
  let index = 0;
  for (let y = 0; y < height; y += a_len) {
    for (let x = 0; x < width; x += a_len) {
      let now = a_now[index];
      let target = a_target[index];
      let angle = now == target ? 0 : tangle;
      if (now) {
        drawLeft(x, y, a_len, half, angle);
      } else {
        drawRight(x, y, a_len, half, angle);
      }
      index++;
    }
  }
}

function div_report(arr, msg) {
  // console.log('div_report', msg);
  if (!do_report) return;
  let narr = arr.concat();
  narr.reverse();
  let str = narr.join('');
  let bnum = BigInt('0b' + str);
  // str = bnum.toLocaleString('en-US') + ' ' + msg + '<br/> ';
  str = bnum.toLocaleString('en-US') + '<br/> ';
  report_lines.unshift(str);
  while (report_lines.length > do_report) {
    report_lines.pop();
  }
  a_div.elt.innerHTML = report_lines.join('');
}

function draw_maze_step() {
  draw_maze();

  if (a_timer.arrived()) {
    fill_incr(a_now);
    fill_incr(a_next);

    if (!do_random) {
      div_report(a_target, 'draw_maze_step');
    }

    a_timer.setPeriod(maze_pause_period);

    draw_step = draw_maze_pause;
  }
}

function draw_maze_pause() {
  if (a_timer.arrived()) {
    a_timer.setPeriod(maze_step_period);

    draw_step = do_random ? draw_maze_random : draw_maze_step;
  }
}

function draw_maze_random() {
  fill_random(a_random);
  a_target = a_random;

  div_report(a_target, 'draw_maze_random');

  a_timer.setPeriod(maze_step_period);

  draw_step = draw_maze_random_step;
}

function draw_maze_random_step() {
  draw_maze();

  if (a_timer.arrived()) {
    let now_save = a_now;
    a_now = a_target;
    a_target = now_save;

    // div_report(a_target, 'draw_maze_random_step');

    a_timer.setPeriod(maze_pause_period);

    draw_step = draw_maze_random_pause;
  }
}

function draw_maze_random_pause() {
  if (a_timer.arrived()) {
    a_timer.setPeriod(maze_step_period);

    draw_step = draw_maze_random_pause_step;
  }
}

function draw_maze_random_pause_step() {
  draw_maze();

  if (a_timer.arrived()) {
    a_now = a_target;
    a_target = a_next;

    div_report(a_target, 'draw_maze_random_pause_step');

    a_timer.setPeriod(maze_pause_period);

    draw_step = draw_maze_random_pause2;
  }
}

function draw_maze_random_pause2() {
  if (a_timer.arrived()) {
    a_timer.setPeriod(maze_step_period);

    draw_step = draw_maze_step;
  }
}

function fill_zero(arr) {
  // Fill array a_arr with random true/false values
  let index = 0;
  for (let y = 0; y < height; y += a_len) {
    for (let x = 0; x < width; x += a_len) {
      arr[index] = 0;
      index++;
    }
  }
}

function fill_incr(arr) {
  for (let index = 0; index < arr.length; index++) {
    let bit = arr[index] + 1;
    // bit is 1 or 2
    if (bit == 1) {
      arr[index] = 1;
      break;
    }
    // zero and continue to carry the 2
    arr[index] = 0;
  }
}

function fill_random(arr) {
  for (let index = 0; index < arr.length; index++) {
    let bit = random([0, 1]);
    arr[index] = bit;
  }
}

function fill_copy_to_from(to, from) {
  for (let index = 0; index < to.length; index++) {
    to[index] = from[index];
  }
}

function mousePressed() {
  console.log('mousePressed');
}

function drawLeft(x, y, len, half, angle) {
  push();
  translate(x + half, y + half);
  rotate(angle);
  line(-half + 0, -half + 0, -half + len, -half + len);
  pop();
}

function drawRight(x, y, len, half, angle) {
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
