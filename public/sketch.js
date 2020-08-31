
const serverUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://' + window.location.hostname;

const team = window.location.pathname.split("/")[3] || 'all-together';

let socket;
let button;
var input;
let slider;
let colPic;

function setup() {
  const p5Renderer = createCanvas(windowWidth, windowHeight);
  const canvas = p5Renderer.canvas;
  canvas.addEventListener('touchstart', function(event) {
    event.preventDefault();  
  });
  
  button = createButton('Clear Canvas');
  button.position(30, 80);
button.mousePressed(function(){createCanvas(windowWidth, windowHeight);background(255)});

 colPic = createColorPicker("black"); 
  colPic.position(30, 50);
  
  slider = createSlider( 5, 200, 5)
  slider.position(30, 160);
  
  input = createInput('Text')
  input.position(30, 110);
  
  background(255);
  frameRate(30);

  socket = io.connect(serverUrl);
  socket.on('connect', function() {
    console.log('Connected to team:', team);
    socket.emit('team', team);
  });
  socket.on('mouse', drawOther, clearDrawings);

 }

function mouseDragged() {
  const data = {
    team: team,
    mouseX: mouseX,
    mouseY: mouseY,
    pmouseX: pmouseX,
    pmouseY: pmouseY,
    mousePressed: true
  };
  socket.emit('mouse', data);

  drawLine(mouseX, mouseY, pmouseX, pmouseY);
}

function mouseReleased(){
  const data = {
    team: team,
    mouseX: mouseX,
    mouseY: mouseY,
    pmouseX: pmouseX,
    pmouseY: pmouseY,
    mousePressed: false
  };
  socket.emit('mouse', data);
}

function drawOther(data) {
  drawLine(data.mouseX, data.mouseY, data.pmouseX, data.pmouseY);
}


function drawLine(x1, y1, x2, y2, col) {

  line(x1, y1, x2, y2);
  stroke(colPic.color());
    strokeWeight(slider.value());
  
}

function clearDrawings () {
    button.mousePressed();
  clear();
   };

function draw() {
  
   text(input.value(), 100, 200);
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
