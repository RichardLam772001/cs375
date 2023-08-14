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

  const useTool = (tool) => {
    WS.send({
      action: {
        name: "useTool",
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
    useTool,
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

  document
    .querySelector('.button[title="Fire Extinguisher"]')
    .addEventListener("click", () => HUMAN.useTool("Fire Extinguisher"));
  document
    .querySelector('.button[title="Wrench"]')
    .addEventListener("click", () => HUMAN.useTool("Wrench"));
  document
    .querySelector('.button[title="Gun"]')
    .addEventListener("click", () => HUMAN.useTool("Gun"));
};
