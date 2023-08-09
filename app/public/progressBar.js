const PROGRESS_BAR = ((progressBar) => {
    let width = 1;
    let interval = null;
    let tickrate = 30;
    let timeTaken = 0;

    if (!interval) {
        interval = setInterval(pushBar, tickrate);
    }

    function pushBar(milliseconds) {
        if (width >= 100) {
            clearInterval(interval);
            interval = null;
        }
        else {
            width++;
            progressBar.style.width = width + "%";
            if (width === 33 || width === 66 || width === 100) {
                timeTaken++;
                progressBar.textContent =  timeTaken + "secs";
            }
        }
    }
});