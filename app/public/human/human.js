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

  const switchCurrentTool = (tool) => {
    WS.send({
      action: {
        name: "switchCurrentTool",
        args: {
          tool: tool,
        },
      },
      username: USERNAME_COOKIE,
      gameId: GAME_ID_COOKIE,
    });
    console.log("human click ", tool);
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
        BOARD.getRoom(i, j).rootElem.addEventListener("click", () =>
          HUMAN.enterRoom(`${i}-${j}`)
        );
      }
    }
  }
  document
    .querySelector("#fire-extinguisher-button")
    .addEventListener("click", () =>
      HUMAN.switchCurrentTool("Fire Extinguisher")
    );
  document
    .querySelector("#wrench-button")
    .addEventListener("click", () => HUMAN.switchCurrentTool("Wrench"));
  document
    .querySelector("#gun-button")
    .addEventListener("click", () => HUMAN.switchCurrentTool("Gun"));
};
