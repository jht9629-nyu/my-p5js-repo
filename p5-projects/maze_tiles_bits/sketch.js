// https://editor.p5js.org/jht9629-gmail/sketches/IagYeywkY
// maze tiles bits

let len = 40;
let a_angle = 0;
let a_now = [];
let a_next = [];
let a_angle_max;
let a_run_start;
let a_run_lapse = 1.0;

let a_pause_start;
let a_pause_lapse = 1.0;
let a_strokeWeight = 8;

function setup() {
  createCanvas(400, 400);
  a_angle_max = HALF_PI;
  a_run_start = secsTime();
  noFill();
  strokeWeight(a_strokeWeight);
  fill_zero(a_now);
  fill_zero(a_next);
  fill_incr(a_next);
}

function draw() {
  background(220);

  let lapse = secsTime() - a_run_start;
  a_angle = a_angle_max * (lapse / a_run_lapse);

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

  if (lapse >= a_run_lapse) {
    a_run_start = secsTime();
    fill_incr(a_now);
    fill_incr(a_next);
  }
}

export class SecsTimer {
  // SecsTimer(period)
  //    period = seconds between trigger
  //      = -1 to trigger
  //
  constructor(period) {
    this.period = period;
    this.restart();
  }

  // establish start time
  restart() {
    this.startSecs = this.secsTime();
  }

  // return seconds since restart
  lapse() {
    let nowSecs = this.secsTime();
    return nowSecs - this.startSecs;
  }

  check() {
    let nowSecs = this.secsTime();
    let lapse = nowSecs - this.startSecs;
    if (this.period >= 0 && lapse > this.period) {
      this.startSecs = nowSecs;
      return 1;
    }
    return 0;
  }

  // Relative time in seconds
  secsTime() {
    return millis() / 1000;
  }
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

// return true to advance cycle
// use a_angle to find seconds to pause in a_pause_dict
function check_cycle() {
  if (a_pause_start > 0) {
    let now = millis();
    if (now - a_pause_start > a_pause_lapse) {
      a_pause_start = 0;
      return true;
    } else {
      return false;
    }
  }
  let lapse = a_pause_dict[a_angle];
  if (lapse) {
    a_pause_start = millis();
    a_pause_lapse = lapse * 1000;

    if (a_angle % 90 == 0) {
      // console.log("a_angle", a_angle, "frameCount", frameCount);
      if (a_incr == 3) {
        // fill_now_next();
        // fill_next_random();
      }
    }
    console.log('a_angle', a_angle, 'a_incr', a_incr);
    console.log('a_now[0]', a_now[0], 'a_next[0]', a_next[0]);

    if (a_angle == 0) {
      a_incr = (a_incr + 1) % 2;
      // console.log('a_incr', a_incr, "frameCount", frameCount);
      if (a_incr == 0) {
        fill_next_incr();
      }
      // else if (a_incr == 2) {
      //   fill_now_next();
      //   fill_next_random();
      // }
      // else {
      //   fill_next_random();
      // }
    }

    return false;
  } else {
    return true;
  }
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
