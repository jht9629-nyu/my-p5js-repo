let aVideo;
// let mediaPath = '../media/test/test-strip-portrait-11sec.mov';
let mediaPath = '../media/rusty/MEHQE5386.MOV'; // Shindy Melani Johnson
// let dim = { width: 360, height: 640 };
let dim = { width: 888 / 2, height: 1920 / 2 };
let sync = {};
let peeps = [
  { mediaPath: 'BYWNE9238.MOV', caption: 'Cintra Batchoo' },
  { mediaPath: 'DBOSE7398.MOV', caption: 'Luis Vasquez' },
  { mediaPath: 'FPFZE3511.MOV', caption: 'Kelly Carroll' },
  { mediaPath: 'JASPE0408.MOV', caption: 'Cheikh Gueye' },
  { mediaPath: 'LNUIE9760.MOV', caption: 'Rowan Abbas' },
  { mediaPath: 'MEHQE5386.MOV', caption: 'Shindy Melani Johnson' },
  { mediaPath: 'MFYS9812.MOV', caption: 'Tony Franco' },
  { mediaPath: 'PWESE1796.MOV', caption: 'Maxim Kondratenko' },
  { mediaPath: 'TKXNE0024.MOV', caption: '- park' },
  { mediaPath: 'XNBCE9571.MOV', caption: '- Gravesend girlie' },
];
// BYWNE9238.MOV
// DBOSE7398.MOV
// FPFZE3511.MOV
// JASPE0408.MOV
// LNUIE9760.MOV
// MEHQE5386.MOV
// MFYS9812.MOV
// PWESE1796.MOV
// TKXNE0024.MOV
// XNBCE9571.MOV

function setup() {
  createCanvas(dim.width, dim.height);

  mediaPath = '../media/rusty/' + peeps[9].mediaPath;
  aVideo = createVideo([mediaPath], videoLoaded);
  aVideo.onended(videoEnded);
  aVideo.hide();

  sync.isPlaying = 0;
  sync.fcount = 0;
  sync.periodSecs = secsTime();
}

function draw() {
  background(0);

  let strs = [];

  sync.fcount++;
  sync.lapseSec = secsTime() - sync.periodSecs;

  let startSecs = startSecsOffset();

  strs.push('startSecs=' + formatTime(startSecs));
  strs.push('aVideo.time=' + formatTime(aVideo.time()));
  strs.push('lapseSec=' + formatTime(sync.lapseSec));
  strs.push('fcount=' + sync.fcount);

  image(aVideo, 0, 0, dim.width, dim.height);

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
  console.log('.nPerHour', sync.nPerHour);
  // confirm gap + duration will fit into hour
  console.log('(sync.duration + sync.gap) * sync.nPerHour', (sync.duration + sync.gap) * sync.nPerHour);
}

function mousePressed() {
  sync.isPlaying = !sync.isPlaying;
  if (sync.isPlaying) {
    startVideoRelativeTime();
  } else {
    aVideo.pause();
  }
}

function startVideoRelativeTime() {
  console.log('startVideoRelativeTime');
  // Adjust start time to align with hour
  let startSecs = startSecsOffset();
  let delay = startSecs - sync.duration;
  console.log('delay', formatTime(delay));
  // delay = 1;
  if (delay < 0) {
    aVideo.play();
    aVideo.time(startSecs);
  } else {
    setTimeout(videoPlayDelayed, delay * 1000);
  }
  sync.fcount = 0;
  sync.periodSecs = secsTime();

  // console.log('sync', sync);
}

function startSecsOffset() {
  // Adjust start time to align with hour
  let date = new Date();
  let hours = date.getHours();
  let mins = date.getMinutes();
  let secs = date.getSeconds();
  let millis = date.getMilliseconds();
  // console.log('hours', hours, 'mins', mins, 'secs', secs, 'millis', millis);

  let secsForHour = mins * 60 + secs + millis / 1000;
  let startSecs = secsForHour % (sync.duration + sync.gap);

  // console.log('secsForHour', secsForHour, 'startSecs', formatTime(startSecs));

  return startSecs;
}

function videoPlayDelayed() {
  console.log('videoPlayDelayed');
  aVideo.play();
  aVideo.time(0);
}

function videoEnded() {
  console.log('videoEnded');
  if (sync.isPlaying) {
    startVideoRelativeTime();
  }
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
