// https://github.com/jht9629-nyu/my-p5js-repo.git
// timed-drawing

let a_lapse = 5; // seconds to re-draw points
let a_xoffset = 300;
let a_playback_colors = ['red', 'green', 'yellow'];
let a_draw_color = 'white';
let a_strokeWeight = 10;
let a_strokeWeightDiff = 3;
let a_run = 1;
let a_npoint_limit = 0;

let a_timedDrawing = 0;
let a_startTime;

let a_drawings = [];
let a_drawing_index = 0;
let a_points = null;
let a_npoints = 0;
let a_canvas;

function setup() {
  a_canvas = createCanvas(600, 400);
  noFill();

  let msg = [
    'drag mouse on left side of canvas to create line drawing',
    'press startTimedDraw to re-draw on right in ' + a_lapse + ' seconds',
  ];
  createDiv(msg.join('<br/>'));

  runCheckBox = createCheckbox('Run ', a_run).changed(function () {
    a_run = this.checked();
  });
  runCheckBox.style('display:inline;');

  createButton('startTimedDraw').mousePressed(startTimedDraw);
  createButton('stopTimedDraw').mousePressed(stopTimedDraw);
  createButton('clearDrawing').mousePressed(clearDrawing);

  createElement('br');

  // createSlider(min, max, oldVal, step)
  let lapse_slider = createSlider(0, 30, a_lapse).input(function () {
    a_lapse = this.value();
    // console.log('create_slider aVal ', aVal, 'type', typeof aVal);
    valSpan.html(formatNumber(a_lapse) + '');
    startTimedDraw();
  });
  lapse_slider.style('width:50%');
  let valSpan = createSpan(a_lapse + '');

  a_canvas.mouseReleased(canvas_mouseReleased);

  restore_drawing();
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
  let args = {
    color: a_draw_color,
    strokeWeight: a_strokeWeight,
    stopIndex: a_npoints,
    xoffset: 0,
  };
  draw_to(args);
}

// let a_playback_colors = ['red', 'green', 'yellow'];

function draw_timed() {
  let ncolors = a_playback_colors.length;
  let npoints = a_npoints;
  let now = secsTime() - a_startTime;
  let progress = now / a_lapse;
  // let stopIndex = int(npoints * progress) % (npoints * (ncolors + 1));
  let stopIndex = int(npoints * progress) % (npoints * ncolors);
  let args = {
    color: a_playback_colors[0],
    strokeWeight: a_strokeWeight,
    stopIndex: stopIndex,
    xoffset: a_xoffset,
    stepper: stepper,
    icycle: 0,
  };
  function stepper(ipoint) {
    if (ipoint % npoints == 0) {
      let icycle = args.icycle;
      let icolor = a_playback_colors[icycle];
      let istrokeWeight = a_strokeWeight - a_strokeWeightDiff * icycle;
      // let str = formatNumber(progress);
      // str = str + ' ipoint ' + ipoint + ' stopIndex ' + stopIndex + ' strokeWeight ' + istrokeWeight;
      // str += ' icycle ' + icycle + ' icolor ' + icolor;
      // console.log(str);
      stroke(icolor);
      strokeWeight(istrokeWeight);
      args.icycle = (args.icycle + 1) % ncolors;
    }
  }
  draw_to(args);
}

function draw_to(args) {
  stroke(args.color);
  strokeWeight(args.strokeWeight);
  let stepper = args.stepper;
  let stopIndex = args.stopIndex;
  let xoffset = args.xoffset;
  let ipoint = 0;
  while (ipoint < stopIndex) {
    // Draw all points up until stopIndex
    for (let points of a_drawings) {
      for (let i = 1; i < points.length; i++) {
        if (ipoint > stopIndex) return;
        if (stepper) stepper(ipoint);
        let prev = points[i - 1];
        let point = points[i];
        lineFrom(point, prev, xoffset);
        ipoint++;
      }
    }
    // detect no change
    if (!ipoint) {
      console.log('stopIndex_draw No change ipoint', ipoint);
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
  calc_npoints();
  console.log('startTimedDraw a_npoints', a_npoints);
}

function calc_npoints() {
  a_npoints = 0;
  for (let points of a_drawings) {
    a_npoints += points.length;
  }
}

function stopTimedDraw() {
  console.log('stopTimedDraw');
  a_timedDrawing = 0;
}

function clearDrawing() {
  console.log('clearDrawing');
  a_drawings = [];
  a_points = null;
  a_npoints = 0;
  a_timedDrawing = 0;
}

function mouseDragged() {
  console.log('mouseDragged');
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }
  if (a_npoint_limit && a_npoints >= a_npoint_limit) {
    console.log('mouseDragged a_npoint_limit', a_npoint_limit, 'a_npoints', a_npoints);
    return;
  }
  if (!a_points) {
    a_points = [];
    a_drawings.push(a_points);
  }
  a_points.push({ x: mouseX, y: mouseY });
  a_npoints++;
}

function canvas_mouseReleased() {
  console.log('mouseReleased');
  a_points = null;
  startTimedDraw();
  save_drawings();
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

function restore_drawing() {
  let str = localStorage.getItem('a_drawings');
  if (!str) return;
  console.log('restore_drawing str.length', str.length);
  a_drawings = JSON.parse(str);
  calc_npoints();
  console.log('restore_drawing a_npoints', a_npoints);
}

function save_drawings() {
  let str = JSON.stringify(a_drawings);
  localStorage.setItem('a_drawings', str);
  console.log('save_drawings str.length', str.length);
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
