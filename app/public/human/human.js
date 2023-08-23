const HUMAN = (() => {
  const enterRoom = (room) => {
    WS.send({
      action: {
        name: "enterRoom",
        args: {
          room: room,
        },
      },
      username: USERNAME_COOKIE,
      gameId: GAME_ID_COOKIE,
    });
  };

  const switchHumanTool = (tool) => {
    console.log("1. human switch human tool ", tool);
    WS.send({
      action: {
        name: "switchHumanTool",
        args: {
          tool: tool,
        },
      },
      username: USERNAME_COOKIE,
      gameId: GAME_ID_COOKIE,
    });
  };

  return {
    enterRoom,
    switchHumanTool,
  };
})();

window.onload = () => {
  console.log("human.js window.onload.");
  if (USERNAME_COOKIE) {
    const size = BOARD.getSize();
    for (let i = 0; i < size.rows; i++) {
      for (let j = 0; j < size.columns; j++) {
        BOARD.getRoom(i, j).rootElem.addEventListener("click", () =>
          HUMAN.enterRoom(`${i}-${j}`)
        );
      }
    }
  }
};
