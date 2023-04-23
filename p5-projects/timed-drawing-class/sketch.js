// https://github.com/jht9629-nyu/my-p5js-repo-2023/tree/main/p5-projects/timed-drawing-p5
// timed-drawing

let my = { width: 640, height: 480 };
// let my = { width: 640 / 2, height: 480 / 2 };

function my_init() {
  my.save_label = 'plea';
  my.lapse = 5; // seconds to re-draw points
  my.xoffset = my.width / 2;
  my.draw_specs = [
    { color: 'red', strokeWeight: 12 },
    { color: 'green', strokeWeight: 7 },
    { color: 'yellow', strokeWeight: 2 },
  ];
  my.draw_color = 'white';
  my.strokeWeight = 10;
  my.run = 1;
  // npoint_limit = 200; // limit number of points in drawing
  my.npoint_limit = 0; // no limit

  my.timedDrawing = 0;
  // my.startTime;

  my.drawings = [];
  my.drawing_index = 0;
  my.points = null;
  my.npoints = 0;
  // my.canvas;
  my.output = createGraphics(my.width, my.height);
  my.output.noFill();
}

function setup() {
  my_init();
  my.canvas = createCanvas(my.width, my.height);

  let msg = [
    'drag mouse on left side of canvas to create line drawing',
    'press startTimedDraw to re-draw on right in ' + my.lapse + ' seconds',
  ];
  createDiv(msg.join('<br/>'));

  let runCheckBox = createCheckbox('Run ', my.run).changed(function () {
    my.run = this.checked();
  });
  runCheckBox.style('display:inline;');

  createButton('startTimedDraw').mousePressed(startTimedDraw);
  createButton('stopTimedDraw').mousePressed(stopTimedDraw);
  createButton('clearDrawing').mousePressed(clearDrawing);

  createElement('br');

  // createSlider(min, max, oldVal, step)
  let lapse_slider = createSlider(0, 30, my.lapse).input(function () {
    my.lapse = this.value();
    // console.log('create_slider aVal ', aVal, 'type', typeof aVal);
    valSpan.html(formatNumber(my.lapse) + '');
    startTimedDraw();
  });
  lapse_slider.style('width:50%');
  let valSpan = createSpan(my.lapse + '');

  createElement('br');
  createSpan('save_label: ');

  createInput(my.save_label).input(function () {
    my.save_label = this.value();
    // save_drawing(); // too many saves
  });
  my.canvas.mouseReleased(canvas_mouseReleased);
  createButton('save').mousePressed(save_drawing);
  createButton('load').mousePressed(restore_drawing);

  restore_drawing();
}

function draw() {
  background(0);

  prepareOutput();

  image(my.output, 0, 0);
}

function prepareOutput() {
  if (!my.run) return;

  draw_points();

  if (my.timedDrawing) {
    draw_timed();
  }
}

function draw_points() {
  let args = {
    color: my.draw_color,
    strokeWeight: my.strokeWeight,
    stopIndex: my.npoints,
    xoffset: 0,
  };
  draw_to(args);
}

// let my.playback_colors = ['red', 'green', 'yellow'];

function draw_timed() {
  let ncolors = my.draw_specs.length;
  let npoints = my.npoints;
  let now = secsTime() - my.startTime;
  // let progress = now / my.lapse; // take lapse seconds per single drawing
  let progress = now / (my.lapse / ncolors); // take lapse seconds n drawings
  let stopIndex = int(npoints * progress) % (npoints * ncolors);
  let spec = my.draw_specs[0];
  let args = {
    color: spec.color,
    strokeWeight: spec.strokeWeight,
    stopIndex: stopIndex,
    xoffset: my.xoffset,
    stepper: stepper,
    icycle: 0,
  };
  function stepper(ipoint) {
    if (ipoint % npoints == 0) {
      let icycle = args.icycle;
      let spec = my.draw_specs[icycle];
      // let str = formatNumber(progress);
      // str = str + ' ipoint ' + ipoint + ' stopIndex ' + stopIndex + ' strokeWeight ' + istrokeWeight;
      // str += ' icycle ' + icycle + ' icolor ' + icolor;
      // console.log(str);
      my.output.stroke(spec.color);
      my.output.strokeWeight(spec.strokeWeight);
      args.icycle = (args.icycle + 1) % ncolors;
    }
  }
  draw_to(args);
}

function draw_to(args) {
  my.output.stroke(args.color);
  my.output.strokeWeight(args.strokeWeight);
  let stepper = args.stepper;
  let stopIndex = args.stopIndex;
  let xoffset = args.xoffset;
  let ipoint = 0;
  while (ipoint < stopIndex) {
    // Draw all points up until stopIndex
    for (let points of my.drawings) {
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

function startTimedDraw() {
  console.log('startTimedDraw');
  my.timedDrawing = 1;
  my.startTime = secsTime();
  calc_npoints();
  console.log('startTimedDraw my.npoints', my.npoints);
}

function calc_npoints() {
  my.npoints = 0;
  for (let points of my.drawings) {
    my.npoints += points.length;
  }
}

function stopTimedDraw() {
  console.log('stopTimedDraw');
  my.timedDrawing = 0;
}

function clearDrawing() {
  console.log('clearDrawing');
  my.drawings = [];
  my.points = null;
  my.npoints = 0;
  my.timedDrawing = 0;

  my.output.clear();

  save_drawing();
}

function mouseDragged() {
  console.log('mouseDragged');
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }
  if (my.npoint_limit && my.npoints >= my.npoint_limit) {
    console.log('mouseDragged my.npoint_limit', my.npoint_limit, 'my.npoints', my.npoints);
    return;
  }
  if (!my.points) {
    my.points = [];
    my.drawings.push(my.points);
  }
  my.points.push({ x: mouseX, y: mouseY });
  my.npoints++;
}

function canvas_mouseReleased() {
  console.log('canvas_mouseReleased');
  my.points = null;
  startTimedDraw();
  save_drawing();
}

function lineFrom(point, prev, xoffset) {
  my.output.line(prev.x + xoffset, prev.y, point.x + xoffset, point.y);
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
  let str = localStorage.getItem(my.save_label);
  if (!str) return;
  console.log('restore_drawing str.length', str.length);
  // my.drawings = JSON.parse(str);
  let store = JSON.parse(str);
  my.drawings = store.drawings;
  calc_npoints();
  console.log('restore_drawing my.npoints', my.npoints);
}

function save_drawing() {
  // let str = JSON.stringify(my.drawings);
  let store = {
    label: my.save_drawing,
    width: my.width,
    height: my.height,
    drawings: my.drawings,
  };
  let str = JSON.stringify(store);
  localStorage.setItem(my.save_label, str);
  console.log('save_drawing str.length', str.length);
}

// localStorage.clear()

// https://www.buildingh.org

// https://editor.p5js.org/jht9629-nyu/sketches/MbS5C3j-F
// Necessary-forgery-timed-drawing

// convert to my.
// startTimedDraw as slider changes
// added a_drawings
// generalize draw_to
// remove class Point, use object literal for point
// added funtion lineFrom

// project files created with p5.vscode "Create p5.js Project"
// https://editor.p5js.org/jht9629-nyu/sketches/-t2O5JfBr
// timed-drawing
// !!@ p5.js/0.10.2

// TRY: use storeItem / getItem to save drawing locally
// https://p5js.org/reference/#/p5/storeItem
// https://p5js.org/reference/#/p5/getItem

// Code! Programming with p5.js
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/beginners/p5js/7.3-array-of-objects.html
// https://youtu.be/fBqaA7zRO58
// https://editor.p5js.org/codingtrain/sketches/1y_xfueO
