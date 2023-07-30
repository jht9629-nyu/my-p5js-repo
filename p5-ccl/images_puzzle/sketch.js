// https://editor.p5js.org/jht9629-nyu/sketches/H4XTYK58S
// images puzzle
// - solve the image puzzle by clicking to swap bands

let my = {
  n: 10, // number of bands for the source image
  anim_secs: 2, // seconds for animation
  startup_secs: 1, // seconds to pause at startup
  image_names: ['jht.png', 'henrybb.jpg', 'latimer.jpg', 'woods.jpg'],
};

// preload the image my.image_name
function preload() {
  my.image_name = random(my.image_names);
  my.srcImage = loadImage(my.image_name);
}

function setup() {
  my.cnv = createCanvas(390, 600);
  my.cnv.mouseClicked(canvas_mouseClicked);

  init_vars();

  create_ui();

  // show image in original order for a sec
  setTimeout(action_shuffle, my.startup_secs * 1000);
}

function draw() {
  background(220);

  draw_bands();

  draw_clickCount();

  check_completed();
}

function create_ui() {
  createButton('Shuffle').mouseClicked(action_shuffle);
  createButton('Finish').mouseClicked(action_finish);
  createDiv('Click two bands to swap<br>v2');
}

function check_completed() {
  let count = 0;
  for (let index = 0; index < my.n; index++) {
    let ent = my.bands[index];
    if (ent.index == index) {
      count += 1;
    }
  }
  if (count == my.n && !my.anim_start) {
    draw_completed_msg();
    // my.clickCount = 0;
  }
}

// find and hilight up to two bands
function canvas_mouseClicked() {
  // console.log('canvas_mouseClicked');
  let selected = -1;
  for (let index = 0; index < my.n; index++) {
    let ent = my.bands[index];
    // ent.x, y, my.dw, my.dh
    let inx = mouseX > ent.x && mouseX < ent.x + my.dw;
    let iny = mouseY > ent.y && mouseY < ent.y + my.dh;
    if (inx && iny) {
      // console.log('canvas_mouseClicked index', index);
      selected = index;
    }
  }
  if (selected >= 0) {
    my.selected.push(selected);
  }
  if (my.selected.length >= 2) {
    my.clickCount += 1;
    swap_selected_pair();
  }
  return false; // prevent drag on mobile
}

// swap and animate the selected pair in my.selected
function swap_selected_pair() {
  anim_location_prep();

  selected_swap();

  anim_duration(my.anim_swap_secs);
}

// initialize y_prior for animation in all the bands
function anim_location_prep() {
  for (let index = 0; index < my.n; index++) {
    let ent = my.bands[index];
    ent.y_prior = ent.y;
  }
}

// swap the two bands given in my.selected indices
function selected_swap() {
  let index1 = my.selected[0];
  let index2 = my.selected[1];
  let ent1 = my.bands[index1];
  let ent2 = my.bands[index2];

  ent1.y_prior = ent1.y;
  ent1.y = my.dh * index2;

  ent2.y_prior = ent2.y;
  ent2.y = my.dh * index1;

  my.bands[index1] = ent2;
  my.bands[index2] = ent1;
}

function draw_completed_msg() {
  fill(255);
  strokeWeight(1);
  textSize(my.message_h);
  text('Finished!', width / 2, height - textDescent());
}

function draw_clickCount() {
  fill(255);
  strokeWeight(1);
  textSize(my.message_h);
  text(my.clickCount, 10, height - textDescent());
}

function init_vars() {
  my.anim_swap_secs = my.anim_secs / 2;
  my.message_h = 30;
  my.selected = [];
  my.clickCount = 0;
  init_bands();
}

// copy source image into my.bands
function init_bands() {
  let sw = my.srcImage.width;
  let sh = my.srcImage.height;
  let shn = int(sh / my.n);

  let rh = height / sh;
  my.dw = sw * rh;
  my.dh = int(height / my.n);
  console.log('sw', sw, 'sh', sh, 'shn', shn, 'dh', my.dh);

  my.bands = [];
  for (let index = 0; index < my.n; index++) {
    let img = createImage(sw, shn);
    let sx = 0;
    let sy = shn * index;
    // copy(my.srcImage, sx, sy, sw, sh, dx, dy, dw, dh)
    img.copy(my.srcImage, sx, sy, sw, shn, 0, 0, sw, shn);

    let x = 0;
    let y = my.dh * index;
    my.bands[index] = { img, index, x, y };
  }
}

// draw the bands of images
function draw_bands() {
  let lapsePercent = -1;
  // for animation calc lapsePercent = 0..1
  if (my.anim_start) {
    let now = millis();
    lapsePercent = (now - my.anim_start) / my.anim_duration;
    if (lapsePercent > 1) {
      // End of animation
      delete my.anim_start;
      lapsePercent = -1;
      if (my.selected.length >= 2) {
        my.selected = [];
      }
    }
  }
  for (let index = 0; index < my.n; index++) {
    let ent = my.bands[index];
    let y = ent.y;
    if (lapsePercent >= 0) {
      y = ent.y_prior + (ent.y - ent.y_prior) * lapsePercent;
    }
    image(ent.img, ent.x, y, my.dw, my.dh);
  }
  // Draw selection
  for (let index of my.selected) {
    let ent = my.bands[index];
    let y = ent.y;
    if (lapsePercent >= 0) {
      y = ent.y_prior + (ent.y - ent.y_prior) * lapsePercent;
    }
    image(ent.img, ent.x, y, my.dw, my.dh);
    strokeWeight(10);
    stroke(255);
    noFill();
    rect(ent.x, ent.y, my.dw, my.dh);
  }
}

// put the bands of images in random order
function action_shuffle() {
  shuffle(my.bands, true);
  for (let index = 0; index < my.n; index++) {
    let ent = my.bands[index];
    ent.y_prior = ent.y;
    ent.y = my.dh * index;
  }
  anim_duration(my.anim_secs);
}

// arrange the bands original order
function action_finish() {
  my.bands.sort((ent1, ent2) => {
    return ent1.index - ent2.index;
  });
  for (let index = 0; index < my.n; index++) {
    let ent = my.bands[index];
    ent.y_prior = ent.y;
    ent.y = my.dh * index;
  }
  anim_duration(my.anim_secs);
}

// start animation with given durartion in seconds
function anim_duration(duration) {
  my.anim_start = millis();
  my.anim_duration = duration * 1000;
}

// https://editor.p5js.org/jht9629-nyu/sketches/6GTcx_Ia6
// images shuffle iOS
// array used to break an image into bands

// copy(my.srcImage, sx, sy, sw, sh, dx, dy, dw, dh)

// image(img, x, y, [width], [height])
// image(img, dx,dy,dWidth,dHeight, sx,sy,sWidth,sHeight...

// Henry Box Brown image source:
// https://www.neh.gov/humanities/2013/mayjune/statement/end

// JHT image source:
// http://www.johnhenrythompson.com/0-refections-on-learning

// Lewis Latimer image source:
// https://en.wikipedia.org/wiki/Lewis_Howard_Latimer

// Granville T Woods image source:
// https://en.wikipedia.org/wiki/Granville_Woods
