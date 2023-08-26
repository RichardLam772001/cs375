const { randomInt } = require("../utils.js");
const { PLAYERS_PER_GAME, ROLES } = require("../constants.js");

// e.g. {1: [{'username' : 1}, {'username' : 2}]}
// will have roles if game is starting. e.g. {1: [{'username' : 1, 'role' : ROLES.AI}, {'username' : 2, 'role' : ROLES.HUMAN}]}
const LOBBIES = {};

// For quick lookup (maps username to lobby id)
// e.g. {'some_username' : 1}
const USERS_IN_A_LOBBY = {};

/**
 * Populates LOBBIES with empty lobbies
 */
const populateLOBBIES = () => {
	for (let i=0; i < 20; i++) {
		LOBBIES[i] = [];
	}
}
populateLOBBIES();

const throwOnInvalidLobbyId = (lobbyId) => {
    if (!(lobbyId in LOBBIES)) {
        throw Error(`Lobby ID ${lobbyId} does not exist`);
    }
}

/**
 * 
 * @param {number} id lobby to join
 * @param {string} username username to identify user
 * @returns boolean whether the game has enough people to start
 */
const joinLobby = (lobbyId, username) => {
    if (lobbyId in LOBBIES) {
        if (LOBBIES[lobbyId].length === PLAYERS_PER_GAME) {
            throw Error("Lobby full!");
        }
        LOBBIES[lobbyId].push({username});
    }
    else {
        LOBBIES[lobbyId] = [{username}];
    }

    USERS_IN_A_LOBBY[username] = lobbyId;

    const isLobbyFull = LOBBIES[lobbyId].length === PLAYERS_PER_GAME;
    if (isLobbyFull) {
        assignRoles(lobbyId);
    }
    return isLobbyFull;
}

/**
 * 
 * @param {number} lobbyId lobby id of the game to start
 */
const assignRoles = (lobbyId) => {

    throwOnInvalidLobbyId(lobbyId);
    if (LOBBIES[lobbyId][0].role in ROLES) {
        throw Error(`Game with lobby id ${lobbyId} has already started`);
    }
    const indexOfHumanPlayer = randomInt(0, 1);
    const indexOfAIPlayer = 1 - indexOfHumanPlayer;
    LOBBIES[lobbyId][indexOfHumanPlayer].role = ROLES.HUMAN;
    LOBBIES[lobbyId][indexOfAIPlayer].role = ROLES.AI;
}

const clearLobby = (lobbyId) => {
	LOBBIES[lobbyId] = [];
}

/**
 * Does nothing if username is not in lobby or if lobbyId is invalid
 * @param {number} lobbyId 
 * @param {string} username
 * @returns {boolean} whether username left lobby or not
 */
const leaveLobby = (lobbyId, username) => {
	if (lobbyId in LOBBIES) {
		if (LOBBIES[lobbyId].length == 2) {
			console.log("Game starting soon, cannot leave lobby.");
			return false;
		}
        // Removes user
        if (LOBBIES[lobbyId][0].username === username) {
            LOBBIES[lobbyId].splice(0, 1);
        }
		else if (LOBBIES[lobbyId][1].username === username) {
            LOBBIES[lobbyId].splice(1, 1);
		}
        delete USERS_IN_A_LOBBY[username];
	}
    return true;
}

/**
 * 
 * @param {number} lobbyId 
 * @returns array of size 2, 1st element will be player w/ human role, 2nd element will be player w/ ai role
 */
const getPlayersInLobby = (lobbyId) => {
    const players = LOBBIES[lobbyId];
    return players[0].role === ROLES.HUMAN ? players : [players[1], players[0]];
}

const getLobbies = () => {
	return LOBBIES;
}
/**
 * @returns e.g. [{lobbyId: 1, playerCount: 2}, ...]
 */
const getFormattedLobbies = () => {
    const formattedLobbies = [];
    for (const lobbyId of Object.keys(LOBBIES)) {
        formattedLobbies.push({ lobbyId, playerCount: LOBBIES[lobbyId].length});
    }
    return formattedLobbies;
}


const isUserInLobby = (username) => {
	return username in USERS_IN_A_LOBBY;
}
const getLobbyUserIsIn = (username) => {
    return USERS_IN_A_LOBBY[username];
}

module.exports = {
    joinLobby,
    getPlayersInLobby,
    clearLobby,
    leaveLobby,
    getLobbies,
    getFormattedLobbies,
    isUserInLobby,
    getLobbyUserIsIn
};
