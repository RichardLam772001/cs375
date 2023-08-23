/**
 * This file will contain objects for different types of data we will send to the human/AI during the game
 */

// Sync with dataObjects.js on the frontend
const DATA_TYPES = {
  HUMAN_ROOM_UPDATE: "humanRoomUpdate",
  HUMAN_TOOL_UPDATE: "humanToolUpdate",
  AI_PING_THREAT_UPDATE: "aiPingThreatUpdate",
  CONSOLE_LINE: "consoleLine",
  GAME_READY: "gameReady",
};

const HumanRoomUpdateData = (room) => ({
  name: DATA_TYPES.HUMAN_ROOM_UPDATE,
  room,
});

const HumanToolUpdateData = (tool) => ({
  name: DATA_TYPES.HUMAN_TOOL_UPDATE,
  tool,
});

const AIPingThreatUpdateData = (room) => ({
  name: DATA_TYPES.AI_PING_THREAT_UPDATE,
  room,
});

const ConsoleLineData = (time, message, visibility, style) => ({
  name: DATA_TYPES.CONSOLE_LINE,
  time,
  message,
  visibility,
  style,
});

const GameReadyData = (lobbyId, gameId) => ({
  name: DATA_TYPES.GAME_READY,
  lobbyId,
  gameId,
});

const isMessageType = (data, data_type) => {
  return data.name === data_type;
};
