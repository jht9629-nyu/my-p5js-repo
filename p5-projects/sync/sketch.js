let aVideo;
let mediaPath = '../media/test-strip-portrait-11sec.mov';
let dim = { width: 360, height: 640 };
let sync = {};

function setup() {
  createCanvas(dim.width, dim.height);

  aVideo = createVideo([mediaPath], videoLoaded);
  aVideo.onended(videoEnded);

  sync.fcount = 0;
  sync.periodSecs = secsTime();
}

function draw() {
  background(0);

  let strs = [];

  sync.fcount++;
  sync.lapseSec = secsTime() - sync.periodSecs;

  strs.push('aVideo.time=' + formatTime(aVideo.time()));
  strs.push('lapseSec=' + formatTime(sync.lapseSec));
  strs.push('fcount=' + sync.fcount);

  image(aVideo, 0, 0);

  let th = 32;
  textSize(th);

  let x0 = width / 8;

  let y0 = height;
  y0 -= th * strs.length;

  for (let index = 0; index < strs.length; index++) {
    let str = strs[index];
    // let x0 = width / 2 - tw / 2;
    let tw = textWidth(str);
    fill(0);
    rect(x0, y0 - th, tw, th);
    fill(255);
    text(str, x0, y0);
    y0 += th;
  }
}

// This function is called when the video loads
function videoLoaded() {
  aVideo.noLoop();
  aVideo.volume(1);
  console.log('videoLoaded .width', aVideo.width, '.height', aVideo.height, '.duration', aVideo.duration());
  sync.duration = aVideo.duration();
  sync.secsPerHour = 60 * 60;
  sync.nPerHour = Math.trunc(sync.secsPerHour / sync.duration);
  sync.residue = sync.secsPerHour - sync.nPerHour * sync.duration;
  sync.gap = sync.residue / sync.nPerHour;
  console.log('sync', sync);
  console.log('.gap', sync.gap);
  // confirm gap + duration will fit into hour
  console.log('(sync.duration + sync.gap) * sync.nPerHour', (sync.duration + sync.gap) * sync.nPerHour);
}

function mousePressed() {
  startVideoRelativeTime();
}

function startVideoRelativeTime() {
  console.log('startVideoRelativeTime');
  // Adjust start time to align with hour
  let date = new Date();
  let hours = date.getHours();
  let mins = date.getMinutes();
  let secs = date.getSeconds();
  let millis = date.getMilliseconds();
  console.log('hours', hours, 'mins', mins, 'secs', secs, 'millis', millis);

  let secsForHour = mins * 60 + secs + millis / 1000;
  let startSecs = secsForHour % (sync.duration + sync.gap);
  let delay = startSecs - sync.duration;
  console.log('secsForHour', secsForHour, 'startSecs', formatTime(startSecs), 'delay', formatTime(delay));
  // delay = 1;
  if (delay < 0) {
    aVideo.play();
    aVideo.time(startSecs);
  } else {
    setTimeout(videoPlayDelayed, delay * 1000);
  }
  sync.fcount = 0;
  sync.periodSecs = secsTime();

  console.log('sync', sync);
}

function videoPlayDelayed() {
  console.log('videoPlayDelayed');
  aVideo.play();
  aVideo.time(0);
}

function videoEnded() {
  console.log('videoEnded');
  startVideoRelativeTime();
}

function formatTime(n) {
  let displayPrecision = 1000;
  return int(n * displayPrecision) / displayPrecision;
}

function secsTime() {
  return millis() / 1000;
}

// let delay = 3000;
// setTimeout(ui_present_window, delay);

// Attributions
// https://www.youtube.com/watch?v=5IrAg8plb1o
// FULL HD Test Patterns 1920 x 1080 HDTV
