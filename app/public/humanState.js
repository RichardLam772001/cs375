//This human state is shared between both players

const HUMAN_STATE = (() => {
  let currentRoom = "";
  let currentTool = "";

  function setCurrentRoom(newRoom) {
    currentRoom = newRoom;
    CONSOLE.addConsoleLine({
      message: `Human enters room ${newRoom}`,
      style: "public",
    });
    BOARD.setCurrentRoom(newRoom);
  }
  function setCurrentTool(newTool) {
    currentTool = newTool;
  }

  return {
    setCurrentRoom,
    setCurrentTool,
  };
})();

const getCurrentRoom = () => {
  WS.send({
    action: {
      name: "getCurrentRoom",
    },
    username: USERNAME_COOKIE,
    gameId: GAME_ID_COOKIE,
  });
};

WS.onConnect(() => {
  console.log("We are connected");
  getCurrentRoom();
});
WS.onDisconnect(() => {});

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
