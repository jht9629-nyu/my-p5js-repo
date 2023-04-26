// Draw points store in array drawings
class DrawPoints {
  constructor(props) {
    console.log('DrawPoints props', props);
    Object.assign(this, props);

    this.drawings = [];
    this.drawing_index = 0;
    this.points = null;
    this.npoints = 0;
    this.output = createGraphics(this.width, this.height);
    this.output.noFill();
  }

  prepareOutput() {
    if (!this.run) {
      return;
    }
    if (this.staticDrawing) {
      this.draw_points();
    }
    if (this.timedDrawing) {
      this.draw_timed();
    }
  }

  draw_points() {
    let args = {
      color: this.draw_color,
      strokeWeight: this.strokeWeight,
      stopIndex: this.npoints,
      xoffset: 0,
    };
    this.draw_to(args);
  }

  draw_timed() {
    let ncolors = this.draw_specs.length;
    let npoints = this.npoints;
    let now = secsTime() - this.startTime;
    // let progress = now / this.lapse; // take lapse seconds per single drawing
    let progress = now / (this.lapse / ncolors); // take lapse seconds n drawings
    let stopIndex = int(npoints * progress) % (npoints * ncolors);
    let spec = this.draw_specs[0];
    let stepper = (ipoint) => {
      if (ipoint % npoints == 0) {
        let icycle = args.icycle;
        let spec = this.draw_specs[icycle];
        // let str = formatNumber(progress);
        // str = str + ' ipoint ' + ipoint + ' stopIndex ' + stopIndex + ' strokeWeight ' + istrokeWeight;
        // str += ' icycle ' + icycle + ' icolor ' + icolor;
        // console.log(str);
        this.output.stroke(spec.color);
        this.output.strokeWeight(spec.strokeWeight);
        args.icycle = (args.icycle + 1) % ncolors;
      }
    };
    let args = {
      color: spec.color,
      strokeWeight: spec.strokeWeight,
      stopIndex: stopIndex,
      xoffset: this.xoffset,
      stepper: stepper,
      icycle: 0,
    };
    this.draw_to(args);
  }

  draw_to(args) {
    this.output.stroke(args.color);
    this.output.strokeWeight(args.strokeWeight);
    let stepper = args.stepper;
    let stopIndex = args.stopIndex;
    let xoffset = args.xoffset;
    let ipoint = 0;
    while (ipoint < stopIndex) {
      // Draw all points up until stopIndex
      for (let points of this.drawings) {
        for (let i = 1; i < points.length; i++) {
          if (ipoint > stopIndex) return;
          if (stepper) stepper(ipoint);
          let prev = points[i - 1];
          let point = points[i];
          this.lineFrom(point, prev, xoffset);
          ipoint++;
        }
      }
      // detect no change
      if (!ipoint) {
        console.log('stopIndex_draw No change ipoint', ipoint);
        break;
      }
    }
  }

  lineFrom(point, prev, xoffset) {
    this.output.line(prev.x + xoffset, prev.y, point.x + xoffset, point.y);
  }

  startTimedDraw() {
    console.log('startTimedDraw');
    this.timedDrawing = 1;
    this.startTime = secsTime();
    this.calc_npoints();
    console.log('startTimedDraw this.npoints', this.npoints);
  }

  calc_npoints() {
    this.npoints = 0;
    for (let points of this.drawings) {
      this.npoints += points.length;
    }
  }

  stopTimedDraw() {
    console.log('stopTimedDraw');
    this.timedDrawing = 0;
  }

  clearDrawing() {
    console.log('clearDrawing');

    this.drawings = [];
    this.points = null;
    this.npoints = 0;
    this.timedDrawing = 0;

    this.output.clear();

    // this.save_drawing();
  }

  restore_drawing(nstore) {
    // console.log('restore_drawing nstore |' + nstore + '|');
    let str;
    if (nstore) {
      str = nstore;
    } else {
      str = localStorage.getItem(this.save_label);
    }
    if (!str) return;
    console.log('restore_drawing str.length', str.length);
    // this.drawings = JSON.parse(str);
    let store;
    try {
      store = JSON.parse(str);
    } catch (err) {
      console.log('restore_drawing parse err', err);
      return;
    }
    this.expand_drawings(store);
    this.drawings = store.drawings;
    this.calc_npoints();
    this.output.clear();
    console.log('restore_drawing this.npoints', this.npoints);

    if (nstore) {
      this.xoffset = 0;
      this.staticDrawing = 0;
      this.startTimedDraw();
    }
  }

  save_drawing(url) {
    let store = {
      version: 2,
      label: this.save_label,
      width: this.width,
      height: this.height,
      drawings: this.drawings,
    };

    this.shrink_drawings(store);

    let str = JSON.stringify(store);
    localStorage.setItem(this.save_label, str);
    console.log('save_drawing str.length', str.length);

    if (url) {
      let url = new URL(window.location.href);
      url.search = '?store=' + encodeURIComponent(str);
      console.log(url.href);
      window.location = url.href;
    }
    // Report full string size. Typically %50 more
    // let full = JSON.stringify(this.drawings);
    // console.log('save_drawing full.length', full.length);
  }

  // Transform drawings to delta array to save space
  // [{x: x0, y: y0}, {x: x1, y: y1}, {x: x2, y: y2} ...]
  //  --> [[x0, y0, [x1-x0, y1-y0], [x2-x0, y2-y0] ...]]
  shrink_drawings(store) {
    let x0;
    let y0;
    let d = store.drawings.map((arr) => {
      return arr.map((item, index) => {
        if (index == 0) {
          x0 = item.x;
          y0 = item.y;
          return [x0, y0];
        }
        return [item.x - x0, item.y - y0];
      });
    });
    store.drawings = d;
  }

  expand_drawings(store) {
    if (!store.version) return;
    let x0;
    let y0;
    let d = store.drawings.map((arr) => {
      return arr.map((item, index) => {
        if (index == 0) {
          x0 = item[0];
          y0 = item[1];
          return { x: x0, y: y0 };
        }
        return { x: item[0] + x0, y: item[1] + y0 };
      });
    });
    store.drawings = d;
  }

  mouseDragged() {
    this.staticDrawing = 1;

    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
      return;
    }
    if (this.npoint_limit && this.npoints >= this.npoint_limit) {
      console.log('mouseDragged this.npoint_limit', this.npoint_limit, 'this.npoints', this.npoints);
      return;
    }
    if (!this.points) {
      this.points = [];
      this.drawings.push(this.points);
    }
    let x = int(mouseX);
    let y = int(mouseY);
    this.points.push({ x, y });
    this.npoints++;
  }

  // Save current drawing and prepare for next group of points
  mouseReleased() {
    console.log('DrawPoints mouseReleased');
    // null points will start fresh point array
    this.points = null;
    this.startTimedDraw();
    this.save_drawing();
  }
}
