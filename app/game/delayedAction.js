//This class works similar to a timeout, but it can be ticked or cancelled

const DelayedAction = (totalTime, onFinish, onCancel) => {

    let isRunning = true;
    let allowCompletion = true; // i.e. Resolving threats may not be finished until minigame is completed
    
    let progress = 0; //goes from 0 to 1

    function tick(deltaSeconds, speedFactor = 1){
        if(!isRunning) return;

        progress = Math.min(1, progress + (deltaSeconds/totalTime)*speedFactor);

        if(progress >= 1 && allowCompletion){
            finish();
        }
    }

    function setOnFinish(func){
        onFinish = func;
    }
    function setOnCancel(func){
        onCancel = func;
    }
    function finish(){
        isRunning = false;
        if(onFinish) onFinish();
    }
    function cancel(){
        isRunning = false;
        if(onCancel) onCancel();
    }
    function getIsRunning(){
        return isRunning;
    }
    function setAllowCompletion(allow){
        allowCompletion = allow;
    }
    function getTotalTime(){return totalTime;};
    function getProgress(){return progress;};

    return {
        tick,
        setOnFinish,
        setOnCancel,
        cancel,
        getIsRunning,
        setAllowCompletion,
        getTotalTime,
        getProgress,
    }
}

module.exports = {DelayedAction};