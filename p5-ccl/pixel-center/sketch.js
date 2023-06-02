// https://editor.p5js.org/jht9629-nyu/sketches/BtTb0NzK9
// pixel-center

let my = {
  version: 6, // update to verify change on mobile
  vwidth: 393, // 480, // Aspect ratio of video capture
  vheight: 600, // 640,
  cscale: 128, // scale down from video size to cross hair length
  colorSpanN: 16, // number of color spans in a row
  facingMode: 'user', // user environment
  face: 1,
  scan: 0, // scan the cross hairs
  scanRate: 10, // scan step rate, bigger for slower
  scanMargin: 0.0, // 0.25, // inset for scan
  scrolling: 0, // scroll to show last bottom element
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
    check_save_color();
  }
}

function my_init() {
  my.width = my.vwidth;
  my.height = my.vheight;
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

  my.frame_x0 = my.width / 4;
  my.frame_width = my.width / 2;
  my.frame_y0 = my.height / 3;

  my.recordWidth = my.width;
  my.recordHeight = my.colorSpanPx;
}

function check_scroll() {
  if (my.scrolling) {
    window.scrollBy(0, 1);
  }
}

function mousePressed() {
  // my.scrolling = !my.scrolling;
  // console.log('my.scrolling', my.scrolling);
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

  my.faceChk = createCheckbox('Face', my.face);
  my.faceChk.style('display:inline');
  my.faceChk.changed(faceChk_action);

  createElement('br');

  my.listDiv = createDiv('');
  my.listDiv.style('line-height:0;');

  my.resetBtn = createButton('Reset');
  my.resetBtn.mousePressed(reset_action);

  createElement('br');
  createElement('br');
  my.aref = createA('https://jht1493.github.io/2021-NYU-ITP-Installation/colored.html', 'Colored Portraits', '_blank');
  createDiv(`width=${window.screen.width} height=${window.screen.height} `);
  createDiv(`availWidth=${window.screen.availWidth} availHeight=${window.screen.availHeight} `);
}

function faceChk_action() {
  my.face = this.checked();
  my.facingMode = my.face ? 'user' : 'environment';
  console.log('my.facingMode', my.facingMode);
  my.video.remove();
  create_myVideo();
}

function reset_action() {
  location.reload();
}

function video_ready() {
  return my.video.loadedmetadata && my.video.width > 0 && my.video.height > 0;
}

function check_save_color() {
  if (!my.color) return;
  if (my.frameColors.length > my.frame_y0) {
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
  fill(color);

  // video in middle of canvas
  image(my.video, 0, 0);

  // draw outter prior colors
  if (my.frame) {
    let x = my.frame_x0;
    let w = my.frame_width;
    let y = my.frame_y0;
    let dx = x / y;
    let dy = 1;
    for (col of my.frameColors) {
      let y1 = height - y;
      let h = y1 - y;
      fill(col);
      rect(x, y, w, dy * 2);
      rect(x, y1, w, dy * 2);
      rect(x, y, dx, h);
      rect(x + w, y, dx, h);
      x -= dx;
      y -= dy;
      w += dx * 2;
    }
  }

  // draw box and cross hairs
  {
    let vx = my.frame_x0;
    let vy = my.frame_y0;
    let clen = my.crossLen;
    let w = my.frame_width;
    let h = height - my.frame_y0 * 2;
    fill(color);
    rect(vx, vy, clen, h); // left top to bottom
    rect(cx, vy, clen, h); // line center top to bottom
    rect(vx + w - clen, vy, clen, h); // right top to bottom
    rect(vx, vy + h / 2, w, clen); // line center left to right
  }
}

function record_action() {
  // console.log('record_action');
  let color = my.color;
  let r = color[0];
  let g = color[1];
  let b = color[2];

  let w = my.recordWidth;
  let h = my.recordHeight;
  let colorElm = create_color_span(w, h, r, g, b);
  let marginSpan = create_color_span(w, h / 8, 255, 255, 255);
  h = h / 3;
  let rSpan = create_color_bar(w, h, r, 0, 0);
  let gSpan = create_color_bar(w, h, 0, g, 0);
  let bSpan = create_color_bar(w, h, 0, 0, b);

  // rgb numeric readout not displaying fully
  let rgbSpan = createSpan('r=' + r + ' g=' + g + ' b=' + b + ' ');
  rgbSpan.style('display:none');
  // rgbSpan.style('height:30px');

  let box = createSpan('');
  box.child(colorElm);
  box.child(createElement('br'));
  box.child(rSpan);
  box.child(gSpan);
  box.child(bSpan);
  box.child(createElement('br'));
  box.child(marginSpan);
  box.child(createElement('br'));
  // rgb readout here otherwise will be not readable
  box.child(rgbSpan);
  box.child(createElement('br'));

  colorElm.mousePressed(function () {
    colorElm_mouse_action(rgbSpan);
  });

  // insert at start, child could be null
  let child = my.listDiv.elt.firstChild;
  my.listDiv.elt.insertBefore(box.elt, child);
}

function colorElm_mouse_action(target) {
  // let sib = this.elt.nextSibling;
  let sib = target.elt;
  console.log('sib', sib);
  if (sib.style.display === 'none') {
    sib.style.display = 'inline';
  } else {
    sib.style.display = 'none';
  }
}

function create_color_bar(width, height, r, g, b) {
  // let cwidth = width / 3;
  let cwidth = width;
  let percent = (r + g + b) / 255;
  let w = cwidth * percent;
  let h = height;
  let comp = create_color_span(w, h, r, g, b);
  w = (cwidth * (1 - percent)) / 2;
  let spacer = create_color_span(w, h, 255, 255, 255);
  let box = createSpan('');
  box.child(spacer);
  box.child(comp);
  box.child(createElement('br'));
  return box;
}

function create_color_span(width, height, r, g, b) {
  let spec = 'background-color:rgb(' + r + ',' + g + ',' + b + ');';
  spec += 'width:' + width + 'px;height:' + height + 'px;';
  spec += 'display:inline-block';
  // console.log('spec', spec);
  let colorElm = createSpan('');
  colorElm.style(spec);
  return colorElm;
}
