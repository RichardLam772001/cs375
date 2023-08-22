// Manipulates a visual room element
// Can contain the human, threats, and pings

const RoomElement = (parentElem) => {

    const mainDiv = createElemUnderParent("div", parentElem);
    mainDiv.className = "room";
    const backElem = createElemUnderParent("div", mainDiv);
    backElem.className = "visible";

    const threatImg = createElemUnderParent("img", backElem);
    setThreat("none");


    const threats = ["fire", "breach", "invader", "none"];
    setThreat(threats[Math.floor(Math.random()*threats.length)]) //TESTING: picks a random threat to show


    function setVisible(visible){
        backElem.className = visible ? "visible" : "hidden";
        console.log(`set room visible ${visible}`);
    }
    setVisible(true); //visible by default

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
        setVisible
    }
}