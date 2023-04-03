let aVideo;
let mediaPath = '../media/rusty/MEHQE5386.MOV'; // Shindy Melani Johnson
// let dim = { width: 360, height: 640 };
let dim = { width: 888 / 2, height: 1920 / 2 };
let sync = {};
let peeps = [
  // { mediaPath: '../media-live/test-strip-portrait-360x640-00-34sec.mov', caption: 'test' },
  { mediaPath: 'https://jht1493.net/MoGallery/rusty/BYWNE9238.MOV', caption: 'Cintra Batchoo' },
  { mediaPath: 'https://jht1493.net/MoGallery/rusty/DBOSE7398.MOV', caption: 'Luis Vasquez' },
  { mediaPath: 'https://jht1493.net/MoGallery/rusty/FPFZE3511.MOV', caption: 'Kelly Carroll' },
  { mediaPath: 'https://jht1493.net/MoGallery/rusty/JASPE0408.MOV', caption: 'Cheikh Gueye' },
  { mediaPath: 'https://jht1493.net/MoGallery/rusty/LNUIE9760.MOV', caption: 'Rowan Abbas' },
  { mediaPath: 'https://jht1493.net/MoGallery/rusty/MEHQE5386.MOV', caption: 'Shindy Melani Johnson' }, // 5
  { mediaPath: 'https://jht1493.net/MoGallery/rusty/MFYS9812.MOV', caption: 'Tony Franco' },
  { mediaPath: 'https://jht1493.net/MoGallery/rusty/PWESE1796.MOV', caption: 'Maxim Kondratenko' },
  { mediaPath: 'https://jht1493.net/MoGallery/rusty/TKXNE0024.MOV', caption: '- park' },
  { mediaPath: 'https://jht1493.net/MoGallery/rusty/XNBCE9571.MOV', caption: '- Gravesend girlie' },
  // { mediaPath: 'https://jht1493.net/MoGallery/XNBCE9571.MOV', caption: '- Gravesend girlie' },
];

function setup() {
  sync.peepIndex = 0;
  check_url_param();

  createCanvas(dim.width, dim.height);

  let peep = peeps[sync.peepIndex];
  sync.caption = peep.caption;

  aVideo = createVideo([peep.mediaPath], videoLoaded);
  aVideo.onended(videoEnded);
  // aVideo.hide();
  aVideo.size(dim.width, dim.height);
  aVideo.position(0, 0);
  aVideo.elt.style.zIndex = '-1';

  sync.isPlaying = 0;
  sync.periodSecs = secsTime();
}

function draw() {
  // background(0);
  clear();

  let strs = [];
  sync.lapseSec = secsTime() - sync.periodSecs;
  let startSecs = startSecsOffset();
  strs.push('aVideo.time=' + formatTime(aVideo.time()));
  strs.push('startSecs=' + formatTime(startSecs));
  // strs.push('lapseSec=' + formatTime(sync.lapseSec));
  strs.push(sync.caption);

  // image(aVideo, 0, 0, dim.width, dim.height);

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
  console.log('delay', formatTime(delay), 'startSecs', formatTime(startSecs));
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

// https://editor.p5js.org/jht1493/sketches/5LgILr8RF
// Firebase-createImg-board

function check_url_param() {
  let query = window.location.search;
  console.log('query', query);
  if (query.length < 1) return;
  let params = params_query(query);
  let peepIndex = params['peepIndex'];
  if (peepIndex !== undefined) {
    sync.peepIndex = peepIndex;
  }
  console.log('peepIndex', peepIndex);
}

// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
function params_query(query) {
  // eg. query='abc=foo&def=%5Basf%5D&xyz=5'
  // params={abc: "foo", def: "[asf]", xyz: "5"}
  const urlParams = new URLSearchParams(query);
  const params = Object.fromEntries(urlParams);
  return params;
}

// let delay = 3000;
// setTimeout(ui_present_window, delay);

// Attributions
// https://www.youtube.com/watch?v=5IrAg8plb1o
// FULL HD Test Patterns 1920 x 1080 HDTV
