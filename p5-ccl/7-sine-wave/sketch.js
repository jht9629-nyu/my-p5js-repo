// https://editor.p5js.org/jht9629-nyu/sketches/-5qcnnr2L
// sine Amusing lettuce

let sw = {};

function setup() {
  createCanvas(390, 600);
  init_sw();
}

function init_sw() {
  sw.xspacing = 16; // Distance between each horizontal location
  sw.w; // Width of entire wave
  sw.theta = 0.0; // Start angle at 0
  sw.amplitude = 75.0; // Height of wave
  sw.period = 500.0; // How many pixels before the wave repeats
  sw.da; // Value for incrementing x
  sw.numa;

  w = width + 16;
  sw.da = (TWO_PI / sw.period) * sw.xspacing;
  sw.numa = floor(w / sw.xspacing);
}

function draw() {
  background(0);
  draw_sine_wave();
}

function draw_sine_wave() {
  sw.theta += 0.02;
  let a = sw.theta;
  for (let i = 0; i < sw.numa; i++) {
    let val = sin(a) * sw.amplitude;

    let x = i * sw.xspacing;
    let y = height / 2 + val;

    ellipse(x, y, 16, 16);

    a += sw.da;
  }
}

// https://p5js.org/examples/math-sine-wave.html
