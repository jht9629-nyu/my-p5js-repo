// https://github.com/jht9629-nyu/my-p5js-repo-2023/tree/main/p5-projects/timed-drawing-class
// timed-drawing

let my = { width: 640, height: 480 };
// let my = { width: 640 / 2, height: 480 / 2 };
let drawPoints;

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
}

function setup() {
  my_init();

  my.canvas = createCanvas(my.width, my.height);

  drawPoints = new DrawPoints(my);

  ui_init();

  drawPoints.restore_drawing();
}

function draw() {
  background(0);

  drawPoints.prepareOutput();

  image(drawPoints.output, 0, 0);
}

function ui_init() {
  let msg = [
    'drag mouse on left side of canvas to create line drawing',
    'press startTimedDraw to re-draw on right in ' + drawPoints.lapse + ' seconds',
  ];
  createDiv(msg.join('<br/>'));

  let runCheckBox = createCheckbox('Run ', drawPoints.run).changed(function () {
    drawPoints.run = this.checked();
  });
  runCheckBox.style('display:inline;');

  createButton('startTimedDraw').mousePressed(function () {
    drawPoints.startTimedDraw();
  });
  createButton('stopTimedDraw').mousePressed(function () {
    drawPoints.stopTimedDraw();
  });
  createButton('clearDrawing').mousePressed(function () {
    drawPoints.clearDrawing();
  });

  createElement('br');

  // createSlider(min, max, oldVal, step)
  let lapse_slider = createSlider(0, 30, drawPoints.lapse).input(function () {
    drawPoints.lapse = this.value();
    // console.log('create_slider aVal ', aVal, 'type', typeof aVal);
    valSpan.html(formatNumber(drawPoints.lapse) + '');
    drawPoints.startTimedDraw();
  });
  lapse_slider.style('width:50%');
  let valSpan = createSpan(drawPoints.lapse + '');

  createElement('br');
  createSpan('save_label: ');

  createInput(drawPoints.save_label).input(function () {
    drawPoints.save_label = this.value();
    // save_drawing(); // too many saves
  });

  createButton('restore').mousePressed(function () {
    drawPoints.restore_drawing();
  });
  createButton('save').mousePressed(function () {
    drawPoints.save_drawing();
  });

  my.canvas.mouseReleased(canvas_mouseReleased);
}

function mouseDragged() {
  // console.log('mouseDragged');
  drawPoints.mouseDragged();
}

function canvas_mouseReleased() {
  console.log('canvas_mouseReleased');
  drawPoints.mouseReleased();
}

// return seconds since start of sketch
function secsTime() {
  return millis() / 1000;
}

function formatNumber(num) {
  let prec = 1000;
  return int(num * prec) / prec;
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
