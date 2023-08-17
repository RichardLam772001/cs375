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

  const switchCurrentTool = (toolName) => {
    WS.send({
      action: {
        name: "switchCurrentTool",
        args: {
          tool: toolName,
        },
      },
      username: USERNAME_COOKIE,
      gameId: GAME_ID_COOKIE,
    });
  };

  return {
    enterRoom,
    switchCurrentTool,
  };
})();

window.onload = () => {
  if (USERNAME_COOKIE) {
    const size = BOARD.getSize();
    for (let i = 0; i < size.rows; i++) {
      for (let j = 0; j < size.columns; j++) {
        BOARD.getRoom(i, j).addEventListener("click", () =>
          HUMAN.enterRoom(`${i}-${j}`)
        );
      }
    }
  }
};
