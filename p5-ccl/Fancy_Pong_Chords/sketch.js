// https://editor.p5js.org/jht9629-nyu/sketches/5Y1WTyVd-
// Fancy Pong Chords

// TODO: start paddle in center. mouseX move drifts paddle
// BUG: no audio running locally until click on canvas

let score = 0;
let balls = [];
let maxBalls = 7 * 4;
let myColors;
let colorIndex = 0;

// The midi notes of a scale
let notes = [60, 62, 64, 65, 67, 69, 71];
let noteIndex = 0;

let spawnRate = 0; // 60; // Spawn balls every n frames, 0 for no spawn
let stuckRate = 60; // Check for stuck pairs every n frames
let bkgAlpha = 10;
let jiggle = 3;
let cmsg = 1;
let hits = [];
let paddle;
let blocks = [];
let blockFlip = 0;

function setup() {
  createCanvas(windowWidth / 2, windowHeight / 2); // Chaos
  // createCanvas(windowWidth - 20, windowHeight - 20);
  // createCanvas(800, 800);

  init_myColors();

  paddle = new Block();

  let b1 = new Ball();
  b1.xdir = 0;
  b1.x = 0;
  // b.y = height - height / 10; // Chaos on start
  b1.y = 0;
  balls.push(b1);
}

function draw() {
  //
  background(220, bkgAlpha);

  draw_balls();

  draw_blocks();

  paddle.x = mouseX - paddle.w / 2;
  paddle.render();

  check_collisions();

  check_block_collisions();

  // Score
  fill('blue');
  textSize(24);
  // text("Score:" + score, 10, 25);
  text('nballs:' + balls.length, 10, 25);

  check_spawn();
}

function draw_balls() {
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    b.move();

    if (b.isHit(paddle)) {
      score++;
      b.bounceY();
      b.playNote();
      trimsBalls();
      balls.push(new Ball());
    }
  }
}

function draw_blocks() {
  for (let i1 = 0; i1 < blocks.length; i1++) {
    let o1 = blocks[i1];
    o1.render();
  }
}

// Remove a ball if number of balls exceeed maxBalls
function trimsBalls() {
  if (balls.length >= maxBalls) {
    balls.splice(0, 1);
  }
}

function check_spawn() {
  if (spawnRate && frameCount % spawnRate == 0) {
    trimsBalls();
    let b = new Ball();
    balls.push(b);
    b.x = floor(random(0, width));
    b.y = floor(random(0, height));
  }
}

function mousePressed() {
  let nblocks = [];
  for (let i1 = 0; i1 < blocks.length; i1++) {
    let o1 = blocks[i1];
    if (!o1.touches(mouseX, mouseY)) {
      nblocks.push(o1);
    }
  }
  if (nblocks.length != blocks.length) {
    blocks = nblocks;
  } else {
    newBlock();
  }
}

function newBlock() {
  let o1 = new Block();
  blocks.push(o1);
  o1.x = mouseX - o1.w / 2;
  o1.y = mouseY - o1.h / 2;
  o1.xdir = 0;
  o1.ydir = 0;
  o1.initColor();
  if (blockFlip) {
    let t = o1.w;
    o1.w = o1.h;
    o1.h = t;
    o1.x = mouseX - o1.w / 2;
    o1.y = mouseY - o1.h / 2;
  }
  blockFlip = !blockFlip;
}

function check_collisions() {
  //
  let nowHits = [];
  for (let i1 = 0; i1 < balls.length; i1++) {
    let b1 = balls[i1];
    for (let i2 = i1 + 1; i2 < balls.length; i2++) {
      let b2 = balls[i2];
      if (b1.intersects(b2)) {
        // console.log("hit i1 "+i1+" i2 "+i2+" fc "+frameCount);
        // console.log("x y dir "+b1.x+" "+b1.y+" "+b1.xdir+" "+b2.x+" "+b2.y+" "+b2.xdir);
        b1.bounce();
        b2.bounce();

        let c1 = Object.assign({ i: i1 }, b1);
        let c2 = Object.assign({ i: i2 }, b2);
        nowHits.push([frameCount, c1, c2]);
      }
    }
  }
  check_hit_pairs(nowHits);
}

function check_block_collisions() {
  for (let i1 = 0; i1 < balls.length; i1++) {
    let o1 = balls[i1];
    for (let i2 = 0; i2 < blocks.length; i2++) {
      let o2 = blocks[i2];
      if (o1.intersects(o2)) {
        o1.bounce();
      }
    }
  }
}
function check_hit_pairs(nowHits) {
  if (nowHits.length <= 0) return;
  if (hits.length > 10) {
    hits.splice(0, 1);
  }
  hits.push(nowHits);
  let nhits = new Set();
  for (let ii = 0; ii < hits.length - 1; ii++) {
    let ent1 = hits[ii];
    let ent2 = hits[ii + 1];
    if (ent1.length == ent2.length) {
      for (let i2 = 0; i2 < ent1.length; i2++) {
        let e1 = ent1[i2];
        let e2 = ent2[i2];
        if (e1[0] + 1 == e2[0] && e1[1].i == e2[1].i && e1[2].i == e2[2].i) {
          let hit1 = e1[1].i;
          let hit2 = e1[2].i;
          nhits.add(hit1);
          nhits.add(hit2);
        }
      }
    }
  }
  if (stuckRate && frameCount % stuckRate != 0) return;

  // remove stuck pairs
  if (nhits.size > 0) {
    let nballs = [];
    for (let i1 = 0; i1 < balls.length; i1++) {
      if (!nhits.has(i1)) {
        let b1 = balls[i1];
        nballs.push(b1);
      }
    }
    if (cmsg) {
      console.log('nhits', [...nhits.values()], 'fc', frameCount);
      console.log('nballs', nballs.length, 'balls', balls.length);
    }
    // if (nhits.size > 2) {
    //   noLoop();
    //   return;
    // }
    balls = nballs;
    hits = [];
  }
}

