const canvas = document.getElementById("canvas");
var uri = "ws://" + window.location.host + "/ws";
const ctx = canvas.getContext("2d");
let tab = [];

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
        drawPath(event.data);
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
canvas.addEventListener('mousedown', e => {
    tab = [];
    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;
    const cords = {
        x: x,
        y: y,
    };
    tab.push(cords);
});
canvas.addEventListener('mousemove', e => {
    if (tab.length >= 1) {
        const cords = {
            x: e.clientX - canvas.offsetLeft,
            y: e.clientY - canvas.offsetTop,
        };
        drawLine(ctx, tab[tab.length - 1].x, tab[tab.length - 1].y,
            cords.x, cords.y);
        tab.push(cords);
    }
});
canvas.addEventListener('mouseup', e => {
    console.log(JSON.stringify(tab));
    sendMessage(JSON.stringify(tab));
    tab = [];
});

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}
function drawPath(pathJsonString) {
    console.log(pathJsonString);
    const path = JSON.parse(pathJsonString);
    for (var i = 1; i < path.length; i++) {
        drawLine(ctx, path[i - 1].x, path[i - 1].y, path[i].x, path[i].y);
    }
}
//const draw = (e) => {
//  let x = e.clientX - canvas.offsetLeft;
//  let y = e.clientY - canvas.offsetTop;
//  const cords = {
//    x: x,
//    y: y,
//  };
//  tab.push(cords);
//  if (tab.length > 1) {
//    ctx.beginPath();
//    ctx.moveTo(tab[tab.length - 2].x, tab[tab.length - 2].y);
//    ctx.lineTo(tab[tab.length - 2].x, tab[tab.length - 2].y);
//    ctx.lineTo(tab[tab.length - 1].x, tab[tab.length - 1].y);
//    ctx.stroke();

//    tab.splice(tab[tab.length - 1], 2);
//  }
//};
