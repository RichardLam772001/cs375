// Displays the description, time remaining, and progress bar for the current action

const ACTION_TRACKER = (() => {

    const TICK_RATE = 25;

    const rootElement = document.getElementById("action-tracker");

    const descriptionElement = document.createElement("div");
    rootElement.appendChild(descriptionElement);

    const progressBarElement = document.createElement("div");
    rootElement.appendChild(progressBarElement);
    progressBarElement.id = "progress-bar";
    const PROGRESS_BAR = ProgressBar(progressBarElement);

    let interval = null;
    let allowCompletion = true;

    let progress = 0;
    let totalTime = 0;
    let speedFactor = 1;

    setVisible(false);

    function tick(deltaSeconds){
        progress = Math.min(1, progress + (deltaSeconds/totalTime)*speedFactor);

        if(progress >= 1){
            if(allowCompletion){
                stopBar();
            }
            return;
        }
        updateProgress();
    }
    function updateProgress(){
        PROGRESS_BAR.setFillRatio(progress);
        PROGRESS_BAR.setMessage(Math.round(timeLeft())+"s");
    }
    function timeLeft(){
        return (1 - progress)*totalTime/speedFactor;
    }

    function setDelayData(delayData){
        console.log("set data: "+delayData);
        setDescription(delayData.description);

        totalTime = delayData.time;
        progress = delayData.progress;
        speedFactor = delayData.speedFactor;
        setBarColorFromSpeedFactor(speedFactor);
        allowCompletion = true;
        
        if(totalTime > 0 && speedFactor > 0){
            startBar();
        }else{
            stopBar();
        }
    }
    function setBarColorFromSpeedFactor(speedFactor){
        progressBarElement.classList.remove("fast", "slow");
        if(speedFactor > 1){
            progressBarElement.classList.add("fast");
        }else if(speedFactor < 1){
            progressBarElement.classList.add("slow");
        }
    }

    function setVisible(v){
        rootElement.style.visibility = v ? "visible" : "hidden";
    }

    function setDescription(description){
        descriptionElement.textContent = description;
    }

    function stopBar() {
        clearInterval(interval);
        interval = null;
        setVisible(false);
    }

    function startBar() {
        stopBar();
        updateProgress();
        setVisible(true);
        interval = setInterval(()=>tick(TICK_RATE*0.001), TICK_RATE);   
    }

    return {
        setDelayData,
    }

})();

function ProgressBar(progressBar){
    
    function setFillRatio(fillRatio){
        progressBar.style.width = fillRatio*100 + "%";
    }
    function setMessage(message){
        progressBar.textContent = message;
    }

    return {
        setFillRatio,
        setMessage,
    }
};