// https://editor.p5js.org/jht1493/sketches/TtXLXAiJv
// IMS - Truchet Vamoss
// https://openprocessing.org/sketch/1354815
// Truchet in p5js by Vamoss

var aleatorios = []
var tamanhoDoGrid = 21

function setup() {
  createCanvas(400, 400)
  noStroke()
	
  for(var x=0; x < width; x += tamanhoDoGrid){
    for(var y=0; y < height; y += tamanhoDoGrid){
      aleatorios.push(floor(random(2)))
    }
  }
}

function draw() {
  background(100)
	
  var transparenciaRegular = map(mouseX, 0, width, 255, 0)
  var transparenciaAleatoria = map(mouseY, 0, height, 255, 0)
	
  var indice = 0
  for(var x = 0; x<width; x+=tamanhoDoGrid){
    for(var y = 0; y<height; y+=tamanhoDoGrid){
      if (aleatorios[indice] == 0) fill(255, transparenciaAleatoria)
      else fill(0, transparenciaAleatoria)
      rect(x, y, tamanhoDoGrid, tamanhoDoGrid)
      indice++
    }
  }
	
  for(var x = 0; x <= width; x += tamanhoDoGrid){
    for(var y = 0; y <= height; y += tamanhoDoGrid){
      if ((x+y)%2 ==0) fill(255, transparenciaRegular)
      else fill(0, transparenciaRegular)
      circle(x, y, tamanhoDoGrid)
    }
  }
}