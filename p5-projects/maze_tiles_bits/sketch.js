// https://editor.p5js.org/jht9629-gmail/sketches/IagYeywkY
// maze tiles bits
// state machine using function references - draw_step
// timing using SecondsTimer

let a_strokeWeight = 0.3;

let a_now = [];
let a_next = [];
let a_random = [];
let a_target;

let draw_step;
// var draw_step;

let maze_step_period = 1.0;
let maze_pause_period = 1.0; // 0.5;
let do_random = 1;
let do_report = 0; // 4
let report_lines = [];
let a_timer;
let a_div;
let a_delta = 1;

// let my = { width: 640, height: 480, d: 40 };
let my = { width: 400, height: 400, d: 40 };

function setup() {
  createCanvas(my.width, my.height);

  noFill();
  strokeWeight(my.d * a_strokeWeight);

  // let n = make_grid_pts();
  let n = make_spiral_pts();

  array_zero(a_now, n);
  array_zero(a_next, n);
  array_zero(a_random, n);

  array_add(a_next, a_delta);

  a_target = a_next;

  a_timer = new SecondsTimer();
  a_timer.setPeriod(maze_step_period);
  draw_step = draw_maze_step;

  report_1ofn();
  div_report(a_target, 'setup');

  // console.log('setup this', this);
}

function draw() {
  // console.log('draw this', this);
  draw_step();
}

function make_spiral_pts() {
  // let h = int(my.d / 2);
  // my.pts = new SpiralWalker(my).points().map((pt) => {
  //   return [pt[0] - h, pt[1] - h];
  // });
  my.pts = new SpiralWalker(my).points();
  return my.pts.length;
}

function make_grid_pts() {
  let pts = [];
  for (let y = 0; y < height; y += my.d) {
    for (let x = 0; x < width; x += my.d) {
      pts.push([x, y]);
    }
  }
  let n = pts.length;
  let nw = int(my.width / my.d);
  let nh = int(my.height / my.d);
  let half = int(n / 2);
  console.log('n', n, 'half', half);
  console.log('nw', nw, 'nh', nh);

  let offset = int(nw / 2) + int(nh / 2) * nw;
  let npts = [];
  for (let index = 0; index < n; index++) {
    npts.push(pts[(index + offset) % n]);
  }
  my.pts = npts;
  return n;
}

function draw_maze() {
  background(220);
  let tangle = HALF_PI * a_timer.progress();
  let half = my.d / 2;
  let index = 0;
  for (let index = 0; index < my.pts.length; index++) {
    let [x, y] = my.pts[index];
    let now = a_now[index];
    let target = a_target[index];
    let angle = now == target ? 0 : tangle;
    if (now) {
      drawLeft(x, y, my.d, half, angle);
    } else {
      drawRight(x, y, my.d, half, angle);
    }
  }
}

function report_1ofn() {
  if (!do_report) return;
  let bnum = 2n ** BigInt(a_now.length);
  let bstr = ' 0x' + bnum.toString(16).toUpperCase();
  let str = '1 of ' + bnum.toLocaleString('en-US') + bstr + '<br/> ';
  let div = createP('<code style="font-size:16px">' + str + '</code>');
  // div.style('margin-left:2px');
}

function div_report(arr, msg) {
  // console.log('div_report', msg);
  if (!do_report) return;
  if (!a_div) {
    a_div = createP();
  }
  let narr = arr.concat();
  narr.reverse();
  let str = narr.join('');
  let bnum = BigInt('0b' + str);
  // str = bnum.toLocaleString('en-US') + ' ' + msg + '<br/> ';
  let bstr;
  if (bnum >= 256n) {
    bstr = ' 0x' + bnum.toString(16).toUpperCase();
  } else {
    bstr = ' 0b' + bnum.toString(2);
  }
  // &nbsp;
  str = '' + bnum.toLocaleString('en-US') + bstr + '<br/> ';
  report_lines.unshift(str);
  while (report_lines.length > do_report) {
    report_lines.pop();
  }
  a_div.elt.innerHTML = '<code style="font-size:16px">' + report_lines.join('') + '</code>';
}

function draw_maze_step() {
  draw_maze();

  if (a_timer.arrived()) {
    array_add(a_now, a_delta);
    array_add(a_next, a_delta);

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
  array_random(a_random);
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

function array_zero(arr, n) {
  // Fill array a_arr with random true/false values
  for (let index = 0; index < n; index++) {
    arr[index] = 0;
  }
}

function array_add(arr, n) {
  if (n == 1) {
    array_incr(arr);
  } else if (n == -1) {
    array_decr(arr);
  } else {
    console.log('array_add bad n', n);
  }
}

function array_decr(arr) {
  let carry = 0;
  for (let index = 0; index < arr.length; index++) {
    let sum = arr[index] + 1 + carry;
    // sum = 1, 2, 3
    arr[index] = sum & 1;
    carry = sum >> 1;
    // carry = 0 or 1
  }
}

function array_incr(arr) {
  for (let index = 0; index < arr.length; index++) {
    let sum = arr[index] + 1;
    // sum is 1 or 2
    if (sum == 1) {
      arr[index] = 1;
      break;
    }
    // zero and continue to carry the 2
    arr[index] = 0;
  }
}

function array_random(arr) {
  for (let index = 0; index < arr.length; index++) {
    let bit = random([0, 1]);
    arr[index] = bit;
  }
}

function array_copy_to_from(to, from) {
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
