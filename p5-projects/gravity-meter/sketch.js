// https://editor.p5js.org/jht9629-nyu/sketches/bpsB_xmSH
// gravity-meter

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
  update_checkBox('chkX', 'rotationX', 'rotX');
  update_checkBox('chkY', 'rotationY', 'rotY');
  update_checkBox('chkZ', 'rotationZ', 'rotZ');
  update_checkBox('chkAccelX', 'accelerationX', 'accelX');
  update_checkBox('chkAccelY', 'accelerationY', 'accelY');
  update_checkBox('chkAccelZ', 'accelerationZ', 'accelZ');
}

function create_ui() {
  my.permBtn = createButton('permission');
  my.permBtn.mousePressed(permissionAction);
  my.chkX = create_checkBox('rotX');
  my.chkY = create_checkBox('rotY');
  my.chkZ = create_checkBox('rotZ');
  createElement('br');
  my.chkAccelX = create_checkBox('accelX');
  my.chkAccelY = create_checkBox('accelY');
  my.chkAccelZ = create_checkBox('accelZ');
}

function create_checkBox(prop) {
  let chk = createCheckbox(prop, my[prop]);
  chk.changed(function () {
    my[prop] = this.checked();
  });
  return chk;
}

function update_checkBox(chkProp, valProp, label) {
  //
  let ref = my[chkProp];
  let val = window[valProp];
  let isChecked = ref.checked();
  let str = label;
  if (isChecked) str += ' ' + val.toFixed(3);
  ref.elt.firstChild.lastChild.innerHTML = str;
}

// <div>
//   <label>
//     <input type="checkbox">
//     <span>rotY</span>
//   </label>
// </div>
// cthis.elt.firstChild.childNodes[1].innerHTML

function update_checkBox1(prop) {
  let ref = my['chk' + prop];
  let val = window['rotation' + prop];
  let isChecked = ref.checked();
  let str = 'rot' + prop;
  if (isChecked) str += ' ' + val.toFixed(3);
  ref.elt.firstChild.lastChild.innerHTML = str;
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

// https://editor.p5js.org/jht9629-nyu/sketches/TXvXSJY6L
// rotationXYZ

// https://p5js.org/reference/#/p5/rotationX

// https://editor.p5js.org/jht9629-nyu/sketches/G6Zr5SBuq
// rotationX
