// Welcome to the p5.play Version 3!

// Please look at the reference documentation on the learn section of
// the website first: https://p5play.org/learn

function setup() {
  new Canvas();
}

function draw() {
  clear(); // try removing this line and see what happens!

  fill(0);
  textSize(48);
  textAlign(CENTER);
  fill(200);
  text('Click to create a new sprite', width / 2, height / 2);

  // check if the left mouse button was pressed
  if (mouse.presses()) {
    // creates a new sprite at the mouse's position
    let sprite = new Sprite(mouse.x, mouse.y, 30, 30);
    // try editing the sprite's size!

    // by default sprites are displayed as simple shapes
    // that have a random fill color

    // sprites have many properties you can edit
    // here the x and y velocities of the sprite are edited
    sprite.vel.x = random(-5, 5);
    sprite.vel.y = random(-5, 5);
    // try editing the sprite's speed!

    // Sprites collide by default in p5play v3.
    // Try playing this example and see if you can keep one of the
    // squares from leaving the p5.js canvas!
  }

  // by default, all sprites are drawn by p5play
  // after the end of the draw loop
}

// https://openprocessing.org/sketch/1866664
// login and use the download option
// 2023-07-30 jht: Corrected script include in index.html to get scripts to load

// https://p5play.org
