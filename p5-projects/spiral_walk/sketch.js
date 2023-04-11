// https://editor.p5js.org/jht9629-gmail/sketches/zaAsh0DZt
// spiral walk - create a spiral from the center of the canvas

// state consolidated to ease tranition to Class object / Function
let my = { width: 600, height: 400, d: 10 };

function setup() {
  createCanvas(my.width, my.height);

  // start with single pixel box in the center of the canvas
  // Left Top Right Bottom
  my.L = int(my.width / 2);
  my.T = int(my.height / 2);
  my.R = my.L;
  my.B = my.T;
  my.px = my.L;
  my.py = my.T;

  let nw = int(my.width / my.d);
  let nh = int(my.height / my.d);
  let n = nw * nh;
  console.log('nw', nw, 'mh', nh, 'n', n);

  grow_box();
  // grow_box();

  background(220);

  my.pts = [];
  let d = my.d;
  let more = 1;

  while (more) {
    // move up out of box
    my.nx = my.px;
    my.ny = my.py - d;
    my_line({ dx: 0, dy: 0 });

    // move right
    my.nx = my.px + d;
    while (my.nx < my.R) {
      my_line({ dx: d, dy: 0 });
    }
    my.nx -= d;

    // move down
    my.ny += d;
    while (my.ny < my.B) {
      my_line({ dx: 0, dy: d });
    }
    my.ny -= d;

    // move left
    my.nx = my.px - d;
    while (my.nx > my.L) {
      my_line({ dx: -d, dy: 0 });
    }
    my.nx += d;

    // move up
    my.ny -= d;
    while (my.ny > my.T) {
      my_line({ dx: 0, dy: -d });
    }
    my.ny += d;

    grow_box();

    morex = my.px > 0 && my.px < my.width;
    morey = my.py > 0 && my.py < my.height;
    more = morex || morey;
    //     more = morex && morey;
  }
  // console.log(my.pts)
  console.log('my.pts.length', my.pts.length);
}

function my_line({ dx, dy }) {
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
