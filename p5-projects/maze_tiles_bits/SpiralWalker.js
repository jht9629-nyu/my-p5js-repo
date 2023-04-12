// create points for a spiral from the center

class SpiralWalker {
  //
  // { width: 600, height: 400, d: 10 }
  constructor(props) {
    Object.assign(this, props);
  }
  points() {
    // start with single pixel box in the center
    // Left Top Right Bottom
    this.L = int(this.width / 2);
    this.T = int(this.height / 2);
    this.R = this.L;
    this.B = this.T;

    let nw = int(this.width / this.d);
    let nh = int(this.height / this.d);
    let n = nw * nh;
    console.log('nw', nw, 'mh', nh, 'n', n);

    this.px = this.L;
    this.py = this.T;

    this.grow_box();

    this.pts = [];
    let d = this.d;
    // this.pts.push([this.px, this.py - d]);

    let more = 1;
    while (more) {
      // move up out of box
      this.nx = this.px;
      this.ny = this.py - d;
      this.my_line({ dx: 0, dy: 0 });

      // move right
      this.nx = this.px + d;
      while (this.nx < this.R) {
        this.my_line({ dx: d, dy: 0 });
      }
      this.nx -= d;

      // move down
      this.ny += d;
      while (this.ny < this.B) {
        this.my_line({ dx: 0, dy: d });
      }
      this.ny -= d;

      // move left
      this.nx = this.px - d;
      while (this.nx > this.L) {
        this.my_line({ dx: -d, dy: 0 });
      }
      this.nx += d;

      // move up
      this.ny -= d;
      while (this.ny > this.T) {
        this.my_line({ dx: 0, dy: -d });
      }
      this.ny += d;

      this.grow_box();

      let morex = this.px >= 0 && this.px < this.width;
      let morey = this.py >= 0 && this.py < this.height;
      more = morex || morey;
      // more = morex && morey;
    }
    // console.log(this.pts)
    console.log('this.pts.length', this.pts.length);

    return this.pts;
  }

  my_line({ dx, dy }) {
    this.pts.push([this.px, this.py]);
    // line(this.nx, this.ny, this.px, this.py);
    this.px = this.nx;
    this.py = this.ny;
    this.nx += dx;
    this.ny += dy;
  }

  grow_box() {
    this.L -= this.d;
    this.R += this.d;
    this.T -= this.d;
    this.B += this.d;
  }
}
