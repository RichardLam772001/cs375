const { joinLobby, getPlayersInLobby, clearLobby, leaveLobby, getLobbies } = require("../../lobby/lobby.js");
const { sendToAllClients } = require("../../wss.js");
const { idGenerator } = require("../../utils.js");
const { GameReadyData, LobbyListData } = require("../../dataObjects.js");
const { ANONY_COOKIE_DURATION_MS } = require("../../constants.js");
const { startGame, lookUpRole } = require("../../game/game.js");

const generateUniqueLobbyId = idGenerator();

const userJoined = {}; // quick access if user is currently in lobby

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
	if (Object.keys(userJoined).includes(String(username))) { // already in a lobby!
		return res.send();
	}
	let lobbyId = 0;
	if (body.lobbyId === undefined) {
		lobbyId = generateUniqueLobbyId();
		console.log("POST /lobby/make", body);
	}
	else {
		lobbyId = body.lobbyId;
		console.log("POST /lobby/join", body);
	}

    const isGameReady = joinLobby(lobbyId, username);
	userJoined[username] = lobbyId;

    console.log(`Player ${username} joined lobby ${lobbyId}`);
	
	refreshLobbyPage();
    res.send({ lobbyId });
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

const lobbyLeave = (req, res) => { // wasn't sure if lobbyId should be specified by client, leaving it as option for now
	const body = req.body;
	const username = body.username;
	let lobbyId = 0;
	if (body.lobbyId === undefined) {
		if (Object.keys(userJoined).includes(String(username))) {
			lobbyId = userJoined[username];
		}
		else {
			throw Error("User is not currently in a lobby.");
		}
	}
	else {
		lobbyId = body.lobbyId;
	}
	console.log("POST /lobby/leave", body);
	
	leaveLobby(lobbyId, username);
	delete userJoined[username];
	refreshLobbyPage();
	return res.send();
}

const lobbiesGet = (req, res) => {
	console.log("GET /lobby/list");
	
	return res.send(prepLobbiesData(getLobbies()));
}

const joinStatusGet = (req, res) => {
	const body = req.body;
	const username = body.username;
	console.log("POST /lobby/joinstatus", body);
	
	if (Object.keys(userJoined).includes(String(username))) {
		return res.send({ "lobbyId": userJoined[username] });
	}
	else {
		return res.send();
	}
}

const prepLobbiesData = (lobbies) => {
	const lobbyIds = Object.keys(lobbies);
	let lobbyList = {};
	for (let id of lobbyIds) {
		let hostname = (lobbies[id][0] === undefined) ? "[no host]" : lobbies[id][0]["username"];
		let playerCount = lobbies[id].length;
		lobbyList[id] = [id, hostname, playerCount + "/2"]; // data accessible from main lobby: id, host username, etc...
	}
	return lobbyList;
}

const refreshLobbyPage = () => {
	sendToAllClients(LobbyListData(prepLobbiesData(getLobbies())));
}


module.exports = { lobbyJoin, lobbyJoinGame, lobbyLeave, lobbiesGet, joinStatusGet };
