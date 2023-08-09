const { ROLES } = require("../constants");
const GAMES = {
    
};

const GAME = (humanUsername, aiUsername) => {
    let gameLength = 4*60*1000;
    let HUMAN_USERNAME = humanUsername;
    let AI_USERNAME = aiUsername;
    let room = "0-0";

    const getRole = (username) => {
        if (username == HUMAN_USERNAME) {
            return ROLES.HUMAN;
        }
        if (username == AI_USERNAME) {
            return ROLES.AI;
        }
        return null;
    }
    const enterRoom = (newRoom) => {
        room = newRoom;
    }
    const getCurrentRoom = () => {
        return room;
    }

    return {
        getRole,
        enterRoom,
        getCurrentRoom
    }
}

const addGame = (gameId, game) => {
    GAMES[gameId] = game;
}

const startGame = (humanUsername, aiUsername) => {
    const gameId = 1;
    addGame(gameId, GAME(humanUsername, aiUsername));
    return gameId;
}

const lookUpRole = (gameId, username) => {
    const game = GAMES[gameId];
    if (!game) {
        return null;
    }
    return game.getRole(username);
}
const lookUpGame = (gameId) => GAMES[gameId];


module.exports = { startGame, lookUpRole, lookUpGame }
