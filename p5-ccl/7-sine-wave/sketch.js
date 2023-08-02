// https://editor.p5js.org/jht9629-nyu/sketches/-5qcnnr2L
// sine Amusing lettuce

let sw = {};

function setup() {
  createCanvas(390, 600);
  init_sw();
}

function draw() {
  background(0);
  draw_sine_wave();
}

function init_sw() {
  sw.xspacing = 16; // Distance between each horizontal location
  sw.theta = 0.0; // Start angle at 0
  sw.amplitude = width / 2; // Height of wave
  sw.period = 500.0; // How many pixels before the wave repeats
  sw.da; // Value for incrementing x
  sw.numa;

  let w = height + 16;
  sw.da = (TWO_PI / sw.period) * sw.xspacing;
  sw.numa = floor(w / sw.xspacing);
}

function draw_sine_wave() {
  sw.theta += 0.02;
  sw.a = sw.theta;
  for (let i = 0; i < sw.numa; i++) {
    //
    let val = sin(sw.a) * sw.amplitude;

    let y = i * sw.xspacing;
    let x = width / 2 + val;

    ellipse(x, y, 16, 16);

    sw.a += sw.da;
  }
}

// https://p5js.org/examples/math-sine-wave.html
