const AI = (() => {

    let currentThreatType = "";

    const sendData = (data) => {
        WS.send({
            action: data,
            username: USERNAME_COOKIE,
            gameId: GAME_ID_COOKIE,
            token: TOKEN_COOKIE
        })
    }

    const pingRoom = (room) => {
        sendData({
            name: "pingRoom",
            args: {
              room: room,
              threatType: currentThreatType,
            },
        });
    }

    const assist = () => {
        sendData({
            name: "assist",
        });
    }
    const sabotage = () => {
        sendData({
            name: "sabotage",
        });
    }
    
      const switchThreatType = (threatType) => {
        currentThreatType = threatType;
        document.querySelectorAll(".button").forEach((btn) => {
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
        assist,
        sabotage,
      };
})();

const AI_ROLE = (() => {
  const aiHeader = document.getElementById("role-text");

  const displayAiRole = (role) => {
    switch (role) {
      case "GOOD":
        aiHeader.innerText = "You are the AI. Objective: Help human.";
        break;
      case "EVIL":
        aiHeader.innerText = "You are the HACKED AI. Objective: Kill human.";
        break;
    }
  }
  
  return {
    displayAiRole
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
