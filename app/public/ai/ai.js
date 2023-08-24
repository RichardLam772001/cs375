const AI = (() => {
  // function pingRoom(row, column){
  //     CONSOLE.addConsoleLine({message:`ping room ${row}-${column}`, style: "private"});
  // }

  let currentThreatType = "";
  let currentPingRoom = "";

  const pingRoom = (room, threatType) => {
    WS.send({
      action: {
        name: "pingRoom",
        args: {
          room: room,
          threatType: threatType,
        },
      },
      username: USERNAME_COOKIE,
      gameId: GAME_ID_COOKIE,
    });

    // CONSOLE.addConsoleLine({
    //   message: `ping room ${row}-${column}`,
    //   style: "private",
    // });
  };
  const getPingRoom = (room) => {
    currentPingRoom = room;
    pingRoom(room, currentThreatType);
  };

  const switchThreatType = (threatType) => {
    currentThreatType = threatType;
    console.log("1. AI switch threat type ", currentThreatType);
    document.querySelectorAll(".button").forEach((btn) => {
      btn.classList.remove("selected");
      btn.classList.add("unselected");
    });
    const currentThreatButton = document.getElementById(threatType);
    if (currentThreatButton) {
      currentThreatButton.classList.remove("unselected");
      currentThreatButton.classList.add("selected");
    }
    CONSOLE.addConsoleLine({
      message: `AI set threat ${threatType}`,
      style: "public",
    });
  };

  return {
    pingRoom,
    getPingRoom,
    switchThreatType,
  };
})();

window.onload = () => {
  if (USERNAME_COOKIE) {
    const size = BOARD.getSize();
    for (let i = 0; i < size.rows; i++) {
      for (let j = 0; j < size.columns; j++) {
        BOARD.getRoom(i, j).rootElem.addEventListener("click", () =>
          AI.getPingRoom(`${i}-${j}`)
        );
      }
    }
  }
};
