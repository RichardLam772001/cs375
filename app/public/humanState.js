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
        CONSOLE.addConsoleLine({message:`Human enters room ${newRoomString}`, style: "public"});
        HUMAN_ELEM.moveToRoom(newRoom);
        if(onRoomChange){
            onRoomChange(oldRoom, newRoom);
        }
    }

    function setRoomChangeCallback(onRoomChangeFunc){
        onRoomChange = onRoomChangeFunc;
    }

    function setCurrentTool(newTool){
        currentTool = newTool;
    } 

    return {
        setCurrentRoom,
        setRoomChangeCallback,
        setCurrentTool
    }
})();
