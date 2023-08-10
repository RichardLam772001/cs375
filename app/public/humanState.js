//This human state is shared between both players

const { ConsoleLineData } = require("../dataObjects");

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
        },
        username: USERNAME_COOKIE,
        gameId: GAME_ID_COOKIE
    });
}

WS.onConnect(() => {
    console.log("We are connected");
    getCurrentRoom();
});
WS.onDisconnect(() => {
    
});

WS.onReceive((data) => {
    switch(data.name){
        case "humanRoomUpdate":
            HUMAN_STATE.setCurrentRoom(data.room);
            break;
        case "consoleLine":
            CONSOLE.addConsoleLine(ConsoleLineData(data.time, data.message, data.visibility, data.style));
            break;
        default:
            break; 
    }
    
});

