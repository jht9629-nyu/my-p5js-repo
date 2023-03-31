let vid;
let fcount = 0;
let doRun = 0;
let doPreRoll = 0;
let preRollCount = 0;
let startSecs;
let lapseSecs = 10;
let secsMod = 10;

function setup() {
  createCanvas(640, 360);

  vid = createVideo(['test-strip-count-0-300-x480.mov'], vidLoad);
  // test-strip-count-0-300-x480
  // test-strip-count-0-300
  // test-strip-360-10sec

  //vid.size(100, 100);
  // video size not valid until loaded
  // console.log('vid.width', vid.width);
  // console.log('vid.height', vid.height);

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
      vid.time(0);
    }
  }
  let vtime = vid.time();
  vtime = int(vtime * 100) / 100;
  let strs = [];
  if (doPreRoll) {
    let now = new Date();
    nsecs = secsMod - 1 - (now.getSeconds() % secsMod);
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

  image(vid, 0, 0);

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
function vidLoad() {
  vid.loop();
  vid.volume(0);
  console.log('vid.width', vid.width);
  console.log('vid.height', vid.height);
  // vid.width 640
  // vid.height 360
}
