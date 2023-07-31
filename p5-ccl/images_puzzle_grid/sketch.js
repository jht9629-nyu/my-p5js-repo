// https://editor.p5js.org/jht9629-nyu/sketches/1T6gctA4_
// images puzzle grid
// - solve the image puzzle by clicking to swap chips

let my = {
  image_names: [
    // source images
    'jht.jpg',
    // 'henrybb.jpg',
    // 'latimer.jpg',
    // 'woods.jpg',
  ],
  nx: 4, // number of chips horizontally
  ny: 4, // number of chips vertically
  anim_secs: 2, // seconds for animation
};

function preload() {
  // select a random image to preload
  my.image_name = random(my.image_names);
  my.srcImage = loadImage(my.image_name);
}

function setup() {
  my.cnv = createCanvas(390, 600);
  my.cnv.mouseClicked(canvas_mouseClicked);

  init_vars();

  create_ui();

  // show image in original order for a sec before shuffling
  setTimeout(action_shuffle, 1000);
}

function draw() {
  background(220);

  draw_chips();

  draw_clickCount();

  check_completed();
}

function create_ui() {
  createButton('Reload').mouseClicked(action_reload);
  createButton('Shuffle').mouseClicked(action_shuffle);
  createButton('Finish').mouseClicked(action_finish);
  createDiv('Click two chips to swap them<br>v3');
}

function action_reload() {
  location.reload();
}

// check if all chips are in the original order
function check_completed() {
  let count = 0;
  for (let index = 0; index < my.n; index++) {
    let ent = my.chips[index];
    if (ent.index == index) {
      count += 1;
    }
  }
  if (count == my.n && !my.anim_start) {
    draw_completed_msg();
    // my.clickCount = 0;
  }
}

// find and hilight up to two chips
function canvas_mouseClicked() {
  // console.log('canvas_mouseClicked');
  let selected = -1;
  for (let index = 0; index < my.n; index++) {
    let ent = my.chips[index];
    let { x, y } = my.locs[index];
    let inx = mouseX > x && mouseX < x + my.dw;
    let iny = mouseY > y && mouseY < y + my.dh;
    if (inx && iny) {
      // console.log('canvas_mouseClicked index', index);
      selected = index;
    }
  }
  if (selected >= 0) {
    my.selected.push(selected);
  }
  if (my.selected.length >= 2) {
    // second band selected, swap them
    my.clickCount += 1;
    swap_selected_pair();
  }
  return false; // prevent drag on mobile
}

// swap and animate the selected pair in my.selected
function swap_selected_pair() {
  record_prior_index();

  selected_swap();

  anim_duration(my.anim_swap_secs);
}

// swap the two chips given the my.selected indices
function selected_swap() {
  let index1 = my.selected[0];
  let index2 = my.selected[1];
  let ent1 = my.chips[index1];
  let ent2 = my.chips[index2];

  my.chips[index1] = ent2;
  my.chips[index2] = ent1;
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
  init_chips();
}

// split up source image into my.chips
function init_chips() {
  let sw = my.srcImage.width;
  let sh = my.srcImage.height;
  let swn = int(sw / my.nx);
  let shn = int(sh / my.ny);

  let rh = height / sh;
  let nwidth = sw * rh;
  let dw = int(nwidth / my.nx);
  let dh = int(height / my.ny);
  console.log('sw', sw, 'sh', sh, 'swn', swn, 'shn', shn, 'dw', dw, 'dh', dh);

  my.chips = [];
  my.locs = [];
  let sx = 0;
  let sy = 0;
  let dx = 0;
  let dy = 0;
  let index = 0;
  for (; dy < height; index++) {
    let img = createImage(swn, shn);
    // copy(my.srcImage, sx, sy, sw, sh, dx, dy, dw, dh)
    img.copy(my.srcImage, sx, sy, swn, shn, 0, 0, swn, shn);

    my.chips[index] = { img, index, loc_index: index };
    my.locs[index] = { x: dx, y: dy };
    sx += swn;
    dx += dw;
    if (sx + swn > sw) {
      sx = 0;
      dx = 0;
      dy += dh;
      sy += shn;
    }
  }
  my.dw = dw;
  my.dh = dh;
  my.n = index;
  console.log('my.n', my.n);
}

// draw the chips of images
function draw_chips() {
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
    let ent = my.chips[index];
    let { x, y } = my.locs[index];
    if (lapsePercent >= 0) {
      let prior = my.locs[ent.prior_index];
      x = prior.x + (x - prior.x) * lapsePercent;
      y = prior.y + (y - prior.y) * lapsePercent;
    }
    image(ent.img, x, y, my.dw, my.dh);
  }
  // Draw selection
  for (let index of my.selected) {
    let ent = my.chips[index];
    let { x, y } = my.locs[index];
    if (lapsePercent >= 0) {
      let prior = my.locs[ent.prior_index];
      x = prior.x + (x - prior.x) * lapsePercent;
      y = prior.y + (y - prior.y) * lapsePercent;
    }
    image(ent.img, x, y, my.dw, my.dh);
    strokeWeight(10);
    stroke(255);
    noFill();
    rect(x, y, my.dw, my.dh);
  }
}

function loc_by_percent(ent, index, lapsePercent) {
  let { x, y } = my.locs[index];
  if (lapsePercent >= 0) {
    let prior = my.locs[ent.prior_index];
    x = prior.x + (x - prior.x) * lapsePercent;
    y = prior.y + (y - prior.y) * lapsePercent;
  }
  return { x, y };
}

// put the chips of images in random order
function action_shuffle() {
  // keep shuffling until no consecutive chips
  while (1) {
    record_prior_index();
    shuffle(my.chips, true);
    let npairs = 0;
    for (let index = 0; index < my.n; index++) {
      let ent = my.chips[index];
      if (!npairs && index + 1 < my.n) {
        let nent = my.chips[index + 1];
        if (nent.index - 1 == ent.index) {
          npairs++;
        }
      }
    }
    console.log('npairs', npairs);
    if (!npairs) break;
  }
  anim_duration(my.anim_secs);
}

function record_prior_index() {
  for (let index = 0; index < my.n; index++) {
    let ent = my.chips[index];
    ent.prior_index = index;
  }
}

// arrange the chips original order
function action_finish() {
  record_prior_index();
  my.chips.sort((ent1, ent2) => {
    return ent1.index - ent2.index;
  });
  anim_duration(my.anim_secs);
}

// start animation with given durartion in seconds
function anim_duration(duration) {
  my.anim_start = millis();
  my.anim_duration = duration * 1000;
}

// https://editor.p5js.org/jht9629-nyu/sketches/H4XTYK58S
// images puzzle

// https://editor.p5js.org/jht9629-nyu/sketches/6GTcx_Ia6
// images shuffle iOS
// array used to break an image into chips

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
