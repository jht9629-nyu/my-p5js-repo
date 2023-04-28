let aVersion = '2023-04-09-009';
let imgQRPath = 'https://jht1493.net/p5VideoKit/stage/qrcode3/';
let mediaPath = '../media/rusty/MEHQE5386.MOV'; // Shindy Melani Johnson
// let dim = { width: 360, height: 640 };
let dim = { width: 888 / 2, height: 1920 / 2 };
let sync = {};
let peeps = [
  // { mediaPath: '../media-live/test-strip-portrait-360x640-00-34sec.mov', caption: 'test' },
  { mediaPath: 'https://jht1493.net/MoGallery/rusty/00-09.mov', caption: '00-09' },
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
];
let peeps1 = [
  // { mediaPath: '../media-live/test-strip-portrait-360x640-00-34sec.mov', caption: 'test' },
  { mediaPath: '../media/rusty/00-09.mov', caption: '00-09' },
  { mediaPath: '../media/rusty/BYWNE9238.MOV', caption: 'Cintra Batchoo' },
  { mediaPath: '../media/rusty/DBOSE7398.MOV', caption: 'Luis Vasquez' },
  { mediaPath: '../media/rusty/FPFZE3511.MOV', caption: 'Kelly Carroll' },
  { mediaPath: '../media/rusty/JASPE0408.MOV', caption: 'Cheikh Gueye' },
  { mediaPath: '../media/rusty/LNUIE9760.MOV', caption: 'Rowan Abbas' },
  { mediaPath: '../media/rusty/MEHQE5386.MOV', caption: 'Shindy Melani Johnson' }, // 5
  { mediaPath: '../media/rusty/MFYS9812.MOV', caption: 'Tony Franco' },
  { mediaPath: '../media/rusty/PWESE1796.MOV', caption: 'Maxim Kondratenko' },
  { mediaPath: '../media/rusty/TKXNE0024.MOV', caption: '- park' },
  { mediaPath: '../media/rusty/XNBCE9571.MOV', caption: '- Gravesend girlie' },
];
let aVideo;

let playBtn;

function setup() {
  sync.peepIndex = 0;
  sync.gap = 1; // 1 sec gap between playback
  sync.duration = -1;
  check_url_param();

  // createCanvas(dim.width, dim.height);
  noCanvas();

  let peep = peeps[sync.peepIndex];
  sync.caption = peep.caption;

  aVideo = createVideo([peep.mediaPath], videoLoaded);
  aVideo.onended(videoEnded);
  // aVideo.hide();
  aVideo.size(dim.width, dim.height);
  // aVideo.position(0, 0);
  // aVideo.elt.style.zIndex = '-1';

  sync.isPlaying = 0;
  sync.periodSecs = secsTime();

  playBtn = createButton('Play').mousePressed(togglePlay);
  playBtn.style('font-size:88px');

  // p5-projects/media/qr/qrcode_jht9629-nyu.github.io.png
  // let imgPath = '../media-live/qr/qrcode_jht9629-nyu.github.io.png';
  let img = createImg(imgQRPath, 'text');
  // div.child(img);
}

function draw() {
  // background(0);
  // clear();

  let str = aVersion;
  str += ' ' + sync.caption;
  str += ' ' + (aVideo.elt.paused ? 'Paused' : 'Playing');
  let strs = [str];
  let time = aVideo.time();
  let startSecs = startSecsOffset();
  strs.push('duration=' + formatTime(sync.duration));
  strs.push('time=' + formatTime(time));
  strs.push('start=' + formatTime(startSecs));
  sync.lapseSec = secsTime() - sync.periodSecs;
  strs.push('lapseSec=' + formatTime(sync.lapseSec));

  let div = ui_div_empty('istatus');
  if (div) {
    div.html(strs.join('<br/>'));
  }
}

// This function is called when the video loads
function videoLoaded() {
  aVideo.noLoop();
  aVideo.volume(1);
  console.log('videoLoaded .width', aVideo.width, '.height', aVideo.height);
  console.log('.duration', aVideo.duration());
  sync.duration = aVideo.duration();
  sync.secsPerHour = 60 * 60;
  sync.nPerHour = Math.trunc(sync.secsPerHour / sync.duration);
  sync.residue = sync.secsPerHour - sync.nPerHour * sync.duration;
  sync.cycleCount = 0;
  // sync.gap = sync.residue / sync.nPerHour;
  console.log('sync', sync);
  // console.log('.gap', sync.gap);
  console.log('.nPerHour', sync.nPerHour);
  // confirm gap + duration will fit into hour
  // console.log('(sync.duration + sync.gap) * sync.nPerHour', (sync.duration + sync.gap) * sync.nPerHour);
}

function togglePlay() {
  console.log('togglePlay .paused', aVideo.elt.paused);
  // Go from paused to playing, or playing to paused
  sync.isPlaying = aVideo.elt.paused;
  if (sync.isPlaying) {
    checkDuration();
  } else {
    aVideo.pause();
  }
  console.log('sync.isPlaying', sync.isPlaying);
}

function checkDuration() {
  if (sync.duration < 0) {
    aVideo.play();
    setTimeout(checkDuration, 1000);
  } else {
    startVideoRelativeTime();
  }
}

function startVideoRelativeTime() {
  sync.cycleCount++;
  console.log('startVideoRelativeTime', sync.cycleCount);
  // Adjust start time to align with hour
  let startSecs = startSecsOffset();
  let diff = startSecs - sync.duration;
  console.log('diff', formatTime(diff), 'startSecs', formatTime(startSecs));
  // delay = 1;
  if (diff < 0) {
    aVideo.play();
    aVideo.time(startSecs);
  } else {
    let delay = sync.gap - diff;
    console.log('delay', formatTime(delay));
    setTimeout(videoPlayDelayed, delay * 1000);
  }
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
  console.log('videoEnded paused', aVideo.elt.paused);
  if (sync.isPlaying) {
    startVideoRelativeTime();
  }
}

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

// let delay = 3000;
// setTimeout(ui_present_window, delay);

// Attributions
// https://www.youtube.com/watch?v=5IrAg8plb1o
// FULL HD Test Patterns 1920 x 1080 HDTV
