// https://editor.p5js.org/jht9629-nyu/sketches/_0fWGg7ni
// video-meter-rgb-tall

let my = {
  version: 3, // update to verify change on mobile
  vwidth: 120, // Aspect ratio of video capture
  vheight: 160,
  vscale: 4, // scale up factor to canvas size
  cscale: 64, // scale down from video size to cross hair length
  colorClipLen: 50, // size of each saved color chip
  facingMode: 'environment', // user environment
};

function setup() {
  my.width = my.vwidth * my.vscale;
  my.height = my.vheight * my.vscale;

  createCanvas(my.width, my.height);
  background(200);

  createMyVideo();

  my.crossLen = my.vwidth / my.cscale;

  background(255);
  noStroke();

  createSpan('v' + my.version);

  my.addBtn = createButton('Add').mousePressed(addAction);

  my.removeBtn = createButton('Remove').mousePressed(removeAction);

  my.faceBtn = createButton('Face').mousePressed(faceAction);

  my.listDiv = createDiv('');
  my.listDiv.style('line-height:0;');
}

function createMyVideo() {
  let options = { video: { facingMode: my.facingMode } };
  my.video = createCapture(options);
  my.video.size(my.vwidth, my.vheight);
  my.video.hide();
}

function faceAction() {
  let isEnv = my.facingMode == 'environment';
  my.facingMode = isEnv ? 'user' : 'environment';
  console.log('my.facingMode', my.facingMode);

  my.video.remove();
  createMyVideo();
}

function videoIsReady() {
  return my.video.loadedmetadata && my.video.width > 0 && my.video.height > 0;
}

function draw() {
  if (!videoIsReady()) return;

  let vwidth = my.vwidth;
  let vheight = my.vheight;

  // Get pixel from center of video
  let cx = vwidth / 2;
  let cy = vheight / 2;
  let color = my.video.get(cx, cy);
  my.color = color;

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

function addAction() {
  console.log('addAction');
  let color = my.color;
  let r = color[0];
  let g = color[1];
  let b = color[2];

  let px = my.colorClipLen;
  let spec = 'background-color:rgb(' + r + ',' + g + ',' + b + ');';
  spec += 'width:' + px + 'px;height:' + px + 'px;';
  spec += 'display:inline-block';
  // console.log('spec', spec);
  let colorElm = createSpan('');
  colorElm.style(spec);
  colorElm.mousePressed(colorMouseAction);

  let rgbSpan = createSpan('r=' + r + ' g=' + g + ' b=' + b + ' ');
  rgbSpan.style('display:none');

  let box = createSpan('');
  box.child(colorElm);
  box.child(rgbSpan);

  // child could be null
  let child = my.listDiv.elt.firstChild;
  my.listDiv.elt.insertBefore(box.elt, child);

  let rt = colorElm.elt.getBoundingClientRect();
  console.log('rt', rt);
  console.log('rt.y', rt.y);
  window.scrollTo(0, rt.y);
  // my.listDiv.child(element);
}

function colorMouseAction(e) {
  // console.log('colorMouseAction e', e);
  // console.log('colorMouseAction this', this);
  let sib = this.elt.nextSibling;
  // console.log('sib', sib);
  if (sib.style.display === 'none') {
    sib.style.display = 'inline';
  } else {
    sib.style.display = 'none';
  }
}

function removeAction() {
  let child = my.listDiv.elt.firstChild;
  if (!child) return;
  child.remove();
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
