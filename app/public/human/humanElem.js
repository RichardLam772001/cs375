// The instance of the human element that moves between rooms

const HumanElem = (startRoomElem) => {

    const mainDiv = document.createElement("img");
    const img = mainDiv;
    img.src = "../images/Human/Human_Wrench.png";
    mainDiv.id = "human";
    moveToRoom(startRoomElem);

    function moveToRoom(roomElem){
        roomElem.humanParent.appendChild(mainDiv);
    }
    function setTool(toolString){
        let fileName;
        switch(toolString){
            case "wrench":
                fileName = "Wrench";
                break;
            case "fire-extinguisher":
                fileName = "Extinguisher";
                break;
            case "gun":
                fileName = "Gun";
                break;
        }
        img.src = `../images/Human/Human_${fileName}.png`;
    }

    return {
        moveToRoom,
        setTool,

    }
};