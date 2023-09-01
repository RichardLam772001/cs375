const AI = (() => {

    let currentThreatType = "breach";

    const pingRoom = (room) => {
        WS.send({
          action: {
            name: "pingRoom",
            args: {
              room: room,
              threatType: currentThreatType,
            },
          },
          username: USERNAME_COOKIE,
          gameId: GAME_ID_COOKIE,
        });
    }
    
      const switchThreatType = (threatType) => {
        currentThreatType = threatType;
        document.querySelectorAll(".ai-button").forEach((btn) => {
          btn.classList.remove("selected");
          btn.classList.add("unselected");
        });
        const currentThreatButton = document.getElementById(threatType);
        if (currentThreatButton) {
          currentThreatButton.classList.remove("unselected");
          currentThreatButton.classList.add("selected");
        }
      };
    
      return {
        pingRoom,
        switchThreatType,
      };
})();

window.onload = () => {
    if (USERNAME_COOKIE) {
        const size = BOARD.getSize();
        for (let i=0; i < size.rows; i++) {
            for (let j=0; j < size.columns; j++) {
                BOARD.getRoom(i,j).rootElem.addEventListener('click', () => AI.pingRoom(`${i}-${j}`));
            }
        }
        
    }
};
