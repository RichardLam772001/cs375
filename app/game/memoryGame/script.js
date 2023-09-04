const gridDimension = 3;

let pattern = [0, 0, 0, 0];
const patternLength = pattern.length;

//timers
const blinkDuration = 300,
delayBetweenBlinks = 500,
incorrectPenaltyTime = 800;

let table = document.getElementById("container");
for (let i = 0; i < gridDimension; i++) {
    let newRow = document.createElement("tr");
    for (let j = 0; j < gridDimension; j++) {
        let newCol = document.createElement("td");
        newCol.classList.add("canvas");
        newCol.setAttribute("id", `canvas${i*3+j}`);
        newCol.style.margin = "2px";
        newRow.append(newCol);
    }
    table.append(newRow);
}

const messageDisplay = document.getElementById("message-display");

for (let i = 0; i < patternLength; i++) {
    pattern[i] = Math.floor(Math.random() * gridDimension * gridDimension);
    renderPattern();
}
console.log(pattern);

function renderPattern() {
    messageDisplay.innerText = "Memorize the pattern";
    for (let i = 0; i < patternLength; i++) {
        setTimeout(() => {
            const canvas = document.getElementById(`canvas${pattern[i]}`)
            canvas.style.background = "lightgreen";
            setTimeout(() => {
                canvas.style.background = "lightgray";
            }, blinkDuration);
        }, delayBetweenBlinks * i);
    }
    setTimeout(() => {
        enableHandler();
        messageDisplay.innerText = "Repeat the pattern";
    }, delayBetweenBlinks * patternLength);
}

let playerPattern = [];
function enableHandler() {
    for (let i = 0; i < gridDimension * gridDimension; i++) {
        const canvas = document.getElementById(`canvas${i}`)
        canvas.addEventListener("click", handler);
        canvas.number = i;
    }
}

function disableHandler() {
    for (let i = 0; i < gridDimension * gridDimension; i++) {
        const canvas = document.getElementById(`canvas${i}`)
        canvas.removeEventListener("click", handler);
    }
}

function handler(e) {
    let curr = e.currentTarget;
    if (curr.number === pattern[playerPattern.length]) {
        playerPattern.push(curr.number);
        if (playerPattern.length === patternLength) {
            messageDisplay.innerText = "Breach resolved";
            for (let i = 0; i < gridDimension * gridDimension; i++) {
                const canvas = document.getElementById(`canvas${i}`);
                canvas.style.background = "lightgreen";
            }
        } else {
            curr.style.background = "lightgreen";
            setTimeout(() => {
                curr.style.background = "lightgray";
            }, blinkDuration);
        }
    } else {
        if (playerPattern.length < patternLength)
            incorrectTile();
    }
}

function incorrectTile() {
    disableHandler();
    messageDisplay.innerText = "Incorrect";
    for (let i = 0; i < gridDimension * gridDimension; i++) {
        const canvas = document.getElementById(`canvas${i}`);
        canvas.style.background = "red";
        setTimeout(() => {
            canvas.style.background = "lightgray";
        }, delayBetweenBlinks);
    }
    playerPattern = [];
    setTimeout(() => {
        messageDisplay.innerText = "Memorize the pattern"
        renderPattern();
    }, incorrectPenaltyTime);
}