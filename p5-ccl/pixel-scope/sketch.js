// https://editor.p5js.org/jht9629-nyu/sketches/_0fWGg7ni
// pixel-scope

let my = {
  version: 2, // update to verify change on mobile
  vwidth: 120, // Aspect ratio of video capture
  vheight: 160,
  vscale: 4, // scale up factor to canvas size
  cscale: 64, // scale down from video size to cross hair length
  colorSpanN: 16, // number of color spans in a row
  facingMode: 'user', // user environment
  scan: 0, // scan the cross hairs
  scanRate: 10, // scan step rate, bigger for slower
  snap: 0, // snap every n frames
  scanMargin: 0.0, // 0.25, // inset for scan
};

function setup() {
  my.width = my.vwidth * my.vscale;
  my.height = my.vheight * my.vscale;
  my.crossLen = my.vwidth / my.cscale;

  my.scanLeft = my.vwidth * my.scanMargin;
  my.scanRight = my.vwidth * (1 - my.scanMargin);
  my.scanTop = my.vheight * my.scanMargin;
  my.scanBotton = my.vheight * (1 - my.scanMargin);
  my.scanOffsetX = my.scanLeft;
  my.scanOffsetY = my.scanTop;
  my.scanStep = (my.scanRight - my.scanLeft) / (my.colorSpanN - 1);
  my.colorSpanPx = windowWidth / my.colorSpanN;

  createCanvas(my.width, my.height);
  background(255);
  noStroke();

  createMyVideo();

  create_ui();
}

function draw() {
  if (!videoIsReady()) return;

  check_scroll();

  draw_rgb();

  if (frameCount % my.scanRate == 0) {
    if (my.snap) addAction();
    if (my.scan) update_scan();
  }
}

function check_scroll() {
  if (!my.scrolling) return;

  // let y = my.resetBtn.elt.getBoundingClientRect().y;
  // console.log('check_scroll y', y);
  // if (y > 0) {
  //   window.scrollBy(0, 1);
  // }

  window.scrollBy(0, 1);
}

function createMyVideo() {
  let options = { video: { facingMode: my.facingMode } };
  my.video = createCapture(options);
  my.video.size(my.vwidth, my.vheight);
  my.video.hide();
}

function create_ui() {
  createSpan('v' + my.version);
  my.addBtn = createButton('Add').mousePressed(addAction);
  my.removeBtn = createButton('Remove').mousePressed(removeAction);
  my.faceBtn = createButton('Face').mousePressed(faceAction);
  createElement('br');

  my.listDiv = createDiv('');
  // my.listDiv.position(0, 0);
  my.listDiv.style('line-height:0;');

  my.resetBtn = createButton('Reset');
  my.resetBtn.mousePressed(resetAction);

  my.scanChk = createCheckbox('Scan', my.scan);
  my.scanChk.style('display:inline');
  my.scanChk.changed(function () {
    my.scan = this.checked();
    if (my.scan) init_scan();
  });

  my.snapChk = createCheckbox('Snap', my.snap);
  my.snapChk.style('display:inline');
  my.snapChk.changed(function () {
    my.snap = this.checked();
    if (my.snap) {
      init_scan();
      empty_listDiv();
      my.scrolling = 1;
    } else {
      my.scrolling = 0;
    }
  });

  createElement('br');
  createA('https://jht1493.github.io/2021-NYU-ITP-Installation/colored.html', 'Colored Portraits', '_blank');
}

function init_scan() {
  my.scanOffsetX = my.scanLeft;
  my.scanOffsetY = my.scanTop;
}

function empty_listDiv() {
  for (;;) {
    let child = my.listDiv.elt.firstChild;
    if (!child) break;
    child.remove();
  }
}

function update_scan() {
  my.scanOffsetX += my.scanStep;
  if (my.scanOffsetX >= my.scanRight) {
    my.scanOffsetX = my.scanLeft;

    let br = createElement('br');
    my.listDiv.elt.appendChild(br.elt);

    my.scanOffsetY += my.scanStep;
    if (my.scanOffsetY >= my.scanBotton) {
      my.scanOffsetY = my.scanTop;
    }
  }
}

function resetAction() {
  localStorage.removeItem('my.colors');
  location.reload();
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

function draw_rgb() {
  let vwidth = my.vwidth;
  let vheight = my.vheight;

  // Get pixel from center of video
  let cx = vwidth / 2;
  let cy = vheight / 2;
  if (my.scan) {
    cx = my.scanOffsetX;
    cy = my.scanOffsetY;
  }
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
  my.scrolling = 1;
  // console.log('addAction');
  let color = my.color;
  let r = color[0];
  let g = color[1];
  let b = color[2];

  let px = my.colorSpanPx;
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
  // let child = my.listDiv.elt.firstChild;
  // my.listDiv.elt.insertBefore(box.elt, child);
  my.listDiv.elt.appendChild(box.elt);

  let rt = colorElm.elt.getBoundingClientRect();
  console.log('addAction rt.y', rt.y);
  // window.scrollTo(0, rt.y);
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
