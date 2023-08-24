// Manipulates a visual room element
// Can contain the human, threats, and pings

const RoomElement = (parentElem, roomString) => {

    const ROOM_STRING = roomString;

    const mainDiv = createElemUnderParent("div", parentElem);
    mainDiv.className = "room";
    const backElem = createElemUnderParent("div", mainDiv);
    backElem.className = "visible";

    const threatImg = createElemUnderParent("img", backElem);

    function setVisible(visible){
        backElem.className = visible ? "visible" : "hidden";
    }
    setVisible(true); //visible by default

    function setDestroyed(){
        backElem.className = "destroyed";
        setThreat("");
    }

    function createElemUnderParent(elemType, parentElem){
        const newElem = document.createElement(elemType);
        parentElem.appendChild(newElem);
        return newElem;
    }

    function setThreat(threatString){
        threatImg.style.visibility = "visible";
        switch(threatString){
            case "fire":
                threatImg.src = "../images/Fire.png";
                break;
            case "breach":
                threatImg.src = "../images/Breach.png";
                break;
            case "invader":
                threatImg.src = "../images/Invader.png";
                break;
            default:
                threatImg.style.visibility = "hidden";
        }
    }

    return {
        rootElem: mainDiv,
        humanParent : backElem,
        setVisible,
        setThreat,
        setDestroyed,
        ROOM_STRING
    }
}