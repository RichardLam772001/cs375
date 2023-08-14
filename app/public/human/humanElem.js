// The instance of the human element that moves between rooms

const HumanElem = (startRoomElem) => {

    const mainDiv = document.createElement("img");
    const img = mainDiv;
    img.src = "../images/Human.png";
    mainDiv.id = "human";
    moveToRoom(startRoomElem);

    function moveToRoom(roomElem){
        roomElem.humanParent.appendChild(mainDiv);
    }

    return {
        moveToRoom

    }
};