const HUMAN = (() => {

    let currentRoom = "";

    const setCurrentRoom = (newRoom) => {
        currentRoom = newRoom;
        BOARD.setCurrentRoom(newRoom);
    }

    const enterRoom = (room) => {
        WS.send({
            action: {
                name: "enterRoom",
                args: {
                    room: room
                }
            }
        });
    };

    return {
        setCurrentRoom,
        enterRoom
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
        HUMAN.setCurrentRoom(data.room);
    }
});

for (let i=0; i < 3; i++) {
    for (let j=0; j < 3; j++) {
        document.getElementById(`room-${i}-${j}`).addEventListener('click', () => HUMAN.enterRoom(`${i}-${j}`));
    }
}

