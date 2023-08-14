const { ROLES, GAME_TICK_DELAY_MS } = require("../constants");
const { Threat, THREAT_COOLDOWN_SECONDS, THREAT_TTL } = require("./threat");
const { randomInt } = require("../utils.js");
const { sendDataToPlayer } = require("../broadcaster.js");
const { ThreatSpawnedData } = require("../dataObjects");

const GAMES = {
    
};

const selectThreatRoom = (avilableRooms, roomsWithThreats) => {
    const rooms = avilableRooms.filter((room) => !(room in roomsWithThreats));
    return rooms[randomInt(0, rooms.length - 1)];
}

const GAME = (humanUsername, aiUsername, gameId) => {

    const GAME_ID = gameId;

    let gameTime = 4*60;
    let HUMAN_USERNAME = humanUsername;
    let AI_USERNAME = aiUsername;
    let room = "0-0";
    let threatCooldown = THREAT_COOLDOWN_SECONDS;

    // Temp for testing: Spawns threat right away, TO DO: Determine when to spawn threats
    const THREATS = [];
    const AVAILABLE_ROOMS = ["0-0", "0-1", "0-2", "1-0", "1-1", "1-2", "2-0", "2-1", "2-2"]; // Richard: Yes I know it's hardcoded, we can make a dynamic room generator later TO DO 
    const ROOMS_WITH_THREATS = [];

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
        // If room not available (cause destroyed), cant enter
        if (AVAILABLE_ROOMS.indexOf(newRoom) === -1) {
            console.log(`GAME - Cannot enter room ${newRoom}`);
        }
        else {
            room = newRoom;
        }
    }
    const getCurrentRoom = () => {
        return room;
    }
    // This is called once every second
    const tick = () => {
        gameTime -= 1;

        // Threats
        if (threatCooldown <= 0) {
            spawnThreat();
        }
        else {
            threatCooldown -= 1;
        }
    }

    const spawnThreat = () => {
        const threatRoom = selectThreatRoom(AVAILABLE_ROOMS, ROOMS_WITH_THREATS);
        const threat = Threat(() => onThreatUnresolved(threatRoom, THREATS.length));
        THREATS.push(threat);
        console.log(`Threat spawned in room ${threatRoom}`);
        threatCooldown = THREAT_COOLDOWN_SECONDS;
        alertAIPlayerOfThreat(threatRoom);
    }

    const alertAIPlayerOfThreat = (room) => {
        sendDataToPlayer(GAME_ID, AI_USERNAME, ThreatSpawnedData(room, "fire", THREAT_TTL, false));
    }

    const onThreatUnresolved = (room, threatId) => {
        THREATS.splice(threatId, 1); // Remove threat from THREATS list
        AVAILABLE_ROOMS.splice(AVAILABLE_ROOMS.indexOf(room), 1);
        console.log(`Threat was unresolved room ${room} is no longer available`);
    }

    return {
        tick,
        getRole,
        enterRoom,
        getCurrentRoom
    }
}

const addGame = (gameId, game) => {
    GAMES[gameId] = game;
}

const startGame = (humanUsername, aiUsername) => {
    // Temp: TO DO - Replace with idGenerator when we want to test multiple games running at once
    // For now priority is getting 1 game working beginning to end
    const gameId = 1;
    addGame(gameId, GAME(humanUsername, aiUsername, gameId));
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

const tickGames = () => {
    for (const gameId of Object.keys(GAMES)) {
        GAMES[gameId].tick();
    }
}

setInterval(tickGames, GAME_TICK_DELAY_MS);

module.exports = { startGame, lookUpRole, lookUpGame }
