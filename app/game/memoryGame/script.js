const canvas0 = document.getElementById("canvas0"),
canvas1 = document.getElementById("canvas1"),
canvas2 = document.getElementById("canvas2"),
canvas3 = document.getElementById("canvas3"),
canvas4 = document.getElementById("canvas4"),
canvas5 = document.getElementById("canvas5"),
canvas6 = document.getElementById("canvas6"),
canvas7 = document.getElementById("canvas7"),
canvas8 = document.getElementById("canvas8");

let pattern = [0, 0, 0, 0, 0];
for (let i = 0; i < 5; i++) {
    pattern[i] = Math.floor(Math.random() * 9);
    renderPattern();
}
console.log(pattern);

function renderPattern() {
    for (let i = 0; i < pattern.length; i++) {
        setTimeout(() => {
            const canvas = document.getElementById(`canvas${pattern[i]}`)
            canvas.style.background = "lightgreen";
            setTimeout(() => {
                canvas.style.background = "lightgray";
            }, 1000);
        }, 1200 * i);
    }
    setTimeout(() => {
        enableHandler();
    }, 6000);
}

let playerPattern = [];
function enableHandler() {
    for (let i = 0; i < 9; i++) {
        const canvas = document.getElementById(`canvas${i}`)
        canvas.addEventListener("click", handler);
        canvas.number = i;
    }
}

function disableHandler() {
    for (let i = 0; i < 9; i++) {
        const canvas = document.getElementById(`canvas${i}`)
        canvas.removeEventListener("click", handler);
    }
}

function handler(e) {
    let curr = e.currentTarget;
    if (curr.number === pattern[playerPattern.length]) {
        playerPattern.push(curr.number);
        if (playerPattern.length === 5) {
            board = document.querySelectorAll("canvas");
            for (let tile of board) {
                tile.style.background = "lightgreen";
            }
        } else {
            curr.style.background = "lightgreen";
            setTimeout(() => {
                curr.style.background = "lightgray";
            }, 200);
        }
    } else {
        if (playerPattern.length < 5)
            incorrectTile();
    }
}

function incorrectTile() {
    disableHandler();
    for (let i = 0; i < 9; i++) {
        const canvas = document.getElementById(`canvas${i}`);
        canvas.style.background = "red";
        setTimeout(() => {
            canvas.style.background = "lightgray";
        }, 500);
    }
    playerPattern = [];
    setTimeout(() => {
        renderPattern();
    }, 800);
}