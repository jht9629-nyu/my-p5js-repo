// https://editor.p5js.org/jht9629-nyu/sketches/_0fWGg7ni
// video meter rgb tall

// https://jht9629-nyu.github.io/my-p5js-repo-2023/p5-projects/video-meter-rgb-tall

let my = { version: 11, width: 640, height: 480, vscale: 4, cscale: 64 };

function setup() {
  // simple test for mobile phone
  if (window.screen.width < window.screen.height) {
    my.width = window.screen.width;
    my.height = window.screen.widheightth;
  }

  createCanvas(my.width, my.height);
  background(200);

  let vwidth = my.width / my.vscale;
  let vheight = my.height / my.vscale;
  console.log('vwidth', vwidth, 'vheight', vheight);

  my.video = createCapture(VIDEO);
  my.video.size(vwidth, vheight);
  my.video.hide();

  my.crossLen = vwidth / my.cscale;

  background(255);
  noStroke();

  createDiv('Version:' + my.version);
}

function draw() {
  if (!my.video.loadedmetadata) {
    return;
  }
  let vwidth = my.video.width;
  let vheight = my.video.height;

  // Get pixel from center of video
  let cx = vwidth / 2;
  let cy = vheight / 2;
  let color = my.video.get(cx, cy);

  // fill the canvas with the center video pixel
  fill(color);
  rect(0, 0, width, height);

  // place video in lower right middle
  let vx = width / 2 - vwidth / 2;
  let vy = height - vheight * 2.5;
  image(my.video, vx, vy);

  // draw cross hairs
  let clen = my.crossLen;
  rect(vx + cx, vy, clen, vheight);
  rect(vx, vy + cy, vwidth, clen);

  // white backdrop to bars
  let x0 = vx;
  let y0 = vy + vheight + clen;
  let wwidth = vwidth;
  let wheight = vheight;
  fill(255);
  rect(x0, y0, wwidth, wheight);

  x0 += clen;
  y0 += clen;
  let y2 = y0 + wheight - clen * 2;
  let btall = wheight * 0.8;
  let y1 = y0 + btall;

  // red bar
  let bwide = (wwidth - clen * 2) / 3;
  let r = color[0];
  let rh = btall * (r / 255);
  fill(r, 0, 0);
  rect(x0, y1 - rh, bwide, rh);
  fill(255, 0, 0);
  text('r=' + r, x0, y2);

  // green bar
  x0 += bwide;
  let g = color[1];
  let gh = btall * (g / 255);
  fill(0, g, 0);
  rect(x0, y1 - gh, bwide, gh);
  fill(0, 255, 0);
  text('g=' + g, x0, y2);

  // blue bar
  x0 += bwide;
  let b = color[2];
  let bh = btall * (b / 255);
  fill(0, 0, b);
  rect(x0, y1 - bh, bwide, bh);
  fill(0, 0, 255);
  text('b=' + b, x0, y2);
}

// https://editor.p5js.org/jht9629-nyu/sketches/aJkcqKahg
// video meter rgb long

// https://editor.p5js.org/jht9629-nyu/sketches/p0ato8vra
// video pixel meter

// https://editor.p5js.org/jht9629-nyu/sketches/sJM2AMf5T
// video pixel
// extreme pixel distortion at vscale: 32 and beyond

// https://editor.p5js.org/jht9629-nyu/sketches/HRjZBETUA
// video pixel scan

// https://editor.p5js.org/jht1493/sketches/MtdR3vBcj
// https://github.com/CodingTrain/website/blob/master
//   /Tutorials/P5JS/p5.js_video/11.1_p5.js_createCapture

// https://p5js.org/reference/#/p5/image
// -- draw entire image, optionally scaled to new size
// image(img, x, y, [width], [height])
// -- draw into subsection of an image,
//      optional subsection of source image
// image(img, dx, dy, dWidth, dHeight,
//    sx, sy, [sWidth], [sHeight])
