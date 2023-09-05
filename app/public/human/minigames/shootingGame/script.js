const SHOOTING_GAME = (() => {
    const targetWidth = 60, targetHeight = 60;
    
    const TARGETS_TO_HIT = 4;

    const minigameElement = document.getElementById("shooting-minigame");
    const messageElement = minigameElement.getElementsByClassName("minigame-message")[0];

    const canvas = document.getElementById("shoot-canvas"),
    ctx = canvas.getContext("2d");
    canvas.width = "300";
    canvas.height = "300";
    let target;
    let count;
    let onComplete = () => {};

    function startGame(){
        count = 0;
        messageElement.textContent = "SHOOT THE TARGETS:";
        clearCanvas();
        target = createTarget();
        renderNewTarget(target);
    }
    
    function getRandomPosX() {
        const pos = Math.floor(Math.random() * (canvas.width - targetWidth));
        return pos;
    }
    
    function getRandomPosY() {
        const pos = Math.floor(Math.random() * (canvas.height - targetHeight));
        return pos;
    }
    
    function createTarget() {
        const newTarget = {
            color: "red",
            width: targetWidth,
            height: targetHeight,
            left: getRandomPosX(),
            top: getRandomPosY()
        };
        return newTarget;
    }
    
    async function renderNewTarget(target) {
        ctx.fillStyle = target.color;
        ctx.fillRect(target.left, target.top, target.width, target.height);
    }

    const clickedTarget = (x, y, target) => {
        return x > target.left &&
            x < target.left + target.width &&
            y > target.top &&
            y < target.top + target.height;
    }

    function clearCanvas(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    canvas.addEventListener("click", (event) => {
        const x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;
        if (clickedTarget(x, y, target)) {
            count++;
            clearCanvas();
            if (count < TARGETS_TO_HIT) {
                target = createTarget();
                renderNewTarget(target);
            } else {
                messageElement.textContent = "INVADER RESOLVED";
                onComplete();
            }
        }
    });
    /**
     * Accepts a function to be run when the game completes
     * @param {function} onCompleteFunction 
     */
    const setOnComplete = (onCompleteFunction) => {
        onComplete = onCompleteFunction;
    }

    return {
        startGame,
        setOnComplete,
    }
})();