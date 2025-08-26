let canvas = document.getElementById("draw-area");
let ctx = canvas.getContext("2d");

ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.strokeStyle = "black";

let drawing = false;
let hasDrawn = false; // <-- track if user actually signed

// ---------- MOUSE ----------
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});
canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  hasDrawn = true; // mark that user signed
});
canvas.addEventListener("mouseup", () => drawing = false);

// ---------- TOUCH ----------
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  drawing = true;
  let pos = getTouchPos(canvas, e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!drawing) return;
  let pos = getTouchPos(canvas, e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  hasDrawn = true;
});
canvas.addEventListener("touchend", () => drawing = false);

// ---------- HELPERS ----------
function getTouchPos(canvas, touchEvent) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

// ---------- CLEAR ----------
document.getElementById("btn-clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasDrawn = false; // reset flag
});

// ---------- SAVE ----------
document.getElementById("btn-save").addEventListener("click", () => {
  if (!hasDrawn) {
    Swal.fire("Information", "Please sign before saving", "info");
    return;
  }
  let dataURL = canvas.toDataURL("image/png");
  sendSignature(dataURL)

});


async function sendSignature(dataURL) {
   const response = await fetch("/", {
    method: "POST",
    body: JSON.stringify({ image: dataURL }),
    headers: { "Content-Type": "application/json" }
  });
  if (response.ok) {
     Swal.fire("Success", "Image sent to server", "success");
  }else{
     Swal.fire("Error", "Image not sent to server", "error");
  }
    

  
}