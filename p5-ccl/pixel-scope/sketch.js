// https://editor.p5js.org/jht9629-nyu/sketches/_0fWGg7ni
// pixel-scope

let my = {
  version: 1, // update to verify change on mobile
  vwidth: 120, // Aspect ratio of video capture
  vheight: 160,
  vscale: 4, // scale up factor to canvas size
  cscale: 64, // scale down from video size to cross hair length
  colorSpanN: 16, // number of color spans in a row
  facingMode: 'user', // user environment
  face: 1,
  scan: 0, // scan the cross hairs
  scanRate: 10, // scan step rate, bigger for slower
  record: 0, // record every n frames
  scanMargin: 0.0, // 0.25, // inset for scan
  scrolling: 1, // scroll to show last bottom element
  frame: 1,
};

function setup() {
  my_init();

  createCanvas(my.width, my.height);
  background(255);
  noStroke();

  create_myVideo();

  create_ui();
}

function draw() {
  if (!video_ready()) return;

  check_scroll();

  draw_rgb(my.scan);

  if (frameCount % my.scanRate == 0) {
    if (my.record) record_action();
    if (my.scan) update_scan(my.record);
    check_save_color();
  }
}

function my_init() {
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

  my.frameColors = [];
  my.yFrame = my.height / 5.5;
}

function check_scroll() {
  if (my.scrolling) {
    window.scrollBy(0, 1);
  }
}

function mousePressed() {
  my.scrolling = !my.scrolling;
  console.log('my.scrolling', my.scrolling);
}

function create_myVideo() {
  let options = { video: { facingMode: my.facingMode } };
  my.video = createCapture(options);
  my.video.size(my.vwidth, my.vheight);
  my.video.hide();
}

function create_ui() {
  createSpan('v' + my.version);
  my.addBtn = createButton('Record').mousePressed(record_action);
  my.removeBtn = createButton('Delete').mousePressed(delete_action);

  my.faceChk = createCheckbox('Face', my.face);
  my.faceChk.style('display:inline');
  my.faceChk.changed(faceChk_action);

  // my.frameChk = createCheckbox('Frame', my.frame);
  // my.frameChk.style('display:inline');
  // my.frameChk.changed(frameChk_action);

  createElement('br');

  my.listDiv = createDiv('');
  my.listDiv.style('line-height:0;');

  my.resetBtn = createButton('Reset');
  my.resetBtn.mousePressed(reset_action);

  // my.snapBtn = createButton('Snap').mousePressed(snap_action);

  my.scanChk = createCheckbox('Scan', my.scan);
  my.scanChk.style('display:inline');
  my.scanChk.changed(scanChk_action);

  my.recordChk = createCheckbox('Record', my.record);
  my.recordChk.style('display:inline');
  my.recordChk.changed(recordChk_action);

  createElement('br');
  createElement('br');
  my.aref = createA('https://jht1493.github.io/2021-NYU-ITP-Installation/colored.html', 'Colored Portraits', '_blank');
}

function frameChk_action() {
  my.frame = this.checked();
}

function faceChk_action() {
  my.face = this.checked();
  my.facingMode = my.face ? 'user' : 'environment';
  console.log('my.facingMode', my.facingMode);
  my.video.remove();
  create_myVideo();
}

// removed - too slow
// function snap_action() {
//   init_scan();
//   empty_listDiv();
//   for (;;) {
//     draw_rgb(1);
//     record_action();
//     let full = update_scan(1);
//     if (full) break;
//   }
//   let rt = my.aref.elt.getBoundingClientRect();
//   window.scrollTo(0, rt.bottom);
// }

function scanChk_action() {
  my.scan = this.checked();
  if (my.scan) init_scan();
}

function recordChk_action() {
  my.record = this.checked();
  if (my.record) {
    init_scan();
    empty_listDiv();
  }
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

function update_scan(my_record) {
  let full = 0;
  my.scanOffsetX += my.scanStep;
  if (my.scanOffsetX >= my.scanRight) {
    my.scanOffsetX = my.scanLeft;
    if (my_record) {
      let br = createElement('br');
      my.listDiv.elt.appendChild(br.elt);
    }
    my.scanOffsetY += my.scanStep;
    if (my.scanOffsetY >= my.scanBotton) {
      my.scanOffsetY = my.scanTop;
      full = 1;
    }
  }
  return full;
}

function reset_action() {
  location.reload();
}

function video_ready() {
  return my.video.loadedmetadata && my.video.width > 0 && my.video.height > 0;
}

function check_save_color() {
  if (!my.color) return;
  if (my.frameColors.length > my.yFrame) {
    my.frameColors.pop();
  }
  my.frameColors.splice(0, 0, my.color);
}

function draw_rgb(my_scan) {
  let vwidth = my.vwidth;
  let vheight = my.vheight;

  // Get pixel from center of video
  let cx = vwidth / 2;
  let cy = vheight / 2;
  if (my_scan) {
    cx = my.scanOffsetX;
    cy = my.scanOffsetY;
  }
  let color = my.video.get(cx, cy);
  my.color = color;

  // fill the canvas with the center video pixel
  fill(color);
  rect(0, 0, width, height);

  // top corner for video + rgb bars in middle of canvas
  let vx = width / 2 - vwidth / 2;
  let vy = height - vheight * 3; // 2.5;
  let clen = my.crossLen;

  // draw outter prior colors
  if (my.frame) {
    let x = width / 4;
    let w = width / 2;
    let y = my.yFrame;
    let dx = x / y;
    let dy = 1;
    for (col of my.frameColors) {
      let y1 = height - y;
      let h = y1 - y;
      fill(col);
      rect(x, y, w, dy);
      rect(x, y1, w, dy);
      rect(x, y, dx, h);
      rect(x + w, y, dx, h);
      x -= dx;
      y -= dy;
      w += dx * 2;
    }
  }

  // video in middle of canvas
  image(my.video, vx, vy);

  // draw cross hairs
  fill(color);
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

function record_action() {
  // console.log('record_action');
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
  colorElm.mousePressed(colorElm_mouse_action);

  let rgbSpan = createSpan('r=' + r + ' g=' + g + ' b=' + b + ' ');
  rgbSpan.style('display:none');

  let box = createSpan('');
  box.child(colorElm);
  box.child(rgbSpan);

  my.listDiv.elt.appendChild(box.elt);
}

function colorElm_mouse_action(e) {
  let sib = this.elt.nextSibling;
  // console.log('sib', sib);
  if (sib.style.display === 'none') {
    sib.style.display = 'inline';
  } else {
    sib.style.display = 'none';
  }
}

function delete_action() {
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
