// When true, moving the mouse draws on the canvas
let isDrawing = false;
let x = 0;
let y = 0;
const tab = [];
const quests = [
  "apple",
  "Apple",
  "Bowtie",
  "Candle ",
  "Door",
  "Envelope ",
  "Fish",
  "Guitar",
  "IceCream",
  "Lightning",
  "Mountain",
  "Star",
  "Tent",
  "Toothbrush",
  "Wristwatch",
];

let time = 10000000;
const data = new Date().getTime();

const myPics = document.getElementById("canvas");
const context = myPics.getContext("2d");

// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

// Add the event listeners for mousedown, mousemove, and mouseup
const randomQuest = () => {
  return quests[randomInt(0, quests.length)];
};
function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}
const actualQuest = randomQuest();
const start = (e) => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
};
const drawing = (xNew, yNew) => {
  if (isDrawing === true) {
    drawLine(context, x, y, xNew, yNew);
    x = xNew;
    y = yNew;
  }
};

const stop = (e) => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
    socket.send(JSON.stringify(tab));
    console.log(JSON.stringify(tab));
  }
};

const gameStart = () => {
  const timerek = setInterval(function () {
    const now = new Date().getTime();
    const roundTime = data + 24000;
    const distance = Math.floor((roundTime - now) / 1000);
    timer.innerHTML = distance;
    if (distance <= 0) {
      clearInterval(timerek);
      timer.innerHTML = "time over";
      //resetCanvas();
    }
  }, 1000);
};

const resetCanvas = () => {
  tab.splice(0, tab.length);
  context.clearRect(0, 0, canvas.width, canvas.height);
  console.log(tab);
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
    x: x1,
    y: y1,
  };
  context.beginPath();
  context.strokeStyle = "black";
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
  tab.push(cords);
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
    anserw.innerHTML = event.data;
    console.log(event.data);
  };
  socket.onerror = function (event) {
    console.log("error: " + event.data);
  };
}
connect();

var clearButton = document.getElementById("clear");
var anserw = document.getElementById("anserw");
var timer = document.getElementById("timer");
var quest = document.getElementById("quest");
quest.addEventListener("onload", randomQuest);
quest.innerHTML = ` Quest: ${actualQuest}`;

clearButton.addEventListener("click", resetCanvas);

function sendMessage(message) {
  console.log("Sending: " + message);
  socket.send(message);
}
