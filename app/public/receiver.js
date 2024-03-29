// Sends and recieves Websocket data

const getCurrentRoom = () => {
    WS.send({
        action: {
            name: "getCurrentRoom"
        },
        username: USERNAME_COOKIE,
        gameId: GAME_ID_COOKIE,
        token : TOKEN_COOKIE
    });
}

const getAiRole = () => {
    WS.send({
        action: {
            name: "getAiRole"
        },
        username: USERNAME_COOKIE,
        gameId: GAME_ID_COOKIE,
        token : TOKEN_COOKIE
    })
}

WS.onConnect(() => {
    console.log("We are connected");
});

const registerClient = () => {
    if (WS.webSocket.readyState) {
        getCurrentRoom();
        getAiRole();
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
        case "aiRole":
            AI_ROLE.displayAiRole(data.role);
            break;
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
        case "GameEnd":
            BOARD.showGameEndMessage(data.result)
            break;
        case "roomDestroyed":
            BOARD.destroyRoom(data.room);
            break;
        case "delayData":
            ACTION_TRACKER.setDelayData(data);
            break;
        case "miniGameTriggered":
            MINI_GAME_HANDLER.showMiniGame(data.threatType); // Have this not run for AI player, rn it just throws an error cause not defined
            // (we're not including the minigame scripts on the AI page)
            break;
    }
});
