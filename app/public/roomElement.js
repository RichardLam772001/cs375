// Manipulates a visual room element
// Can contain the human, threats, and pings

const RoomElement = (parentElem, roomString) => {

    const ROOM_STRING = roomString;
    const PING_ROUTE = "../images/ping/";

    const CLEAR_PING_TIME = 8; //how many seconds a ping is shown for
    let clearPingInterval;

    const mainDiv = createElemUnderParent("div", parentElem);
    mainDiv.className = "room";
    const backElem = createElemUnderParent("div", mainDiv);
    backElem.className = "visible";

    const threatImg = createElemUnderParent("img", backElem);
    const pingImg = createElemUnderParent("img", backElem);

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
    function setPing(pingString){
        pingImg.style.visibility = "visible";
        if(clearPingInterval) clearInterval(clearPingInterval);

        switch(pingString){
            case "fire":
                pingImg.src = PING_ROUTE+"Ping_Fire.png";
                break;
            case "breach":
                pingImg.src = PING_ROUTE+"Ping_Breach.png";
                break;
            case "invader":
                pingImg.src = PING_ROUTE+"Ping_Invader.png";
                break;
            default:
                pingImg.style.visibility = "hidden";
                return;
        }
        clearPingInterval = setInterval(()=>setPing(""), CLEAR_PING_TIME*1000);
    }

    return {
        rootElem: mainDiv,
        humanParent : backElem,
        setVisible,
        setThreat,
        setPing,
        setDestroyed,
        ROOM_STRING
    }
}