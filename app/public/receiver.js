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

// const getCurrentTool = () => {
//   WS.send({
//     action: {
//       name: "getCurrentTool",
//     },
//     username: USERNAME_COOKIE,
//     gameId: GAME_ID_COOKIE,
//   });
// };

// const switchCurrentTool = () => {
//   WS.send({
//     action: {
//       name: "switchCurrentTool",
//     },
//     username: USERNAME_COOKIE,
//     gameId: GAME_ID_COOKIE,
//   });
// };

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
  } else {
    setTimeout(registerClient, 500);
  }
};
registerClient();

WS.onDisconnect(() => {});

WS.onReceive((data) => {
  console.log("Received WS data :", data);
  switch (data.name) {
    case "humanRoomUpdate":
      HUMAN_STATE.setCurrentRoom(data.room);
      break;
    // case "currentToolUpdate":
    //   console.log("send to HumanState.", data.tool);
    //   HUMAN_STATE.switchCurrentTool(data.tool);
    //   break;
    case "humanToolUpdate":
      console.log("5. client send to HumanState.", data.tool);
      HUMAN_STATE.switchHumanTool(data.tool);
      break;
    case "threatSpawned":
      BOARD.spawnThreat(data.threatType, data.room);
      break;
  }
});
