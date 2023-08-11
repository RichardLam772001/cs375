const { ROLES, GAME_TICK_DELAY_MS } = require("../constants");
const { Threat, THREAT_COOLDOWN_SECONDS } = require("./threat");
const { randomInt, randomChoice } = require("../utils.js");

const { ConsoleLinesLog } = require("../consoleLinesLog.js");
const { ConsoleLineData } = require("../dataObjects.js");

const GAMES = {
    
};

const selectThreatRoom = (avilableRooms, roomsWithThreats) => {
    const rooms = avilableRooms.filter((room) => !(room in roomsWithThreats));
    return rooms[randomInt(0, rooms.length - 1)];
}

const GAME = (humanUsername, aiUsername) => {
    const gameTime = 4*60;
    let timeRemaining = gameTime;

    let HUMAN_USERNAME = humanUsername;
    let AI_USERNAME = aiUsername;
    let room = "0-0";
    let threatCooldown = THREAT_COOLDOWN_SECONDS;

    // Temp for testing: Spawns threat right away, TO DO: Determine when to spawn threats
    const THREATS = [];
    const AVAILABLE_ROOMS = ["0-0", "0-1", "0-2", "1-0", "1-1", "1-2", "2-0", "2-1", "2-2"]; // Richard: Yes I know it's hardcoded, we can make a dynamic room generator later TO DO 
    const ROOMS_WITH_THREATS = [];

    let consoleLinesLog = ConsoleLinesLog();

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
    const tick = (deltaSeconds) => {
        timeRemaining -= deltaSeconds;

        // Threats
        if (threatCooldown <= 0) {
            const threatRoom = selectThreatRoom(AVAILABLE_ROOMS, ROOMS_WITH_THREATS);
            const threat = Threat(() => onThreatUnresolved(threatRoom, THREATS.length));
            THREATS.push(threat);
            console.log(`Threat spawned in room ${threatRoom}`);
            threatCooldown = THREAT_COOLDOWN_SECONDS;
        }
        else {
            threatCooldown -= deltaSeconds;
        }

        if(timeRemaining <= 0){
            return onTimeUp();
        }

    }
    const onThreatUnresolved = (room, threatId) => {
        THREATS.splice(threatId, 1); // Remove threat from THREATS list
        AVAILABLE_ROOMS.splice(AVAILABLE_ROOMS.indexOf(room), 1);
        console.log(`Threat was unresolved room ${room} is no longer available`);
    }
    const roomName = (row, column) =>{
        return `${String.fromCharCode(65 + row)}${column}`;
    }    

    //Attempt to ping a room, but randomly scramble it first
    const tryPingRoom = (row, column, threatType) =>{
        let scrambleCount = randomChoice([[50, 0], [30, 1], [20, 2]]);
        console.log(`scrambles: ${scrambleCount}`);
        pingRoom(row, column, threatType);
    }

    //Actually ping this room
    const pingRoom = (row, column, threatType) => {
        let line = ConsoleLineData(timeRemaining, `AI pings ${threatType} at ${roomName(row,column)}`);
        addConsoleLineAndBroadcast(line);
    }

    function addConsoleLineAndBroadcast(consoleLine){
        consoleLinesLog.addConsoleLine(consoleLine);
        //broadcaster.sendBoth(consoleLine);
        //sendToAllClients(consoleLine);
    }

    function onTimeUp(){
        endGame();
    }
    function onShipDestroyed(){
        endGame();
    }
    function endGame(){
    }

    function testPings(){
        for(let i = 0; i < 20; ++i){
            tryPingRoom(0,0,"");
        }
    }
    testPings();

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

const tickGames = () => {
    for (const gameId of Object.keys(GAMES)) {
        GAMES[gameId].tick(GAME_TICK_DELAY_MS);
    }
}

setInterval(tickGames, GAME_TICK_DELAY_MS);

module.exports = { startGame, lookUpRole, lookUpGame }
