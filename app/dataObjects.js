/**
 * This file will contain objects for different types of data we will send to the human/AI during the game
 */

// Sync with dataObjects.js on the backend
const DATA_TYPES = {
  HUMAN_ROOM_UPDATE: "humanRoomUpdate",
  CURRENT_TOOL_UPDATE: "currentToolUpdate",
  CONSOLE_LINE: "consoleLine",
  GAME_READY: "gameReady",
  THREAT_SPAWNED: "threatSpawned",
};

const HumanRoomUpdateData = (room) => ({
  name: DATA_TYPES.HUMAN_ROOM_UPDATE,
  room,
});

const CurrentToolUpdateData = (tool) => ({
  name: DATA_TYPES.CURRENT_TOOL_UPDATE,
  tool,
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

const ThreatSpawnedData = (room, threatType, duration, isPaused) => ({
  name: DATA_TYPES.THREAT_SPAWNED,
  room,
  threatType,
  duration,
  isPaused,
});

module.exports = {
  HumanRoomUpdateData,
  CurrentToolUpdateData,
  ConsoleLineData,
  GameReadyData,
  ThreatSpawnedData,
};
