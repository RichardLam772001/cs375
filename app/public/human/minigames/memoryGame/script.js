const MEMORY_GAME = (() => {
    const gridDimension = 3;

    let pattern = [0, 0, 0];
    const patternLength = pattern.length;
    
    //timers
    const blinkDuration = 300,
    delayBetweenBlinks = 500,
    startDelay = 200, //time for player to react to the pattern about to be shown
    incorrectPenaltyTime = 500;
    let onComplete = () => {};
    
    let table = document.getElementById("memory-game-container");
    for (let i = 0; i < gridDimension; i++) {
        let newRow = document.createElement("tr");
        for (let j = 0; j < gridDimension; j++) {
            let newCol = document.createElement("td");
            newCol.classList.add("canvas");
            newCol.setAttribute("id", `canvas${i*3+j}`);
            newCol.style.margin = "2px";
            newRow.append(newCol);
        }
        table.append(newRow);
    }
    
    const messageDisplay = document.getElementById("memory-game-message-display");
    
    function generateRandomPattern(){
        for (let i = 0; i < patternLength; i++) {
            pattern[i] = Math.floor(Math.random() * gridDimension * gridDimension);
        }
    }

    function startGame(){
        playerPattern = [];
        generateRandomPattern();
        showPattern();
    }

    function blinkSquare(index){
        const canvas = document.getElementById(`canvas${index}`)
        canvas.style.background = "green";
        setTimeout(() => {
            canvas.style.background = "lightgray";
        }, blinkDuration);
    }
    
    function showPattern() {
        setAllTilesToColor("lightgray")
        messageDisplay.innerText = "MEMORIZE PATTERN:";
        setTimeout(()=>{
            for (let i = 0; i < patternLength; i++) {
                setTimeout(() => {
                    blinkSquare(pattern[i]);
                }, delayBetweenBlinks * i);
            }
            setTimeout(() => {
                enableHandler();
                messageDisplay.innerText = "REPEAT PATTERN:";
            }, delayBetweenBlinks * patternLength);
        },startDelay);
    }
    
    let playerPattern = [];
    function enableHandler() {
        for (let i = 0; i < gridDimension * gridDimension; i++) {
            const canvas = document.getElementById(`canvas${i}`)
            canvas.addEventListener("click", handler);
            canvas.number = i;
        }
    }
    
    function disableHandler() {
        for (let i = 0; i < gridDimension * gridDimension; i++) {
            const canvas = document.getElementById(`canvas${i}`)
            canvas.removeEventListener("click", handler);
        }
    }
    
    function handler(e) {
        let curr = e.currentTarget;
        if (curr.number === pattern[playerPattern.length]) {
            playerPattern.push(curr.number);
            if (playerPattern.length === patternLength) {
                complete();
            } else {
                blinkSquare(curr.number);
            }
        } else {
            if (playerPattern.length < patternLength)
                incorrectTile();
        }
    }

    /**
     * 
     * @param {string} color 
     */
    function setAllTilesToColor(color){
        for (let i = 0; i < gridDimension * gridDimension; i++) {
            const canvas = document.getElementById(`canvas${i}`);
            canvas.style.background = color;
        }
    }
    
    function incorrectTile() {
        disableHandler();
        messageDisplay.innerText = "INCORRECT";

        setAllTilesToColor("red");
        
        playerPattern = [];
        setTimeout(() => {
            showPattern();
        }, incorrectPenaltyTime);
    }

    const setOnComplete = (onCompleteFunction) => {
        onComplete = onCompleteFunction;
    }
    const complete = () => {
        messageDisplay.innerText = "BREACH RESOLVED";
        setAllTilesToColor("lightgreen");
        disableHandler();
        onComplete();
    }

    return {
        startGame,
        setOnComplete,
    }
})();
