
// https://editor.p5js.org/jht9629-nyu/sketches/0OHUgo_c6
// image preload  array copy

let img;
let imgs = [];
let n = 5;

function preload() {
  img = loadImage("jht-w128.png");
}
function setup() {
  createCanvas(400, 400);

  let w = img.width;
  let h = img.height;
  console.log("w", w, "h", h);

  let s = int(h / n);

  for (let i = 0; i < n; i++) {
    imgs[i] = createImage(w, s);
    imgs[i].copy(img, 0, s*i, w, s, 0, 0, w, s);
  }
  
  // img1 = createImage(w, hh);
  // img2 = createImage(w, hh);
  // img3 = createImage(w, hh);
  // img4 = createImage(w, hh);

  // copy(srcImage, sx, sy, sw, sh, dx, dy, dw, dh)
  // img1.copy(img, 0, 0, w, s, 0, 0, w, s);
  // img2.copy(img, 0, s, w, s, 0, 0, w, s);
  // img3.copy(img, 0, s * 2, w, s, 0, 0, w, s);
  // img4.copy(img, 0, s * 3, w, s, 0, 0, w, s);
}

function draw() {
  background(220);

  image(img, 0, 0);

  let w = img.width;
  let h = img.height;
  
  let s = int(h / n) * 2;

  for (let i = 0; i < n; i++) {
    image(imgs[i], w, s*i);
  }
  // image(img1, w, 0);
  // image(img2, w, hs);
  // image(img3, w, hs * 2);
  // image(img4, w, hs * 3);
}

// https://editor.p5js.org/jht9629-nyu/sketches/P-AHc4NF9
