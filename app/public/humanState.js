// @ts-check
//This human state is shared between both players

const HUMAN_STATE = (() => {

    let currentRoom;
    let currentTool = "";

    let onRoomChange;

    function setCurrentRoom(newRoomString){
        const newRoom = BOARD.parseMoveableRoom(newRoomString);
        if(newRoom === undefined) return;
        const oldRoom = currentRoom;
        currentRoom = newRoom;
        HUMAN_ELEM.moveToRoom(newRoom);
        if(onRoomChange){
            onRoomChange(oldRoom, newRoom);
        }
    }
    /**
     * @returns string representation of the room (e.g. 0-0)
     */
    const getCurrentRoom = () => {
        return currentRoom.ROOM_STRING;
    }

    function setRoomChangeCallback(onRoomChangeFunc){
        onRoomChange = onRoomChangeFunc;
    }

    function switchHumanTool(tool) {
        currentTool = tool;
        // remove all color before color to selected button
        document.querySelectorAll(".button").forEach((btn) => {
            btn.classList.remove("selected");
            btn.classList.add("unselected");
        });
        // color to the selected button
        const currentToolButton = document.getElementById(tool);
        if (currentToolButton) {
            currentToolButton.classList.remove("unselected");
            currentToolButton.classList.add("selected");
        }
    }

    function initiateMiniGame(tool){
        let gameContent = '';
        let gameScript = '';
        switch(tool){
            case "gun":
                gameContent =`
                <canvas class="canvas" id="canvas"></canvas>
                <style>
                    .canvas {
                        background: lightgray;
                    }
                </style>`;
                gameScript =
                `
                (function(){
                    const targetWidth = 60,
                    targetHeight = 60;

                    const canvas = document.getElementById("canvas"),
                    canvasLeft = canvas.offsetLeft + canvas.clientLeft,
                    canvasTop = canvas.offsetTop + canvas.clientTop,
                    ctx = canvas.getContext("2d");
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    let target = createTarget();
                    renderNewTarget(target);
                    let count = 0;

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

                    canvas.addEventListener("click", (event) => {
                        const x = event.pageX - canvasLeft,
                        y = event.pageY - canvasTop;
                        //check if click is inside canvas element with respect to offset from document body
                        if (x > target.left &&
                            x < target.left + target.width &&
                            y > target.top &&
                            y < target.top + target.height) {
                            if (count < 11) {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                target = createTarget();
                                renderNewTarget(target);
                                count++;
                            } else {
                                count++;
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                canvas.style.background = "lightgreen";
                                HUMAN_STATE.closeMiniGame();
                            }
                        }
                    });
                })();
                `
                break;
            case "wrench":
                gameContent = `
                <div class="container">
                    <div class="quote-display" id="quoteDisplay">quote</div>
                    <textarea class="quote-input" id="quoteInput" onpaste="return false" autocomplete="off">quote</textarea>
                </div>
                <style>
                    * {
                        box-sizing: border-box;
                    }

                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                    }

                    body, .quote-input {
                        font-family: Georgia, 'Times New Roman', Times, serif;
                    }

                    .container {
                        background-color: lightblue;
                        padding: 1rem;
                        border-radius: .5rem;
                        width: 700px;
                        max-width: 90%;
                    }

                    .quote-display {
                        margin-bottom: 1rem;
                        margin-left: calc(1rem + 2px);
                        margin-right: calc(1rem + 2px);
                    }

                    .quote-input {
                        outline: none;
                        width: 100%;
                        height: 8rem;
                        margin: auto;
                        resize: none;
                        padding: .5rem 1rem;
                        font-size: 1rem;
                    }

                    .quote-input:focus {
                        border-color: black;
                    }

                    .correct {
                        color: green;
                    }

                    .incorrect {
                        color: red;
                        text-decoration: underline;
                    }
                </style>`;
                gameScript =
                `
                (function(){
                    //Maybe replace spaceQuotes with random quote API?
                    const spaceQuotes = [
                        "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.",
                        "Sometimes it seems as though each new step towards AI, rather than producing something which everyone agrees is real intelligence, merely reveals what real intelligence is not.",
                        "People worry that computers will get too smart and take over the world, but the real problem is that they're too stupid and they've already taken over the world.",
                        "By far the greatest danger of Artificial Intelligence is that people conclude too early that they understand it.",
                        "The AI does not hate you, nor does it love you, but you are made out of atoms which it can use for something else.",
                        "With few ambitions, most people allowed efficient machines to perform everyday tasks for them. Gradually, humans ceased to think, or dream... or truly live."
                    ]
                    const quoteDisplay = document.getElementById("quoteDisplay");
                    const quoteInput = document.getElementById("quoteInput");
                    const messageDisplay = document.getElementById("messageDisplay");

                    quoteInput.addEventListener("input", () => {
                        const arrayQuote = quoteDisplay.querySelectorAll("span");
                        const arrayValue = quoteInput.value.split("");
                        let correct = true;
                        arrayQuote.forEach((characterSpan, index) => {
                            const character = arrayValue[index];
                            if (character == null) {
                                characterSpan.classList.remove("correct");
                                characterSpan.classList.remove("incorrect");
                                correct = false;
                            } else if (character === characterSpan.innerText) {
                                characterSpan.classList.add("correct");
                                characterSpan.classList.remove("incorrect");
                            } else if (isNaN(characterSpan.innerText.charCodeAt(0))) { //ignore line breaks made in <textarea>
                                characterSpan.classList.add("correct");
                                characterSpan.classList.remove("incorrect");
                            } else {
                                characterSpan.classList.remove("correct");
                                characterSpan.classList.add("incorrect");
                                correct = false;
                            }
                        });
                        if (correct)
                            quoteInput.setAttribute("disabled", "");
                            setTimeout(()=>{
                                HUMAN_STATE.closeMiniGame();
                            }, 500);
                    });

                    function getRandomQuote() {
                        const index = Math.floor(Math.random() * spaceQuotes.length);
                        return spaceQuotes[index];
                    }

                    async function renderNewQuote() {
                        const quote = getRandomQuote();
                        quoteDisplay.innerText = "";
                        quote.split("").forEach(character => {
                            const characterSpan = document.createElement("span");
                            characterSpan.innerText = character;
                            quoteDisplay.appendChild(characterSpan);
                        });
                        quoteInput.value = null;
                    }

                    renderNewQuote();
                })();
                `
                break;
            case "fire-extinguisher":
                console.log("incomplete, please wait for the game");
                break;
                gameContent =  ``;
            default:
                console.log("Invalid tool.")
                return;
        }

        const miniGameContainer = document.getElementById("minigame-container");
        miniGameContainer.innerHTML = gameContent;
        if(gameScript){
            const scriptPart = document.createElement('script');
            scriptPart.innerHTML = gameScript;
            miniGameContainer.appendChild(scriptPart);
        }
        miniGameContainer.style.display = "block";
        
    }
    
    function closeMiniGame(){
        const miniGameContainer = document.getElementById("minigame-container");
        miniGameContainer.textContent = '';
        miniGameContainer.style.display = "none";
    }

    return {
        setCurrentRoom,
        setRoomChangeCallback,
        switchHumanTool,
        getCurrentRoom,
        initiateMiniGame,
        closeMiniGame,
    }
})();
