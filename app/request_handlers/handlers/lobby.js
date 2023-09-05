const { joinLobby, getPlayersInLobby, clearLobby, leaveLobby, isUserInLobby, getFormattedLobbies, getLobbyUserIsIn, deleteUserFromLobby } = require("../../lobby/lobby.js");
const { sendToAllClients } = require("../../wss.js");
const { GameReadyData, LobbyListData } = require("../../dataObjects.js");
const { ANONY_COOKIE_DURATION_MS } = require("../../constants.js");
const { startGame, lookUpRole } = require("../../game/game.js");
const { getPool } = require("../../database/pool.js");
const { CLIENTS_HANDLER } = require("../../clientsHandler.js")

const startGameIfReady = (isGameReady, lobbyId) => {
    if (isGameReady) {
        const [humanPlayer, aiPlayer] = getPlayersInLobby(lobbyId);
        const gameId = startGame(humanPlayer.username, aiPlayer.username);
        clearLobby(lobbyId);
		refreshLobbyPage();
        sendToAllClients(GameReadyData(lobbyId, gameId));
    }
}

const lobbyJoin = (req, res) => {
    const body = req.body;
	const username = body.username;
	const lobbyId = body.lobbyId;

	console.log("POST /lobby/join", body);

	if (isUserInLobby(username, lobbyId)) {
		res.statusCode = 400;
		return res.send({error: "Already in lobby"});
	}
	if (!body.lobbyId) {
		return res.send();
	}

    const isGameReady = joinLobby(lobbyId, username);

    console.log(`Player ${username} joined lobby ${lobbyId}`);
	
	refreshLobbyPage();
	res.cookie('username', username, { maxAge: ANONY_COOKIE_DURATION_MS, httpOnly: false});
    res.send({ lobbyId });
    setTimeout(() => startGameIfReady(isGameReady, lobbyId), 1000);
}

const lobbyJoinGame = (req, res) => {
    const body = req.body;
    const username = body.username;
    const gameId = body.gameId;
    console.log("POST /lobby/join-game", body);

    const role = lookUpRole(gameId, username);
	deleteUserFromLobby(username);

    res.cookie('username', username, { maxAge: ANONY_COOKIE_DURATION_MS, httpOnly: false});
    // res.cookie('validation-cookie', validation-cookie, { maxAge: ANONY_COOKIE_DURATION_MS, httpOnly: false}); // TO DO!!!
    res.cookie('gameId', gameId, { maxAge: ANONY_COOKIE_DURATION_MS, httpOnly: false});

    return res.send({ role });
}

const lobbyLeave = (req, res) => {
	const body = req.body;
	const username = body.username;
	const lobbyId = body.lobbyId;
	console.log("POST /lobby/leave", body);
	
	const isSuccess = leaveLobby(lobbyId, username);
	if (isSuccess) {
		refreshLobbyPage();
		return res.sendStatus(200);
	}
	return res.sendStatus(400);
}

const lobbiesGet = (_, res) => {
	console.log("GET /lobby/list");	
	return res.send(LobbyListData(getFormattedLobbies()));
}

const refreshLobbyPage = () => {
	sendToAllClients(LobbyListData(getFormattedLobbies()));
}

const lobbyIsJoined = (req, res) => {
	const body = req.body;
	const username = body.username;
	if (isUserInLobby(username)) {
		return res.send({"lobbyId" : getLobbyUserIsIn(username)});
	}
	res.statusCode = 400;
	return res.send({"lobbyId" : -1});
}

const lobbyStats = (req, res) => {
	const username = req.cookies.username;
	const token = req.cookies.token;
	const stats = {"wins": undefined, "losses": undefined};
	
	const pool = getPool();
	if (CLIENTS_HANDLER.isUserLoggedin(token)) {
		pool.query('SELECT wins, losses FROM userdata WHERE username=$1', [username]).then((result) => {
			const data = result.rows;
			if (data.length !== 0) {
				stats.wins = data[0].wins;
				stats.losses = data[0].losses;
			}
			return res.send(stats);
		}).catch((error) => {
			console.error('Error getting player stats:', error);
			res.statusCode = 400;
			return res.send(stats);
		});
	}
	else {
		return res.send(stats);
	}
}

const getLeaderboard = (req, res) => {
	const pool = getPool();
	pool.query('SELECT username, wins, losses FROM userdata ORDER BY wins DESC').then((result) => {
		const stats = result.rows;
		return res.send({"leaderboard": stats});
	}).catch((error) => {
		console.error('Error getting leaderboard:', error);
		return res.sendStatus(500);
	});
}

module.exports = { lobbyJoin, lobbyJoinGame, lobbyLeave, lobbiesGet, lobbyIsJoined, lobbyStats, getLeaderboard };
