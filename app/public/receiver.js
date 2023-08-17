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
    if (data.name === "humanRoomUpdate") {
        HUMAN_STATE.setCurrentRoom(data.room);
    }
    onThreatSpawn();
});

const onThreatSpawn = () => {
  const name = "threatSpawned";
  const room = "0-1";
  const isPaused = false;
  const threatName = "fire";
  const threatTime = 30;

  console.log("Received threat data " + threatName);
  // add your logic here
};