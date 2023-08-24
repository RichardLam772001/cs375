//This human state is shared between both players

const HUMAN_STATE = (() => {
  let currentRoom;
  let pingedRoom;
  let pingedThreatType;
  let currentTool = "";

  let onRoomChange;

  function setCurrentRoom(newRoomString) {
    const newRoom = BOARD.parseMoveableRoom(newRoomString);
    if (newRoom === undefined) return;
    const oldRoom = currentRoom;
    currentRoom = newRoom;
    CONSOLE.addConsoleLine({
      message: `Human enters room ${newRoomString}`,
      style: "public",
    });
    HUMAN_ELEM.moveToRoom(newRoom);
    if (onRoomChange) {
      onRoomChange(oldRoom, newRoom);
    }
  }

  function setRoomChangeCallback(onRoomChangeFunc) {
    onRoomChange = onRoomChangeFunc;
  }

  function switchHumanTool(tool) {
    currentTool = tool;
    console.log("6. human state Button clicked: ", tool);

    // remove all color before color to selected button
    document.querySelectorAll(".button").forEach((btn) => {
      btn.classList.remove("selected");
      btn.classList.add("unselected");
    });
    // color to the selected button
    const currentToolButton = document.getElementById(tool);
    if (currentToolButton) {
      currentToolButton.classList.remove("unselected");
      currentToolButton.classList.add("selected");
    }
    CONSOLE.addConsoleLine({
      message: `Human set tool ${tool}`,
      style: "public",
    });
  }

  function aiPingRoom(room, threatType) {
    pingedRoom = room;
    pingedThreatType = threatType;
    console.log("6.HumanState aiPingRoom() ", pingedRoom, pingedThreatType);
  }

  return {
    setCurrentRoom,
    setRoomChangeCallback,
    switchHumanTool,
    aiPingRoom,
  };
})();
