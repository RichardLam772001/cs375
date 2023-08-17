// Sends and recieves Websocket data

const getCurrentRoom = () => {
  WS.send({
    action: {
      name: "getCurrentRoom",
    },
    username: USERNAME_COOKIE,
    gameId: GAME_ID_COOKIE,
  });
};

const getCurrentTool = () => {
  WS.send({
    action: {
      name: "getCurrentTool",
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
  } else {
    setTimeout(registerClient, 500);
  }
};
registerClient();

WS.onDisconnect(() => {});

WS.onReceive((data) => {
  if (data.name === "humanRoomUpdate") {
    HUMAN_STATE.setCurrentRoom(data.room);
  }

  if (data.name === "currentToolUpdate") {
    //+++++++
    HUMAN_STATE.setCurrentTool(data.tool);
  }
});
