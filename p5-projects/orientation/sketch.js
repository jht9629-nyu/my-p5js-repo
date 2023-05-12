// https://editor.p5js.org/jht9629-nyu/sketches/TXvXSJY6L
// rotationXYZ

let my = { width: 400, height: 400, rotX: 1, rotY: 0, rotZ: 0 };

function setup() {
  createCanvas(my.width, my.height, WEBGL);

  normalMaterial();

  create_ui();
}

function draw() {
  background(200);
  if (my.rotZ) rotateZ(radians(rotationZ));
  if (my.rotX) rotateX(radians(rotationX));
  if (my.rotY) rotateY(radians(rotationY));
  box(200, 200, 200);

  update_checkBox('X');
  update_checkBox('Y');
  update_checkBox('Z');
}

function create_ui() {
  my.permBtn = createButton('permission');
  my.permBtn.mousePressed(permissionAction);

  my.chkX = create_checkBox('rotX');
  my.chkY = create_checkBox('rotY');
  my.chkZ = create_checkBox('rotZ');
}

let cthis;

function create_checkBox(prop) {
  let chk = createCheckbox(prop, my[prop]);
  // chk.style('display:inline');
  chk.changed(function () {
    my[prop] = this.checked();
    cthis = this;
  });
  return chk;
}

// <div>
//   <label>
//     <input type="checkbox">
//     <span>rotY</span>
//   </label>
// </div>
// cthis.elt.firstChild.childNodes[1].innerHTML

function update_checkBox(prop) {
  let ref = my['chk' + prop];
  let val = window['rotation' + prop];
  let isChecked = ref.checked();
  let str = 'rot' + prop;
  if (isChecked) str += ' ' + val.toFixed(3);
  ref.elt.firstChild.childNodes[1].innerHTML = str;
}

// Need for iOS mobile device to get motion events
function permissionAction() {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    // (optional) Do something before API request prompt.
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        console.log('requestPermission response', response);
        // (optional) Do something after API prompt dismissed.
        if (response == 'granted') {
          window.addEventListener('devicemotion', (e) => {
            // console.log('devicemotion e', e)
            // console.log('devicemotion e.beta', e.beta)
          });
        }
      })
      .catch(console.error);
  } else {
    alert('DeviceMotionEvent is not defined');
  }
}

// https://p5js.org/reference/#/p5/rotationX

// https://editor.p5js.org/jht9629-nyu/sketches/G6Zr5SBuq
// rotationX
