let i = 0;
let width = 1;
let interval = null;
let progressBar = document.getElementById("progress-bar");

function startProgress() {
    if (i === 0) {
        i = 1;

        // Moves every 3 seconds
        interval = setInterval(pushBar, 30);
    }
}

// Changes the bar and text to a certain percentage until
// it reaches 100%
function pushBar() {
    let elem = document.getElementById("progress-bar");

    // Bar disappears once bar is 100%
    if (width >= 100) { 
        clearInterval(interval);
        i = 0;
        elem.style.display = "none"; 
    }
    // Continues to fill the bar
    else {
        width++;
        elem.style.width = width + "%";
        elem.textContent = width + "%";
        elem.style.display = "block";
    }
}

function startProgressBar() {
    width = 1;
    startProgress();
}