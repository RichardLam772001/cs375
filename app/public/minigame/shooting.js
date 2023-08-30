const targetWidth = 60,
targetHeight = 60;

const canvas = document.getElementById("canvas"),
canvasLeft = canvas.offsetLeft + canvas.clientLeft,
canvasTop = canvas.offsetTop + canvas.clientTop,
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let target = createTarget();
renderNewTarget(target);
let count = 0;

function getRandomPosX() {
    const pos = Math.floor(Math.random() * (canvas.width - targetWidth));
    return pos;
}

function getRandomPosY() {
    const pos = Math.floor(Math.random() * (canvas.height - targetHeight));
    return pos;
}

function createTarget() {
    const newTarget = {
        color: "red",
        width: targetWidth,
        height: targetHeight,
        left: getRandomPosX(),
        top: getRandomPosY()
    };
    return newTarget;
}

async function renderNewTarget(target) {
    ctx.fillStyle = target.color;
    ctx.fillRect(target.left, target.top, target.width, target.height);
}

canvas.addEventListener("click", (event) => {
    const x = event.pageX - canvasLeft,
    y = event.pageY - canvasTop;
    //check if click is inside canvas element with respect to offset from document body
    if (x > target.left &&
        x < target.left + target.width &&
        y > target.top &&
        y < target.top + target.height) {
        if (count < 11) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            target = createTarget();
            renderNewTarget(target);
            count++;
        } else {
            count++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.background = "lightgreen";
        }
    }
});