const { joinLobby, getPlayersInLobby, clearLobby } = require("../../lobby/lobby.js");
const { sendToAllClients } = require("../../wss.js");
const { GameReadyData } = require("../../dataObjects.js");
const { ANONY_COOKIE_DURATION_MS } = require("../../constants.js");
const { startGame, lookUpRole } = require("../../game/game.js");

const startGameIfReady = (isGameReady, lobbyId) => {
    if (isGameReady) {
        const [humanPlayer, aiPlayer] = getPlayersInLobby(lobbyId);
        const gameId = startGame(humanPlayer.username, aiPlayer.username);
        clearLobby(lobbyId);
        sendToAllClients(GameReadyData(lobbyId, gameId));
    }
}

const lobbyJoin = (req, res) => {
    const body = req.body;
    const lobbyId = body.lobbyId;
    const username = body.username;
    console.log("POST /lobby/join", body);

    const isGameReady = joinLobby(lobbyId, username);

    console.log(`Player ${username} joined lobby ${lobbyId}`);
    res.send();
    setTimeout(() => startGameIfReady(isGameReady, lobbyId), 1000);
}

const lobbyJoinGame = (req, res) => {
    const body = req.body;
    const username = body.username;
    const gameId = body.gameId;
    console.log("POST /lobby/join-game", body);

    const role = lookUpRole(gameId, username);

    res.cookie('username', username, { maxAge: ANONY_COOKIE_DURATION_MS, httpOnly: false});
    // res.cookie('validation-cookie', validation-cookie, { maxAge: ANONY_COOKIE_DURATION_MS, httpOnly: false}); // TO DO!!!
    res.cookie('gameId', gameId, { maxAge: ANONY_COOKIE_DURATION_MS, httpOnly: false});

    return res.send({ role });
}

module.exports = { lobbyJoin, lobbyJoinGame };
