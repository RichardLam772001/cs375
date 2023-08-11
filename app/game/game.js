const { ROLES, GAME_TICK_DELAY_MS } = require("../constants");
const { Threat, THREAT_COOLDOWN_SECONDS, MAX_THREATS_ACTIVE } = require("./threat");
const { randomInt, randomChoice } = require("../utils.js");

const { ConsoleLinesLog } = require("../consoleLinesLog.js");
const { ConsoleLineData } = require("../dataObjects.js");
const { Room } = require("./room.js");

const GAMES = {
    
};

const selectThreatRoom = (availableRooms, roomsWithThreats) => {
    
    const roomCandidates = availableRooms.filter((room) => !(room in roomsWithThreats));
    console.log(`selecting room out of ${roomCandidates.length} candidates`)
    return roomCandidates[randomInt(0, roomCandidates.length - 1)];
}

const GAME = (humanUsername, aiUsername) => {
    const gameTime = 4*60;
    let timeRemaining = gameTime;

    let HUMAN_USERNAME = humanUsername;
    let AI_USERNAME = aiUsername;

    //ROOMS
    const SHIP_SIZE = [3,3];
    const SHIP_ROWS = SHIP_SIZE[0];
    const SHIP_COLS = SHIP_SIZE[1];

    const ROOMS = []; //2D array of all room objects
    const AVAILABLE_ROOMS = []; //Rooms that have not been destroyed
    generateRooms();
    let humanRoom = ROOMS[0][0];


    // THREATS
    // Temp for testing: Spawns threat right away, TO DO: Determine when to spawn threats
    let threatCooldown = THREAT_COOLDOWN_SECONDS;
    const THREATS = [];    
    const ROOMS_WITH_THREATS = [];
    const MAX_ROOMS_DESTROYED = 3; //The game ends when this many rooms are destroyed
    
    let roomsDestroyed = 0;

    let consoleLinesLog = ConsoleLinesLog();

    function generateRooms(){
        for(let r = 0; r < SHIP_SIZE[0]; ++r){
            ROOMS.push([]);
            for(let c = 0; c < SHIP_SIZE[1]; ++c){
                const newRoom = Room(r,c);

                ROOMS[r].push(newRoom);
                AVAILABLE_ROOMS.push(newRoom);
            }
        }
    }

    const getRole = (username) => {
        if (username == HUMAN_USERNAME) {
            return ROLES.HUMAN;
        }
        if (username == AI_USERNAME) {
            return ROLES.AI;
        }
        return null;
    }
    //Whether the room exists on the spaceship
    const validateRoomPos = (x, y) =>{
        return x >= 0 && x < SHIP_ROWS && y >= 0 && y < SHIP_COLS;
    }
    const roomIsDestroyed = (room) =>{
        return AVAILABLE_ROOMS.indexOf(room) === -1;
    }
    const enterRoom = (roomString) => { //TODO: Validation
        let coords = roomString.split("-");
        return enterRoomPos(coords[0], coords[1]);
    }
    const enterRoomPos = (x,y) => {
        if(!validateRoomPos(x,y)) return;
        let room = ROOMS[x][y];

        if (roomIsDestroyed(room)) {
            console.log(`GAME - Cannot enter room ${room.name}`);
        }
        else {
            humanRoom = room;
        }
    }
    //Retuns string representation
    const getCurrentRoom = () => {
        return `${humanRoom.x}-${humanRoom.y}`;
    }
    const trySpawnThreat= () => {
        if(THREATS.length >= MAX_THREATS_ACTIVE) return; //too many threats

        const threatRoom = selectThreatRoom(AVAILABLE_ROOMS, ROOMS_WITH_THREATS);
        if(threatRoom == undefined) return; // No valid room was picked
        const threat = Threat(() => onThreatUnresolved(threatRoom, THREATS.length));
        THREATS.push(threat);
        console.log(`Threat spawned in room ${threatRoom.name}`);
    }
    // This is called once every second
    const tick = (deltaSeconds) => {
        timeRemaining -= deltaSeconds;

        // Threats
        if (threatCooldown <= 0) {
            trySpawnThreat();
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
        let message = `ROOM ${room.name} HAS BEEN DESTROYED BY ${"<threatType>"}`;
        let line = ConsoleLineData(timeRemaining, message, undefined, "critical");
        addConsoleLineAndBroadcast(line);
        console.log(message);

        roomsDestroyed++;
        if(roomsDestroyed >= MAX_ROOMS_DESTROYED){
            onShipDestroyed();
        }
    }

    //Attempt to ping a room, but randomly scramble it first
    const scrambleThenPing = (row, column, threatType) =>{
        let scrambleCount = randomChoice([[50, 0], [30, 1], [20, 2]]);
        console.log(`scrambles: ${scrambleCount}`);
        pingRoom(row, column, threatType);
    }

    //Actually ping this room
    const pingRoom = (row, column, threatType) => {
        if(!validateRoomPos(row,column)) return;

        let room = ROOMS[row][column];

        let line = ConsoleLineData(timeRemaining, `AI pings ${threatType} at ${room.name}`);
        addConsoleLineAndBroadcast(line);
    }

    function addConsoleLineAndBroadcast(consoleLine){
        consoleLinesLog.addConsoleLine(consoleLine);

        //TODO: either broadcast this line now, or have the ConsoleLinesLog broadcast it when appended
    }

    function onTimeUp(){
        endGame();
    }
    function onShipDestroyed(){
        endGame();
    }
    function endGame(){
        //TODO: Remove this Game object from the collection of games and direct the players to the end screen
    }

    function testPings(){
        for(let i = 0; i < 20; ++i){
            scrambleThenPing(0,0,"");
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
