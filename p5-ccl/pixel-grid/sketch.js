// https://editor.p5js.org/jht9629-nyu/sketches/twgS6eWRZ
// pixel-grid

let my = {
  version: 1, // update to verify change on mobile
  vwidth: 480, // Aspect ratio of video capture
  vheight: 640,
  face: 1,
  scrolling: 1,
  nstep: 16,
  margin: 0.1,
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

  // faster to get entire video frame as an image
  let img = my.video.get();
  let stepPx = my.stepPx;
  let rr = stepPx * (1 - my.margin);
  let vx = 0;
  let vy = 0;

  image(img, vx, vy);

  while (vy < my.vheight) {
    let col = img.get(vx, vy);
    fill(col);
    rect(vx, vy, rr, rr);
    vx += stepPx;
    if (vx > my.vwidth) {
      vx = 0;
      vy += stepPx;
    }
  }
}

function my_init() {
  my.width = my.vwidth;
  my.height = my.vheight;
  my.stepPx = my.vwidth / my.nstep;
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

  my.resetBtn = createButton('Reset');
  my.resetBtn.mousePressed(reset_action);

  my.faceChk = createCheckbox('Face', my.face);
  my.faceChk.style('display:inline');
  my.faceChk.changed(faceChk_action);

  // createElement('br');
  // my.aref = createA('https://jht1493.github.io/2021-NYU-ITP-Installation/colored.html', 'Colored Portraits', '_blank');
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
