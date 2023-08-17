const THREAT_STATE = (() => {
  let currentRoom;
  let currentState = "";

  let threatStateChange;

  function setThreatToRoom(newRoomString) {
    const threatedRoom = BOARD.parseThreatedRoom(newRoomString, threatsString);
    if (threatedRoom === undefined) return;
  }

  const parseThreatedRoom = (roomString) => {
    let [i, j] = parseRoomToIndexes(roomString);
    if (!roomExists([i, j])) {
      console.log(`Room ${i}-${j} does not exist`);
      return false;
    } else {
      ROOMS[i][j].setThreat(threatsString);
    }
    return ROOMS[i][j];
  };

  function setCurrentRoomstate(newState) {
    currentState = newState;
  }

  return {
    setThreatToRoom,
    setCurrentRoomstate,
  };
})();
