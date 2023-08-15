/**
 * This file will contain objects for different types of data we will send to the human/AI during the game
 */

// Sync with dataObjects.js on the frontend
const DATA_TYPES = {
    HUMAN_ROOM_UPDATE : "humanRoomUpdate",
    CONSOLE_LINE : "consoleLine",
    GAME_READY : "gameReady",
	LOBBY_LIST : "lobbyList"
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

const isMessageType = (data, data_type) => {
    return data.name === data_type
}
