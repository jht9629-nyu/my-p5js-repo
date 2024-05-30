// https://editor.p5js.org/jht9629-gmail/sketches/zaAsh0DZt
// spiral walk - create a spiral from the center of the canvas

// state consolidated to ease tranition to Class object / Function
let n = 20;
let d = 40;
let my = { width: d * n, height: d * n, d: d };

function setup() {
  createCanvas(my.width, my.height);

  background(220);
  // noStroke();

  let points = new SpiralWalker(my).points();
  console.log('points.length', points.length);

  for (let index = 0; index < points.length; index++) {
    let pt = points[index];
    let [x, y] = pt;
    rect(x, y, my.d, my.d);
    text(index + '', x + my.d / 2, y + my.d / 2);
    if (index < 10) {
      console.log('index', index, 'x', x, 'y', y);
    }
  }
}

function draw_line_rect() {
  let [px, py] = points[0];
  console.log('index 0', px, py);
  let m = 10;
  for (let index = 1; index < points.length; index++) {
    let pt = points[index];
    let [nx, ny] = pt;

    stroke('green');
    strokeWeight(2);
    // rect(px + m, py + m, my.d - m, my.d - m);

    stroke(0);
    strokeWeight(16);
    line(nx, ny, px, py);

    console.log('index', index, nx, ny, px, py);
    // line(px, py, nx, ny);
    px = nx;
    py = ny;
  }
}
