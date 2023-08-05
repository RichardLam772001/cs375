const { joinLobby } = require("../../lobby/lobby.js");
const { sendToAllClients } = require("../../wss.js");
const { GameReadyData } = require("../../dataObjects.js");
const { ANONY_COOKIE_DURATION_MS } = require("../../constants.js");

const lobbyJoin = (req, res) => {
    const body = req.body;
    const lobbyId = body.lobbyId;
    const username = body.username;

    const isGameReady = joinLobby(lobbyId, username);

    console.log(`Player ${username} joined lobby ${lobbyId}`);
    res.cookie('username', username, { maxAge: ANONY_COOKIE_DURATION_MS, httpOnly: false});
    res.send();

    if (isGameReady) {
        sendToAllClients(GameReadyData(lobbyId));
    }
}

module.exports = { lobbyJoin };
