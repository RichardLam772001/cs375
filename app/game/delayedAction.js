//This class works similar to a timeout, but it can be ticked or cancelled

const DelayedAction = (remainingTime, onFinish, onCancel) => {

    let isRunning = true;
    let allowCompletion = true; // i.e. Resolving threats may not be finished until minigame is completed

    function tick(deltaSeconds, speedFactor = 1){
        if(!isRunning) return;
        remainingTime -= deltaSeconds*speedFactor;
        if(remainingTime <= 0 && allowCompletion){
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

    return {
        tick,
        setOnFinish,
        setOnCancel,
        cancel,
        getIsRunning,
        setAllowCompletion,
    }
}

module.exports = {DelayedAction};