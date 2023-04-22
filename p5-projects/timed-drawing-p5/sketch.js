// https://github.com/jht9629-nyu/my-p5js-repo.git
// timed-drawing

let a_lapse = 5; // seconds to re-draw points
let a_xoffset = 300;
let a_playback_colors = ['red', 'green', 'yellow'];
let a_draw_color = 'white';
let a_strokeWeight = 30;
let a_strokeWeightDiff = 4;
let a_run = 1;

let a_timedDrawing = 0;
let a_startTime;

let a_drawings = [];
let a_drawing_index = 0;
let a_points = null;
let a_npoints = 0;

function setup() {
  createCanvas(600, 400);
  noFill();

  let msg = [
    'drag mouse on left side of canvas to create line drawing',
    'press startTimedDraw to re-draw on right in ' + a_lapse + ' seconds',
  ];
  createDiv(msg.join('<br/>'));

  createButton('startTimedDraw').mousePressed(startTimedDraw);
  createButton('stopTimedDraw').mousePressed(stopTimedDraw);
  createButton('clearDrawing').mousePressed(clearDrawing);
  createButton('toggleRun').mousePressed(toggleRun);
  createElement('br');

  // createSlider(min, max, oldVal, step)
  let lapse_slider = createSlider(0, 60, a_lapse).input(function () {
    a_lapse = this.value();
    // console.log('create_slider aVal ', aVal, 'type', typeof aVal);
    valSpan.html(formatNumber(a_lapse) + '');
    startTimedDraw();
  });
  lapse_slider.style('width:50%');
  let valSpan = createSpan(a_lapse + '');
}

function draw() {
  if (!a_run) return;

  background(0);

  draw_points();

  if (a_timedDrawing) {
    draw_timed();
  }
}

function draw_points() {
  draw_to(-1, a_draw_color, 0);
}

function draw_timed() {
  let n = a_npoints;
  let now = secsTime() - a_startTime;
  let progress = now / a_lapse;

  let stopIndex = int(n * progress);

  let icolor = int(stopIndex / n) % a_playback_colors.length;
  // console.log(frameCount, 'draw_timed stopIndex', stopIndex, 'icolor', icolor);

  // let color = a_playback_colors[0];
  // draw_to(stopIndex, color, a_xoffset);
  let color = -1;
  draw_to(stopIndex, color, a_xoffset);
}

// let a_playback_colors = ['red', 'green', 'yellow'];

function draw_to(startStopIndex, color, xoffset) {
  stroke(color);
  strokeWeight(a_strokeWeight);
  let npoints = a_npoints;
  let ncolor = a_playback_colors.length;
  let full = startStopIndex > 0;
  let stopIndex = full ? startStopIndex : npoints;
  stopIndex = stopIndex % (npoints * (ncolor + 3));
  let ipoint = 0;
  while (ipoint < stopIndex) {
    if (full) {
      let icycle = int(ipoint / npoints) % ncolor;
      let icolor = a_playback_colors[icycle];
      if (icolor != color) {
        stroke(icolor);
        let nw = a_strokeWeight - a_strokeWeightDiff * icycle;
        console.log(
          frameCount,
          'ipoint',
          ipoint,
          'stopIndex',
          stopIndex,
          'nw',
          nw,
          'icycle',
          icycle,
          'icolor',
          icolor,
          'color',
          color
        );
        strokeWeight(nw);
        color = icolor;
      }
    }
    let prior_ipoint = ipoint;
    for (let points of a_drawings) {
      for (let i = 1; i < points.length; i++) {
        ipoint++;
        if (ipoint > stopIndex) return;
        let prev = points[i - 1];
        let point = points[i];
        if (!point) {
          console.log('i', i, 'point', point);
        }
        lineFrom(point, prev, xoffset);
      }
    }
    // detect no change
    if (prior_ipoint == ipoint) {
      console.log('stopIndex_draw prior_ipoint', prior_ipoint);
      break;
    }
  }
}

function toggleRun() {
  a_run = !a_run;
}

function startTimedDraw() {
  console.log('startTimedDraw');
  a_timedDrawing = 1;
  a_startTime = secsTime();
  a_npoints = 0;
  for (let points of a_drawings) {
    a_npoints += points.length;
  }
  console.log('startTimedDraw a_npoints', a_npoints);
}

function stopTimedDraw() {
  console.log('stopTimedDraw');
  a_timedDrawing = 0;
}

function clearDrawing() {
  console.log('clearDrawing');
  a_drawings = [];
  a_points = [];
  a_timedDrawing = 0;
}

function mouseDragged() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }
  if (!a_points) {
    a_points = [];
    a_drawings.push(a_points);
  }
  a_points.push({ x: mouseX, y: mouseY });
  a_npoints++;
}

function mouseReleased() {
  console.log('mouseReleased');
  a_points = null;
  startTimedDraw();
}

function lineFrom(my, prev, xoffset) {
  line(prev.x + xoffset, prev.y, my.x + xoffset, my.y);
}

// return seconds since start of sketch
function secsTime() {
  return millis() / 1000;
}

function formatNumber(num) {
  let prec = 1000;
  return int(num * prec) / prec;
}

// startTimedDraw as slider changes
// added a_drawings
// generalize draw_to
// remove class Point, use object literal for point
// added funtion lineFrom

// project files created with p5.vscode "Create p5.js Project"
// https://editor.p5js.org/jht9629-nyu/sketches/-t2O5JfBr
// timed-drawing

// TRY: use storeItem / getItem to save drawing locally
// https://p5js.org/reference/#/p5/storeItem
// https://p5js.org/reference/#/p5/getItem

// Code! Programming with p5.js
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/beginners/p5js/7.3-array-of-objects.html
// https://youtu.be/fBqaA7zRO58
// https://editor.p5js.org/codingtrain/sketches/1y_xfueO
