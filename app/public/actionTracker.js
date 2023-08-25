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

    let totalTime = 0;
    let timeRemaining = 0;
    let interval = null;
    let allowCompletion = true;

    

    function startFromTime(t){
        totalTime = t;
        timeRemaining = totalTime;
        startFill();
    }

    function tick(deltaSeconds){
        timeRemaining = Math.max(timeRemaining-deltaSeconds, 0);
        if(timeRemaining <= 0){
            if(allowCompletion){
                stopBar();
                setVisible(false);
            }
            return;
        }
        PROGRESS_BAR.setFillRatio(1-timeRemaining/totalTime);
        PROGRESS_BAR.setMessage(Math.round(timeRemaining)+"s");
    }

    function setDelayData(delayData){
        console.log("delay data: "+delayData);
        setDescription(delayData.description);
        startFromTime(delayData.time);
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
    }

    function startFill() {
        PROGRESS_BAR.setFillRatio(0);
        setVisible(true);
        stopBar();
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