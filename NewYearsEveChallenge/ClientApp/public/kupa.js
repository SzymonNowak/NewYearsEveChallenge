// When true, moving the mouse draws on the canvas
let isDrawing = false;
let x = 0;
let y = 0;

const myPics = document.getElementById("canvas");
const context = myPics.getContext("2d");

// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

// Add the event listeners for mousedown, mousemove, and mouseup

const start = (e) => {
  console.log("start");
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
};
const drawing = (xNew, yNew) => {
  console.log("draw", xNew, yNew);

  if (isDrawing === true) {
    drawLine(context, x, y, xNew, yNew);
    x = xNew;
    y = yNew;
  }
};

const stop = (e) => {
  console.log("stop");

  if (isDrawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
};

myPics.addEventListener("mousedown", start);
myPics.addEventListener("touchstart", start);

myPics.addEventListener("mousemove", (e) => {
  drawing(e.offsetX, e.offsetY);
});
myPics.addEventListener("touchmove", (e) => {
  drawing(e.touches[0].clientX, e.touches[0].clientY);
});

window.addEventListener("mouseup", stop);
window.addEventListener("touchend", stop);

function drawLine(context, x1, y1, x2, y2) {
  const cords = {
    x1: x1,
    x2: x2,
    y1: y1,
    y2: y2,
  };
  context.beginPath();
  context.strokeStyle = "black";
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  socket.send(JSON.stringify(cords));
  context.closePath();
}

var uri = "ws://" + window.location.host + "/ws";
function connect() {
  socket = new WebSocket(uri);
  socket.onopen = function (event) {
    console.log("opened connection to " + uri);
  };
  socket.onclose = function (event) {
    console.log("closed connection from " + uri);
  };
  socket.onmessage = function (event) {
    appendItem(list, event.data);
    console.log(event.data);
  };
  socket.onerror = function (event) {
    console.log("error: " + event.data);
  };
}
connect();
var list = document.getElementById("messages");
var button = document.getElementById("sendButton");
button.addEventListener("click", function () {
  var input = document.getElementById("textInput");
  sendMessage(input.value);

  input.value = "";
});
function sendMessage(message) {
  console.log("Sending: " + message);
  socket.send(message);
}
function appendItem(list, message) {
  var item = document.createElement("li");
  item.appendChild(document.createTextNode(message));
  list.appendChild(item);
}
