//This human state is shared between both players

const HUMAN_STATE = (() => {

    let currentRoom = "";
    let currentTool = "";

    function setCurrentRoom(newRoom){
        currentRoom = newRoom;
        CONSOLE.addConsoleLine({message:`Human enters room ${newRoom}`, style: "public"});
        BOARD.setCurrentRoom(newRoom);
    }
    function setCurrentTool(newTool){
        currentTool = newTool;
    } 


    return {
        setCurrentRoom,
        setCurrentTool
    }
})();

const getCurrentRoom = () => {
    WS.send({
        action: {
            name: "getCurrentRoom"
        }
    });
}

WS.onConnect(() => {
    console.log("We are connected");
    getCurrentRoom();
});
WS.onDisconnect(() => {
    
});

WS.onReceive((data) => {
    if (data.name === "humanRoomUpdate") {
        HUMAN_STATE.setCurrentRoom(data.room);
    }
});

