const AI = (() => {
  // function pingRoom(row, column){
  //     CONSOLE.addConsoleLine({message:`ping room ${row}-${column}`, style: "private"});
  // }

  let threadType = "";

  const pingRoom = (room) => {
    WS.send({
      action: {
        name: "pingRoom",
        args: {
          room: room,
        },
      },
      username: USERNAME_COOKIE,
      gameId: GAME_ID_COOKIE,
    });

    CONSOLE.addConsoleLine({
      message: `ping room ${row}-${column}`,
      style: "private",
    });
  };

  const switchThreadType = (thread) => {
    threadType = thread;
    console.log("1. AI switch thread type ", thread);
    document.querySelectorAll(".button").forEach((btn) => {
      btn.classList.remove("selected");
      btn.classList.add("unselected");
    });
    const currentThreadButton = document.getElementById(thread);
    if (currentThreadButton) {
      currentThreadButton.classList.remove("unselected");
      currentThreadButton.classList.add("selected");
    }
    CONSOLE.addConsoleLine({
      message: `AI set thread ${thread}`,
      style: "public",
    });
  };

  return {
    pingRoom,
    switchThreadType,
  };
})();

window.onload = () => {
  if (USERNAME_COOKIE) {
    const size = BOARD.getSize();
    for (let i = 0; i < size.rows; i++) {
      for (let j = 0; j < size.columns; j++) {
        BOARD.getRoom(i, j).rootElem.addEventListener("click", () =>
          AI.pingRoom(`${i}-${j}`)
        );
      }
    }
  }
};
