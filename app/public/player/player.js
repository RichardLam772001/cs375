const PLAYER = (() => {

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
})

WS.onReceive((data) => {
    if (data.name === "playerRoomUpdate") {
        PLAYER.setCurrentRoom(data.room);
    }
});

for (let i=0; i < 3; i++) {
    for (let j=0; j < 3; j++) {
        document.getElementById(`room-${i}-${j}`).addEventListener('click', () => PLAYER.enterRoom(`${i}-${j}`));
    }
}

