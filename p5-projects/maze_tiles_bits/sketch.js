// https://editor.p5js.org/jht9629-gmail/sketches/IagYeywkY
// maze tiles bits
// state machine using function references - my.draw_step
// timing using SecondsTimer

// let my = { width: 640, height: 480, d: 40 };
// let my = { width: 400, height: 400, d: 40 };
// let my = { width: 400, height: 800, d: 40 };
let my = { width: 0, height: 0, ncells: 9 };
let mazeSpin;

function setup() {
  my.width = my.width || windowWidth;
  my.height = my.height || windowHeight;
  createCanvas(my.width, my.height);

  my.strokeWeight = 0.5;
  my.delta = 1;
  my.step_period = 1.0;
  my.pause_period = 1.0; // 0.5;
  my.do_random = 1;
  my.do_report = 0; // 4

  mazeSpin = new MazeSpin(my);

  // console.log('setup this', this);
}

function draw() {
  // console.log('draw this', this);
  mazeSpin.prepareOutput();
  image(mazeSpin.output, 0, 0);
}

// https://editor.p5js.org/jht9629-gmail/sketches/abgeEnTyf
// maze tiles count

// https://editor.p5js.org/jht9629-gmail/sketches/i2hCaC36l
// maze tiles pause

// https://editor.p5js.org/jht9629-gmail/sketches/LnPplI2CR
// truchet tiles pause

// https://editor.p5js.org/jht9629-gmail/sketches/EfQDCJ5aR
// truchet tiles array

// https://editor.p5js.org/jht9629-nyu/sketches/5TSs5XB6o
// truchet tiles rotate

// https://editor.p5js.org/jht9629-nyu/sketches/1CpIVSqp_d
// truchet tiles re-factored

// https://editor.p5js.org/jht9629-nyu/sketches/lBrb1cBQ7
// truchet tiles copy

// https://editor.p5js.org/ambikajo/sketches/cKu3Gn0Po
// truchet tiles by ambikajo
