// Sends and recieves Websocket data

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
    if (data.name === "humanRoomUpdate") {
        HUMAN_STATE.setCurrentRoom(data.room);
    }
});

