// https://editor.p5js.org/jht9629-nyu/sketches/oVJEGvodF
// Simple Draw
// issue: on mobile device drags entire window
// tried style: overflow-y: hidden;

var aCanv;

let my = {version: 10, width: 640, height: 480};

function setup() {
  // aCanv = createCanvas(displayWidth, displayHeight);
  
  // simple test for mobile phone
  if (window.screen.width < window.screen.height) {
    my.width = window.screen.width;
    my.height = my.width;
  }
  aCanv = createCanvas(my.width, my.height);
  
  createDiv('Version:'+my.version)
  // createDiv('JHT is here 9').elt.appendChild(aCanv.elt)
  
  strokeWeight(10);
  stroke(0);
  
  //aCanv.mouseMoved(touchMoved2)
  
  let url = 'Simple-Draw.png'
  createImg(url, 'Draw')
  
  aCanv.mouseReleased(canvas_mouseReleased);
}

function mouseDragged() {
  // console.log('mouseDragged');
  // drawPoints.mouseDragged();
  line(mouseX, mouseY, pmouseX, pmouseY);
  return false;
}

function canvas_mouseReleased() {
  // console.log('canvas_mouseReleased');
  // drawPoints.mouseReleased();
}

function draw() {
  // background(255)
  
  fill('red')
  textSize(64)
  // text('Hello', 0, displayHeight/2)
  text('Hello screen', 0, 64)
}


function touchStarted(event) {
  // console.log('touchStarted event', event);
  // prevent default
  // return false; // stops buttons on google Pixel phone
}

function touchEnded() {
  // console.log('touchEnded');
  // drawPoints.mouseReleased();
}

function canvas_touchStarted() {
  console.log('canvas_touchStarted');
  // prevent default
  return false;
}

function canvas_touchEnded() {
  // console.log('canvas_touchEnded');
  // drawPoints.mouseReleased();
}


function touchMoved() {
  console.log('touchMoved');
  line(mouseX, mouseY, pmouseX, pmouseY);
  return false;
}

// https://editor.p5js.org/f3/sketches/B-_Nh-YX0
// Simple Draw

// https://p5js.org/examples/mobile-simple-draw.html
