const socket = io();
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let currentColor = colorPicker.value;
let currentSize = brushSize.value;

colorPicker.addEventListener('input', () => currentColor = colorPicker.value);
brushSize.addEventListener('input', () => currentSize = brushSize.value);

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clearBoard');
});

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
        color: currentColor,
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
