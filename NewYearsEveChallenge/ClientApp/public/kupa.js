const canvas = document.getElementById("canvas");
const tab = [];
const draw = (e) => {
  const ctx = canvas.getContext("2d");

  let x = e.clientX - canvas.offsetLeft;
  let y = e.clientY - canvas.offsetTop;
  const cords = {
    x: x,
    y: y,
  };
  tab.push(cords);
  if (tab.length > 1) {
    ctx.beginPath();
    ctx.moveTo(tab[tab.length - 2].x, tab[tab.length - 2].y);
    ctx.lineTo(tab[tab.length - 2].x, tab[tab.length - 2].y);
    ctx.lineTo(tab[tab.length - 1].x, tab[tab.length - 1].y);
    ctx.stroke();

    tab.splice(tab[tab.length - 1], 2);
  }
};
