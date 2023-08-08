const { randomInt } = require("../utils.js");
const { PLAYERS_PER_GAME, ROLES } = require("../constants.js");

const LOBBIES = {};

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
        LOBBIES[lobbyId][1] = {username};
    }
    else {
        LOBBIES[lobbyId] = [{username}];
    }
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

/**
 * 
 * @param {number} lobbyId 
 * @param {string} playerUserName 
 * @returns the role of the player if they are in the lobby
 */
const lookUpRole = (lobbyId, playerUserName) => {

    throwOnInvalidLobbyId(lobbyId);

    if (LOBBIES[lobbyId][0].username === playerUserName) {
        return LOBBIES[lobbyId][0].role;
    }
    return LOBBIES[lobbyId][1].role;
}

module.exports = { joinLobby, lookUpRole }
