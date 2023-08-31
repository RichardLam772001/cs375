/**
 * This file will contain objects for different types of data we will send to the human/AI during the game
 */

// Sync with dataObjects.js on the backend
const DATA_TYPES = {
    HUMAN_ROOM_UPDATE : "humanRoomUpdate",
    CONSOLE_LINE : "consoleLine",
    HUMAN_TOOL_UPDATE: "humanToolUpdate",
    AI_PING_THREAT_UPDATE: "aiPingThreatUpdate",
    GAME_READY : "gameReady",
    LOBBY_LIST : "lobbyList",
    THREAT_SPAWNED: "threatSpawned",
    THREAT_RESOLVED: "threatResolved",
    GAME_END : "GameEnd",
    ROOM_DESTROYED: "roomDestroyed",
    DELAY_DATA: "delayData",
    AI_ROLE : "aiRole"
}

const HumanRoomUpdateData = (room) => ({
    name : DATA_TYPES.HUMAN_ROOM_UPDATE,
    room
});

const HumanToolUpdateData = (tool) => ({
  name: DATA_TYPES.HUMAN_TOOL_UPDATE,
  tool,
});

const AIPingThreatUpdateData = (room, threatType) => ({
  name: DATA_TYPES.AI_PING_THREAT_UPDATE,
  room,
  threatType,
});

const ConsoleLineData = (time, message, visibility, style) => ({
    name : DATA_TYPES.CONSOLE_LINE,
    time,
    message,
    visibility,
    style
});

const GameReadyData = (lobbyId, gameId) => ({
    name : DATA_TYPES.GAME_READY,
    lobbyId,
    gameId
});

const LobbyListData = (lobbies) => ({
    name : DATA_TYPES.LOBBY_LIST,
    lobbies
});

const ThreatSpawnedData = (room, threatType, duration, isPaused) => ({
    name: DATA_TYPES.THREAT_SPAWNED,
    room,
    threatType,
    duration,
    isPaused,
});

const ThreatResolvedData = (room) => ({
    name: DATA_TYPES.THREAT_RESOLVED,
    room: room
});
const RoomDestroyedData = (room) => ({
    name: DATA_TYPES.ROOM_DESTROYED,
    room
});
const DelayData = (description, time, speedFactor = 1, progress = 0) => ({
    name: DATA_TYPES.DELAY_DATA,
    description,
    time,
    speedFactor,
    progress,
});

const GameEndData = (result => ({
    name: DATA_TYPES.GAME_END,
    result
}))

const AiRoleData = (role) => ({
    name: DATA_TYPES.AI_ROLE,
    role
});

module.exports = {
  HumanRoomUpdateData,
  HumanToolUpdateData,
  AIPingThreatUpdateData,
  ConsoleLineData,
  GameReadyData,
  LobbyListData,
  ThreatSpawnedData,
  ThreatResolvedData,
  RoomDestroyedData,
  DelayData,
  GameEndData,
  AiRoleData
};
