const PROGRESS_BAR = ((progressBar) => {
    let width = 1;
    let interval = null;
    let tickrate = 30;
    let timeTaken = 0;

    function pushBar() {
        if (width === 100) {
            stopBar();
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

    function stopBar() {
        clearInterval(interval);
        interval = null;
    }

    function resetBar() {
        width = 1;
        timeTaken = 0;
        clearInterval(interval);
        interval = null;
        progressBar.textContent = "";
        startFill();
    }

    function startFill() {
        if (!interval) {
            interval = setInterval(pushBar, tickrate);        
        }
        else if (width != 100) {
            resetBar();
        }
    }

    return {
        startFill
    }
});