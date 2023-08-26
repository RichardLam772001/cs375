WS.onReceive((data) => {
    console.log("WS Received data", data);
    if (isMessageType(data, DATA_TYPES.GAME_READY) && JOINED_LOBBY_ID.toString() === data.lobbyId) {
        joinGame(data.gameId);
    }
	else if (isMessageType(data, DATA_TYPES.LOBBY_LIST)) {
		updateLobbyData(data.lobbies);
	}
});
