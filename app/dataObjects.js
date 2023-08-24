/**
 * This file will contain objects for different types of data we will send to the human/AI during the game
 */

// Sync with dataObjects.js on the backend
const DATA_TYPES = {
    HUMAN_ROOM_UPDATE : "humanRoomUpdate",
    CONSOLE_LINE : "consoleLine",
    GAME_READY : "gameReady",
    LOBBY_LIST : "lobbyList",
    THREAT_SPAWNED: "threatSpawned",
    THREAT_RESOLVED: "threatResolved",
    GAME_END : "GameEnd"
}

const HumanRoomUpdateData = (room) => ({
    name : DATA_TYPES.HUMAN_ROOM_UPDATE,
    room
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

const GameEndData = (result => ({
    name: DATA_TYPES.GAME_END,
    result
}))

module.exports = { HumanRoomUpdateData, ConsoleLineData, GameReadyData, LobbyListData, ThreatSpawnedData, ThreatResolvedData, GameEndData };
