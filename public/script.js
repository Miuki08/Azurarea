const socket = io();
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');
const eraserBtn = document.getElementById('eraserBtn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let currentColor = colorPicker.value;
let currentSize = brushSize.value;
let erasing = false;

// Event listeners
colorPicker.addEventListener('input', () => {
  currentColor = colorPicker.value;
  erasing = false; // kembali ke brush jika pilih warna
  eraserBtn.classList.remove('active');
});

brushSize.addEventListener('input', () => currentSize = brushSize.value);

eraserBtn.addEventListener('click', () => {
  erasing = !erasing;
  if (erasing) {
    eraserBtn.classList.add('active');
  } else {
    eraserBtn.classList.remove('active');
  }
});

clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.emit('clearBoard');
});

// Drawing events
canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;

  const pos = { 
    x: e.clientX, 
    y: e.clientY,
    color: erasing ? "#FFFFFF" : currentColor,
    size: currentSize
  };

  ctx.lineWidth = pos.size;
  ctx.lineCap = 'round';
  ctx.strokeStyle = pos.color;
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);

  socket.emit('drawing', pos);
}

// Socket events
socket.on('drawing', (pos) => {
  ctx.lineWidth = pos.size;
  ctx.lineCap = 'round';
  ctx.strokeStyle = pos.color;
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});

socket.on('clearBoard', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
