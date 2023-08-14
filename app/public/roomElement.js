// Manipulates a room element

const RoomElement = (parentElem) => {

    const mainDiv = createElemUnderParent("div", parentElem);
    mainDiv.className = "room";
    const backElem = createElemUnderParent("div", mainDiv);
    backElem.className = "visible";


    function setVisible(visible){
        backElem.className = visible ? "visible" : "hidden";
    }

    function createElemUnderParent(elemType, parentElem){
        const newElem = document.createElement(elemType);
        parentElem.appendChild(newElem);
        return newElem;
    }

    return {
        rootElem: mainDiv,
        humanParent : backElem,
        setVisible
    }
}