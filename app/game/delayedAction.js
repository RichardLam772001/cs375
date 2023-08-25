//This class works similar to a timeout, but it can be ticked or cancelled

const DelayedAction = (remainingTime) => {

    let onFinish;
    let onCancel;

    let isRunning = true;

    function tick(deltaSeconds, speedFactor = 1){
        if(!isRunning) return;
        remainingTime -= deltaSeconds*speedFactor;
        if(remainingTime <= 0){
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

    return {
        tick,
        setOnFinish,
        setOnCancel,
        cancel,
        getIsRunning
    }
}

module.exports = {DelayedAction};