class Ball {
  //
  constructor() {
    this.x = floor(random(0, width));
    this.y = floor(height / 20);
    this.w = floor(random(10, 50));
    this.h = floor(random(10, 50));
    this.xdir = floor(random(-3, 3));
    this.ydir = floor(random(1, 5)); // 3;

    this.color = myColors[colorIndex];
    colorIndex = (colorIndex + 1) % myColors.length;

    let note = notes[noteIndex];
    this.note = new NotePlayer(note, 1000);
    noteIndex = (noteIndex + 1) % notes.length;
  }
  //
  move() {
    this.render();
    this.x = this.x + this.xdir;
    this.y = this.y + this.ydir;
    if (this.y >= height || this.y <= 0) {
      this.bounceY();
    }
    if (this.x >= width || this.x <= 0) {
      this.bounceX();
    }
  }
  nudge() {
    this.x += this.xdir;
    this.y += this.ydir;
  }
  bounceX() {
    this.xdir = this.xdir * -1;
  }
  bounceY() {
    this.ydir = this.ydir * -1;
  }
  render() {
    noStroke();
    fill(this.color);
    let x = this.x + random(-jiggle, jiggle);
    let y = this.y + random(-jiggle, jiggle);
    circle(x, y, this.w);
  }
  isHit(o1) {
    // Test for hit against paddle
    return this.intersects(o1);
    // let x = this.x;
    // let y = this.y;
    // let hitx = x >= paddle.x && x <= paddle.x + paddle.w;
    // let hity = y >= paddle.y && y <= paddle.y + paddle.h;
    // return hitx && hity;
  }
  intersects(o1) {
    // Test of touching second ball based
    // adjust for centered circle
    let x1 = this.x - this.w / 2;
    let y1 = this.y - this.h / 2;
    let x2 = x1 + this.w;
    let y2 = y1 + this.h;
    return pointInRect(x1, y1, o1) || pointInRect(x2, y2, o1);
  }
  bounce() {
    this.playNote();
    this.bounceX();
    this.bounceY();
  }
  playNote() {
    this.note.play();
  }
}

class Block {
  //
  constructor() {
    this.w = 100;
    this.h = 20;
    this.x = mouseX - this.w / 2;
    this.y = height - 50;
    this.color = 0;
  }
  initColor() {
    this.color = myColors[colorIndex];
    colorIndex = (colorIndex + 1) % myColors.length;
  }
  render() {
    fill(this.color);
    rect(this.x, this.y, this.w, this.h);
  }
  touches(x1, y1) {
    return pointInRect(x1, y1, this);
  }
}

class NotePlayer {
  constructor(note, duration) {
    this.note = note;
    this.duration = duration;
    this.duration = 4000;
    this.duration = random([100, 500, 1000]);
    this.osc = new p5.SinOsc();

    // Instantiate the this.env
    this.env = new p5.Envelope();

    this.osc.amp(this.env);
    let freq = midiToFreq(this.note);
    // console.log('freq', freq);
    this.osc.freq(freq);
  }
  play() {
    // console.log("playNote", note, "duration", duration);
    let amp = this.osc.getAmp();
    // console.log("play note", this.note, "getAmp", amp, this.noteStarted);
    // console.log("play note", this.note, "duration", this.duration);

    if (this.noteStarted) {
      // console.log("NotePlayer play return", this.note);
      return;
    }
    this.noteStarted = 1;

    this.osc.start();

    // set attackTime, decayTime, sustainRatio, releaseTime
    let attackTime = 0.001;
    let decayTime = 0.2;
    let susPercent = 0.8;
    let releaseTime = this.duration / 1000; // 0.5;
    this.env.setADSR(attackTime, decayTime, susPercent, releaseTime);

    // this.env.play(this.osc, 0, 0.1);
    this.env.play(this.osc);

    let nthis = this;
    setTimeout(function () {
      nthis.noteStarted = 0;
    }, this.duration);
  }
}

function pointInRect(x1, y1, rt) {
  return (
    x1 >= rt.x && //
    x1 <= rt.x + rt.w &&
    y1 >= rt.y &&
    y1 <= rt.y + rt.h
  );
}

function init_myColors() {
  myColors = ['red', 'green', 'orange', 'purple', 'blue', 'cyan', 'pink'];

  myColors = [];
  for (let ii = 0; ii < 8; ii++) {
    myColors.push([random(0, 200), random(0, 200), random(0, 200)]);
  }
  // shuffle(myColors, true);
}

// BUG: balls can get locked during bounce
// BUG: random burst of new balls at top -keep!-

// --
// FIXED: y bounce too early sometimes

// DONE: multiple paddle-like obstacles that don't move to create mouse rhythms

// DONE: p5.env used to avoid crackle - crackle still present on ball burst
// check_hit_pairs added to remove stuck pairs

// --

// https://editor.p5js.org/jht9629-nyu/sketches/QB13gST05
// Fancy Pong Things

// https://editor.p5js.org/jht9629-nyu/sketches/difxyfpEa
// Fancy Pong collision

// https://p5js.org/examples/hello-p5-song.html

// https://editor.p5js.org/shawn/sketches/eEjPTfJ4N
// Fancy Pong

// Not used
function mousePressed_newBall() {
  trimsBalls();
  let b = new Ball();
  balls.push(b);
  b.x = mouseX;
  b.y = mouseY;
  if (mouseY > height / 2) {
    b.xdir = 0;
  }
}
