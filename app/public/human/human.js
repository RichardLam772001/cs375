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
      token: TOKEN_COOKIE
    });
  };

  const switchHumanTool = (tool) => {
    WS.send({
      action: {
        name: "switchHumanTool",
        args: {
          tool: tool,
        },
      },
      username: USERNAME_COOKIE,
      gameId: GAME_ID_COOKIE,
      token: TOKEN_COOKIE
    });
  };

  const boost = () => {
    console.log("boost");
  }
  const inhibit = () => {
    console.log("inhibit");
  }

  return {
    enterRoom,
    switchHumanTool,
    boost,
    inhibit,
  };
})();

window.onload = () => {
  if (USERNAME_COOKIE) {
      const size = BOARD.getSize();
      for (let i=0; i < size.rows; i++) {
          for (let j=0; j < size.columns; j++) {
              BOARD.getRoom(i,j).rootElem.addEventListener('click', () => HUMAN.enterRoom(`${i}-${j}`));
          }
      }      
      
    document.getElementById("boost").addEventListener("click", HUMAN.boost);
    document.getElementById("inhibit").addEventListener("click", HUMAN.inhibit);
  }
};

BOARD.setAllToHidden();
HUMAN_STATE.setRoomChangeCallback(onRoomChange);

/**
 * 
 * @param {RoomElement} oldRoom 
 * @param {RoomElement} newRoom 
 */
function onRoomChange(oldRoom, newRoom){
    if(!BOARD.roomHasThreat(oldRoom)) oldRoom?.setVisible(false); //threatened rooms remain revealed after leaving them
    newRoom?.setVisible(true);
}

