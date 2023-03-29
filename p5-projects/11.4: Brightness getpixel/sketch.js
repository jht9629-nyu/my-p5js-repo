// https://editor.p5js.org/jht9629-nyu/sketches/J7Zhes2Tc
// 11.4: Brightness getpixel

p5.disableFriendlyErrors = true; // disables FES

let video;

let vScale = 16;

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width / vScale, height / vScale);
  noStroke();
  fill(255);
  rectMode(CENTER);

}

function draw() {
  background(51);

  video.loadPixels();
  for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {
      var index = (video.width - x - 1 + y * video.width) * 4;
      var r = video.pixels[index + 0];
      var g = video.pixels[index + 1];
      var b = video.pixels[index + 2];
      var bright = (r + g + b) / 3;

      // let col = video.get(x, y);
      // let bright = (col[0] + col[1] + col[2]) / 3;
      
      let w = map(bright, 0, 255, 0, vScale);

      rect(x * vScale, y * vScale, w, w);
    }
  }
}

// https://editor.p5js.org/jht1493/sketches/XFKWbV01m
// 11.4: Brightness getpixel copy

// 2020-10-25 jht: Correct index, remove unneeed loadPixels
// https://github.com/CodingTrain/website/tree/master/Tutorials/P5JS/p5.js_video