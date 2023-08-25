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

const switchHumanTool = () => {
    WS.send({
      action: {
        name: "switchHumanTool",
      },
      username: USERNAME_COOKIE,
      gameId: GAME_ID_COOKIE,
    });
  };

WS.onConnect(() => {
    console.log("We are connected");
});

const registerClient = () => {
    if (WS.webSocket.readyState) {
        getCurrentRoom();
    }
    else {
        setTimeout(registerClient, 500);
    }
};
registerClient();

WS.onDisconnect(() => {
    
});

WS.onReceive((data) => {
    console.log("Received WS data :", data);
    switch (data.name) {
        case "humanRoomUpdate":
            HUMAN_STATE.setCurrentRoom(data.room);
            break;
        case "humanToolUpdate":
            HUMAN_STATE.switchHumanTool(data.tool);
            break;
        case "aiPingThreatUpdate":
            BOARD.pingRoom(data.room, data.threatType);
            break;
        case "threatSpawned":
            BOARD.spawnThreat(data.threatType, data.room);
            break;      
        case "consoleLine":
            CONSOLE.addConsoleLine(data);
            break;
        case "threatResolved":
            BOARD.removeThreat(data.room);
            break;
        case "roomDestroyed":
            BOARD.destroyRoom(data.room);
            break;
    }
});
