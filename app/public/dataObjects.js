/**
 * This file will contain objects for different types of data we will send to the human/AI during the game
 */

// Sync with dataObjects.js on the frontend
const DATA_TYPES = {
    HUMAN_ROOM_UPDATE : "humanRoomUpdate",
    CONSOLE_LINE : "consoleLine",
    GAME_READY : "gameReady",
	LOBBY_LIST : "lobbyList",
    ROOM_DESTROYED: "roomDestroyed",
    DELAY_DATA: "delayData",
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

const isMessageType = (data, data_type) => {
    return data.name === data_type
}

