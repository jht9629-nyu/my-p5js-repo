let aVideo;
let fcount = 0;
let doRun = 0;
let doPreRoll = 0;
let preRollCount = 0;
let startSecs;
// let lapseSecs = 10;
// let secsMod = 10;
let mediaPath = '../media/test-strip-portrait-360x640-00-34sec.mov';
let dim = { width: 360, height: 640 };
let lapseSecs = 33.5587;
let secsMod = 33.5587;
let sync = { running: 0, preRolling: 0 };

function setup() {
  createCanvas(dim.width, dim.height);

  aVideo = createVideo([mediaPath], videoLoaded);
  // aVideo.duration 86.470167
  // ./media/test-strip-count-0-300-x480
  // test-strip-count-0-300-x480
  // test-strip-count-0-300
  // test-strip-360-10sec

  //aVideo.size(100, 100);
  // video size not valid until loaded
  // console.log('aVideo.width', aVideo.width);
  // console.log('aVideo.height', aVideo.height);

  startSecs = millis() / 1000;
}

function mousePressed() {
  doPreRoll = !doPreRoll;
  if (doPreRoll) {
    preRollCount = 0;
  }
  doRun = 0;
  fcount = 0;
}

let nsecs;

function draw() {
  background(0);
  // Measure time interval nowLapse
  let nowSecs = millis() / 1000;
  let nowLapse = nowSecs - startSecs;
  nowLapse = int(nowLapse * 100) / 100;
  if (nowLapse >= lapseSecs) {
    startSecs = nowSecs;
    console.log('fcount=', fcount, 'doRun', doRun);
    if (doRun) {
      fcount = 0;
      aVideo.time(0);
    }
  }
  let vtime = aVideo.time();
  vtime = int(vtime * 100) / 100;
  let strs = [];
  if (doPreRoll) {
    let now = new Date();
    // nsecs = secsMod - 1 - (now.getSeconds() % secsMod);
    nsecs = now.getSeconds() % secsMod;
    if (nsecs === 0) {
      doPreRoll = 0;
      doRun = 1;
    } else {
      strs.push('preRollCount=' + preRollCount, 'nsecs=' + nsecs);
      preRollCount++;
    }
  }
  if (doRun) {
    fcount++;
  }
  strs.push('secs=' + nowLapse, 'vtime=' + vtime);
  strs.push('count=' + fcount);

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
  // aVideo.play();
  aVideo.volume(1);
  console.log('aVideo.width', aVideo.width);
  console.log('aVideo.height', aVideo.height);
  console.log('aVideo.duration', aVideo.duration());
  // aVideo.width 640
  // aVideo.height 360
  sync.duration = aVideo.duration();
  sync.secsPerHour = 60 * 60;
  sync.nPerHour = Math.trunc(sync.secsPerHour / sync.duration);
  sync.residue = sync.secsPerHour - sync.nPerHour * sync.duration;
  sync.preroll = sync.residue / sync.nPerHour;
  sync.preRolling = 1;
  console.log('sync', sync);
}

// Attributions
// https://www.youtube.com/watch?v=5IrAg8plb1o
// FULL HD Test Patterns 1920 x 1080 HDTV
