// https://editor.p5js.org/jht9629-gmail/sketches/zaAsh0DZt
// spiral walk

let my = {};

function setup() {
  createCanvas(400, 400);

  my.L = int(width / 2);
  my.T = int(height / 2);
  my.R = my.L;
  my.B = my.T;
  my.px = my.L;
  my.py = my.T;
  my.d = 10;

  grow_box();
  grow_box();

  background(220);

  my.pts = [];
  let more = 20;
  while (more) {
    // move up
    my.nx = my.px;
    my.ny = my.py - my.d;
    my_line(0, 0);
    // my.pts.push([my.px, my.py]);
    // line(my.nx, my.ny, my.px, my.py);
    // my.px = my.nx;
    // my.py = my.ny;

    // move right
    my.nx = my.px + my.d;
    while (my.nx < my.R) {
      my_line(my.d, 0);
      // line(my.nx, my.ny, my.px, my.py);
      // my.px = my.nx;
      // my.nx += my.d;
    }
    my.nx -= my.d;

    // move down
    my.ny += my.d;
    while (my.ny < my.B) {
      my_line(0, my.d);
      // line(my.nx, my.ny, my.px, my.py);
      // my.py = my.ny;
      // my.ny += my.d;
    }
    my.ny -= my.d;

    // move left
    my.nx = my.px - my.d;
    while (my.nx > my.L) {
      my_line(-my.d, 0);
      // line(my.nx, my.ny, my.px, my.py);
      // my.px = my.nx;
      // my.nx -= my.d;
    }

    my.nx += my.d;

    // move up
    my.ny -= my.d;
    while (my.ny > my.T) {
      my_line(0, -my.d);
      // line(my.nx, my.ny, my.px, my.py);
      // my.py = my.ny;
      // my.ny -= my.d;
    }
    my.ny += my.d;

    grow_box();

    more--;
  }
  // console.log(my.pts)
}

function my_line(dx, dy) {
  my.pts.push([my.px, my.py]);
  line(my.nx, my.ny, my.px, my.py);
  my.px = my.nx;
  my.py = my.ny;
  my.nx += dx;
  my.ny += dy;
}

function grow_box() {
  my.L -= my.d;
  my.R += my.d;
  my.T -= my.d;
  my.B += my.d;
}
