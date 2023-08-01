// https://editor.p5js.org/jht9629-nyu/sketches/-5qcnnr2L
// sine Amusing lettuce

let xspacing = 16; // Distance between each horizontal location
let w; // Width of entire wave
let theta = 0.0; // Start angle at 0
let amplitude = 75.0; // Height of wave
let period = 500.0; // How many pixels before the wave repeats
let da; // Value for incrementing x
let numa;

function setup() {
  createCanvas(710, 400);
  w = width + 16;
  da = (TWO_PI / period) * xspacing;
  numa = floor(w / xspacing);
}

function draw() {
  background(0);
  draw_sine_wave();
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

// https://p5js.org/examples/math-sine-wave.html
