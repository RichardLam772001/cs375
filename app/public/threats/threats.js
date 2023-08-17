const THREAT = (() => {
  const THREAT_TYPE = ["breach", "invader", "fire"];
  let activeThreats = [];

  const handleThreatFromServer = (threatJSON) => {
    const threat = JSON.parse(threatJSON);
    if (!THREAT_TYPE.includes(threat.type)) {
      console.warn("invalid threat type " + threat.type);
      return;
    }
    if (activeThreats.length >= 3) {
      console.warn("Max threats reached");
      return;
    }

    activeThreats.push(threat);

    displayThreatInRoom(room, type);
  };

  const handleUserActionOnThreat = (room) => {
    // This function can be called when the user decides to handle a threat in a room.
    WS.send({
      action: {
        name: "handleThreat",
        args: {
          room: room,
        },
      },
      username: USERNAME_COOKIE,
      gameId: GAME_ID_COOKIE,
    });

    // Remove the threat visually from the room after handling
    removeThreatFromRoom(room);

    // remove threat from active threats list after handling it.
    activeThreats = activeThreats.filter((threat) => threat.room !== room);
  };

  const displayThreatInRoom = (room, type) => {
    const roomElem = BOARD.getRoomElementByString(room);
    if (!roomElem) return;

    const threatImage = document.createElement("img");
    threatImage.src = `../images/threats/${type}.png`;
    threatImage.className = "threat-icon"; // For CSS styling

    roomElem.appendChild(threatImage);
  };

  const removeThreatFromRoom = (room) => {
    const roomElem = BOARD.getRoomElementByString(room);
    if (!roomElem) return;

    const threatIcons = roomElem.querySelectorAll(".threat-icon");
    threatIcons.forEach((icon) => roomElem.removeChild(icon));
  };

  return {
    handleThreatFromServer,
    handleUserActionOnThreat,
  };
})();

window.onload = () => {
  if (USERNAME_COOKIE) {
    // Assuming the user to handle threats through interaction.
    const size = BOARD.getSize();
    for (let i = 0; i < size.rows; i++) {
      for (let j = 0; j < size.columns; j++) {
        const roomElem = BOARD.getRoom(i, j);
        roomElem.rootElem.addEventListener("click", () => {
          THREAT.handleThreat(`${i}-${j}`);
        });
      }
    }
  }
};
