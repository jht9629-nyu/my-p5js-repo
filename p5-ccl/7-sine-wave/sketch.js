// https://editor.p5js.org/jht9629-nyu/sketches/-5qcnnr2L
// sine Amusing lettuce

let xspacing = 16; // Distance between each horizontal location
let w; // Width of entire wave
let theta = 0.0; // Start angle at 0
let amplitude = 75.0; // Height of wave
let period = 500.0; // How many pixels before the wave repeats
let da; // Value for incrementing x
let yvalues; // Using an array to store height values for the wave
let numa;

function setup() {
  createCanvas(710, 400);
  w = width + 16;
  da = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w / xspacing));
  numa = floor(w / xspacing);
}

function draw() {
  background(0);
  draw_sine_wave();
  // calcWave();
  // renderWave();
}

function draw_sine_wave() {
  theta += 0.02;
  let a = theta;
  for (let i = 0; i < numa; i++) {
    let val = sin(a) * amplitude;

    ellipse(i * xspacing, height / 2 + val, 16, 16);

    a += da;
  }
}

function calcWave() {
  // Increment theta (try different values for
  // 'angular velocity' here)
  theta += 0.02;
  // For every x value, calculate a y value with sine function
  let a = theta;
  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(a) * amplitude;
    a += da;
  }
}

function renderWave() {
  noStroke();
  fill(255);
  // A simple way to draw the wave with an ellipse at each location
  for (let x = 0; x < yvalues.length; x++) {
    ellipse(x * xspacing, height / 2 + yvalues[x], 16, 16);
  }
}

// https://p5js.org/examples/math-sine-wave.html
