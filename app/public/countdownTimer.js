const timerData = {
    name: "timer",
    time: {
        "minutes": 0,
        "seconds": 12,
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
                    timeElem.textContent = `Time is up: Player Wins`;
                    return;
                }

                timeElem.textContent = `0${mins}:${secs}`;
                if (secs < 10) {
                    timeElem.textContent = `0${mins}:0${secs}`
                }
            }, 1000);
        }
    }
};

timerData.time.countdown();