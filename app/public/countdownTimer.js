const timerData = {
    name: "timer",
    time: {
        "minutes": 4,
        "seconds": 0,
        "countdown": () => {
            const timeElem = document.getElementById("timer");
            let mins = timerData.time.minutes;
            let secs = timerData.time.seconds;

            let interval = setInterval(() => {
                if (secs > 0) {
                    secs--;
                }
                else if (mins > 0) {
                    mins--;
                    secs = 59;
                }
                else {
                    clearInterval(interval);
                }

                timeElem.textContent = `${mins} minutes ${secs} seconds`;
            }, 1000);
        }
    }
};

timerData.time.countdown();