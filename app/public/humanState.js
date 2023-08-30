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
        let gameContainer;
              
        switch(tool){
            case "gun":
                gameContainer = document.getElementById("container-for-shooting-game");
                gameContainer.style.display = "block";
                break;
            case "wrench":
                gameContainer = document.getElementById("container-for-typing-game");
                gameContainer.style.display = "block";
                break
            case "fire-extinguisher":
                console.log("incomplete, please wait for the game");
                break;
            default:
                console.log("Invalid tool.")
                return;
        }

        const miniGameContainer = document.getElementById("minigame-container");
        // miniGameContainer.innerHTML = gameContent;
        // if(gameScript){
        //     const scriptPart = document.createElement('script');
        //     const cssPart = document.createElement('link');
        //     cssPart.innerHTML = gameCss;
        //     scriptPart.innerHTML = gameScript;
        //     miniGameContainer.appendChild(cssPart);
        //     miniGameContainer.appendChild(scriptPart);
        // }
        // miniGameContainer.style.display = "block";
        
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
