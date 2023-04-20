// project files created with p5.vscode "Create p5.js Project"
// https://editor.p5js.org/jht9629-nyu/sketches/-t2O5JfBr
// timed-drawing

let a_points = [];
let a_index = 0;
let a_startTime;
let a_lapse = 10; // seconds to re-draw points
let a_xoffset = 300;
let a_timedDrawing = 0;
let lapse_slider;

function setup() {
  createCanvas(600, 400);
  strokeWeight(4);
  noFill();

  let msg = [
    'drag mouse on left side of canvas to create line drawing',
    'press startTimedDraw to re-draw on right in ' + a_lapse + ' seconds',
  ];
  createDiv(msg.join('<br/>'));

  createButton('startTimedDrawing').mousePressed(startTimedDrawing);
  createButton('stopTimedDrawing').mousePressed(stopTimedDrawing);
  createButton('clearDrawing').mousePressed(clearDrawing);
  createElement('br');
  // ider(min, max, oldVal, step)
  lapse_slider = createSlider(0, 60 * 5, a_lapse).input(function () {
    a_lapse = this.value();
    // console.log('create_slider aVal ', aVal, 'type', typeof aVal);
    valSpan.elt.innerHTML = formatNumber(a_lapse) + '';
  });
  // lapse_slider.style('width:300px');
  lapse_slider.style('width:50%');
  let valSpan = createSpan('');
}

function draw() {
  background(0);

  draw_points();

  if (a_timedDrawing) {
    draw_timed();
  }
}

function formatNumber(num) {
  let prec = 1000;
  return int(num * prec) / prec;
}

function startTimedDrawing() {
  console.log('startTimedDrawing');
  a_timedDrawing = 1;
  a_startTime = secsTime();
}

function stopTimedDrawing() {
  console.log('stopTimedDrawing');
  a_timedDrawing = 0;
}

function clearDrawing() {
  console.log('clearDrawing');
  a_points = [];
  a_timedDrawing = 0;
}

function mouseDragged() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }
  // let r = random(10, 50);
  let r = 5;
  let b = new Point(mouseX, mouseY, r);
  a_points.push(b);
}

function draw_timed() {
  let n = a_points.length;
  let now = secsTime() - a_startTime;
  let progress = now / a_lapse;
  let stopIndex = int(n * progress);
  if (stopIndex > n) stopIndex = n;

  draw_to(stopIndex);

  if (now > a_lapse) {
    // a_timedDrawing = 0
  }
}

function draw_to(stopIndex) {
  // console.log('stopIndex_draw stopIndex', stopIndex)
  stroke('yellow');

  for (let i = 1; i < stopIndex; i++) {
    let previous = a_points[i - 1];
    let point = a_points[i];
    if (!point) {
      console.log('i', i, 'point', point);
    }
    point.lineFrom(previous, a_xoffset);
  }
}

function draw_points() {
  stroke(255);

  for (let i = 1; i < a_points.length; i++) {
    // a_points[i].move();
    // a_points[i].show();
    let previous = a_points[i - 1];
    let point = a_points[i];
    // console.log('bub', bub)
    point.lineFrom(previous, 0);
  }
}

class Point {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  lineFrom(previous, xoffset) {
    line(previous.x + xoffset, previous.y, this.x + xoffset, this.y);
  }

  move() {
    this.x = this.x + random(-5, 5);
    this.y = this.y + random(-5, 5);
  }

  show() {
    // stroke(255);
    // strokeWeight(4);
    // noFill();
    ellipse(this.x, this.y, this.r * 2);
  }
}

// return seconds since start of sketch
function secsTime() {
  return millis() / 1000;
}

// TRY: use storeItem / getItem to save drawing locally
// https://p5js.org/reference/#/p5/storeItem
// https://p5js.org/reference/#/p5/getItem

// Code! Programming with p5.js
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/beginners/p5js/7.3-array-of-objects.html
// https://youtu.be/fBqaA7zRO58
// https://editor.p5js.org/codingtrain/sketches/1y_xfueO
