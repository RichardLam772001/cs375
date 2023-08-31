// @ts-check
const { ROLES, GAME_TICK_DELAY_MS } = require("../constants");
const { Threat, THREAT_COOLDOWN_SECONDS, THREAT_TTL } = require("./threat");
const { randomInt, randomSelect, idGenerator} = require("../utils.js");
const { sendDataToPlayer } = require("../broadcaster.js");
const { ThreatSpawnedData, ThreatResolvedData, RoomDestroyedData, HumanToolUpdateData, AIPingThreatUpdateData, HumanRoomUpdateData, DelayData, AiRoleData} = require("../dataObjects");
const { CLIENTS_HANDLER } = require("../clientsHandler");

const { RandomBag } = require("../randomBag.js");
const { ConsoleLinesLog, isLineVisibleToHuman, isLineVisibleToAI } = require("../consoleLinesLog.js");
const { ConsoleLineData } = require("../dataObjects.js");
const { GameEndData } = require("../dataObjects.js");

const { DelayedAction } = require("./delayedAction.js");
const { setAiRole } = require("./airole.js");

const GAMES = {
    
};

/**
 * Function selects a room for a threat to spawn in. A threat cannot spawn in the same room as a player, another threat, or a destroyed roomn.
 * @param {string[]} avilableRooms 
 * @param {string[]} roomsWithThreats 
 * @param {string} playerRoom 
 * @returns Threat room
 */
const selectThreatRoom = (avilableRooms, roomsWithThreats, playerRoom) => {
    const rooms = avilableRooms
        .filter((room) => roomsWithThreats.indexOf(room) === -1)
        .filter((room) => room !== playerRoom);
    return rooms[randomInt(0, rooms.length - 1)];
}

const GAME = (humanUsername, aiUsername, gameId) => {

    const GAME_ID = gameId;

    let gameTime = 2*60;
    let HUMAN_USERNAME = humanUsername;
    let AI_USERNAME = aiUsername;
    let room = "0-0";
    let threatCooldown = THREAT_COOLDOWN_SECONDS;

    let AI_ROLE = setAiRole();


    //ROOMS
    const SHIP_SIZE = [3,3];
    const SHIP_ROWS = SHIP_SIZE[0];
    const SHIP_COLS = SHIP_SIZE[1];

    //ACTIONS
    let humanAction;
    const humanCanAct = () => {return !humanIsActing();};
    const humanIsActing = () => {return humanAction !== undefined && humanAction.getIsRunning();};
    let aiAction;
    const aiCanAct = () => {return !aiIsActing();};
    const aiIsActing = () => {return aiAction !== undefined && aiAction.getIsRunning();};
    let trustLevel = 0;

    //ACTION DELAYS
    const pingTime = 3;
    const moveTime = 2;
    const toolSwitchTime = 2;
    const resolveThreatTime = 3;
    const setTrustTime = 1;

    let aiSpeedFactor = 1; //changes action speed for AI player
    const boostSpeedFactor = 1.25;
    const inhibitSpeedFactor = 0.70;

    let threatSpeedFactor = 1;
    const inhibitThreatFactor = 0.5;
    

    const THREATS_INDEXED_BY_ROOM = {};
    const AVAILABLE_ROOMS = ["0-0", "0-1", "0-2", "1-0", "1-1", "1-2", "2-0", "2-1", "2-2"]; // Richard: Yes I know it's hardcoded, we can make a dynamic room generator later TO DO
    const ROOMS_WITH_THREATS = [];
    const THREAT_TYPES = ["fire", "breach", "invader"];
    const TOOLS = ["fire-extinguisher", "gun", "wrench"]; // Currently unused
    const MAX_ACTIVE_THREATS = 3;
    
    let consoleLinesLog = ConsoleLinesLog();
    let currentTool = "wrench";

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
    const roomCanBeEntered = (room) => {
        return AVAILABLE_ROOMS.indexOf(room) !== -1;
    }
    const enterRoom = (newRoom) => {
        if(!humanCanAct()) return;

        if (!roomCanBeEntered(newRoom)) {
            console.log(`GAME - Cannot enter room ${newRoom}`);
            return;
        }
        
        humanAction = DelayedAction(moveTime);
        humanAction.setOnFinish(() => doEnterRoom(newRoom));
        sendDataToHuman(DelayData(`Moving to ${newRoom}...`, moveTime));
        
    }
    const doEnterRoom = (newRoom) =>{
        if (!roomCanBeEntered(newRoom)) { //we must check again, because the room might have been destroyed while the action was charging
            console.log(`GAME - Cannot enter room ${newRoom}`);
            return;
        }

        room = newRoom;
        if (ifRoomHasThreat(room)) {
            alertHumanPlayerOfThreat(room);

            const threat = THREATS_INDEXED_BY_ROOM[room];
            if(threat.correctTool(currentTool)){
                startResolvingThreat(threat);
            }
        }
        sendDataToBothPlayers(HumanRoomUpdateData(room));
        addConsoleLineAndBroadcast(ConsoleLineData(
            gameTime, 
            `Human moves to room ${room}`, 
            undefined, 
            "public"));
    }
    const getCurrentRoom = () => {
        return room;
    }
    const startResolvingThreat = (threat) => {
        if(!humanCanAct()) return;

        threat.startResolving();

        humanAction = DelayedAction(resolveThreatTime, () => threat.finishResolve());
        //humanAction.setAllowCompletion(false); //uncomment this once threat minigames are implemented
        sendDataToHuman(DelayData(`Resolving ${threat.THREAT_TYPE}...`, resolveThreatTime));
    }

    /**
     * Called when the human completed a threat minigame.
     * This allows the current human action to complete.
     */
    const completeThreatMinigame = () => {
        humanAction.setAllowCompletion(true);
    }

    const tick = (deltaSeconds) => {

        // Pause game if clients in game aren't registered (client hasn't connected yet, or one of them logged out)
        if (!CLIENTS_HANDLER.doesGameHaveRegisteredClients(gameId)) {
            console.log(`Game paused. There are not 2 clients connected to the gameId ${gameId}`);
            return;
        }

        gameTime -= deltaSeconds;
        if (gameTime <= 0) {
            resolveGame('win');
            return;
        }
        if (AVAILABLE_ROOMS.length < 7) {
            resolveGame('lose');
            return;
        }

        humanAction?.tick(deltaSeconds);
        aiAction?.tick(deltaSeconds, aiSpeedFactor);

        // Threats

        const threatDeltaSeconds = deltaSeconds*threatSpeedFactor;
        for(const threatenedRoom of ROOMS_WITH_THREATS){
            THREATS_INDEXED_BY_ROOM[threatenedRoom].tick(threatDeltaSeconds);
        }

        if (threatCooldown <= 0 && ROOMS_WITH_THREATS.length < MAX_ACTIVE_THREATS) {
            spawnThreat();
        }
        else{
            threatCooldown -= deltaSeconds;
        }
    }

    const reverseResult = (result) => {
        if (result === 'win') {
            return 'lose';
        }
        else {
            return 'win';
        }
    }

    const resolveGame = (result) => {
        let humanResult = result;
        let aiResult = AI_ROLE.isAiEvil() ? reverseResult(result) : result;
        if (CLIENTS_HANDLER.areBothPlayersLoggedIn(GAME_ID, AI_USERNAME, HUMAN_USERNAME)) {
            CLIENTS_HANDLER.updatePlayerStats(HUMAN_USERNAME, humanResult);
            CLIENTS_HANDLER.updatePlayerStats(AI_USERNAME, aiResult);
        }
        sendDataToHuman(GameEndData(humanResult));
        sendDataToAI(GameEndData(aiResult));
        removeGame(GAME_ID);
    }


    const spawnThreat = () => {
        const threatRoom = selectThreatRoom(AVAILABLE_ROOMS, ROOMS_WITH_THREATS, room);
        const threat = Threat(randomlySelectThreat(), () => onThreatUnresolved(threatRoom), () => onThreatResolved(threatRoom));
        THREATS_INDEXED_BY_ROOM[threatRoom] = threat;
        ROOMS_WITH_THREATS.push(threatRoom);
        console.log(`Threat spawned in room ${threatRoom}`);
        threatCooldown = THREAT_COOLDOWN_SECONDS;
        alertAIPlayerOfThreat(threatRoom);
    }

    const randomlySelectThreat = () => {
        return THREAT_TYPES[randomInt(0, THREAT_TYPES.length-1)];
    }

    /**
     * Used by both alertAIPlayerOfThreat and alertHumanPlayerOfThreat
     */
    const alertPlayerOfThreat = (threat, username, room) => {
        console.log(threat, room);
        console.log(THREATS_INDEXED_BY_ROOM);
        sendDataToPlayer(GAME_ID, username, ThreatSpawnedData(room, threat.THREAT_TYPE, THREAT_TTL, false));  
    }
    /**
     * @param {string} room e.g. 0-0 to index with 
     */
    const alertAIPlayerOfThreat = (room) => {
        alertPlayerOfThreat(THREATS_INDEXED_BY_ROOM[room], AI_USERNAME, room);
    }
    /**
     * @param {string} room e.g. 0-0 to index with 
     */
    const alertHumanPlayerOfThreat = (room) => {
        alertPlayerOfThreat(THREATS_INDEXED_BY_ROOM[room], HUMAN_USERNAME, room);
    }
    const sendRoleToAI = () => {
        sendDataToAI(AiRoleData(AI_ROLE.roleToString()));
    }
    const sendDataToBothPlayers = (data) =>{
        sendDataToHuman(data);
        sendDataToAI(data);
    }
    const sendDataToHuman = (data) =>{
        sendDataToPlayer(GAME_ID, HUMAN_USERNAME, data);    
    }
    const sendDataToAI = (data) =>{
        sendDataToPlayer(GAME_ID, AI_USERNAME, data);
    }

    const removeThreat = (room) => {
        delete THREATS_INDEXED_BY_ROOM[room] // Remove threat
        ROOMS_WITH_THREATS.splice(ROOMS_WITH_THREATS.indexOf(room), 1); // Removes room from rooms_with_threats
    }

    const destroyRoom = (room, threatString) =>{
        AVAILABLE_ROOMS.splice(AVAILABLE_ROOMS.indexOf(room), 1); // Room no longer available
        const consoleLine = ConsoleLineData(gameTime, `ROOM ${room} HAS BEEN DESTROYED BY ${threatString.toUpperCase()}`, undefined, "critical");
        addConsoleLineAndBroadcast(consoleLine);
        sendDataToBothPlayers(RoomDestroyedData(room));
    }

    const onThreatUnresolved = (room) => {
        destroyRoom(room, THREATS_INDEXED_BY_ROOM[room].THREAT_TYPE);
        removeThreat(room);
        console.log(`Threat was unresolved room ${room} is no longer available`);
    }
    const onThreatResolved = (room) => {
        removeThreat(room);
        // Alert players threat was resolved
        sendDataToPlayer(GAME_ID, AI_USERNAME, ThreatResolvedData(room));
        sendDataToPlayer(GAME_ID, HUMAN_USERNAME, ThreatResolvedData(room));

        const message = `Threat was resolved in room ${room}`;
        console.log(message);
        addConsoleLineAndBroadcast(ConsoleLineData(gameTime, message, "all", "important"));
    }

    /**
     * Queue up a ping action for the AI player
     * @param {string} room 
     * @param {string} threatType 
     */
    const requestPing = (room, threatType) =>{
        if(!aiCanAct()) return;

        addConsoleLineAndBroadcast(
            ConsoleLineData(gameTime, `Attempting to ping ${threatType} at ${room}`, "ai", "private")
        );

        aiAction = DelayedAction(pingTime);
        aiAction.setOnFinish(() => scrambleThenPing(room, threatType));
        sendDataToAI(DelayData(`Pinging ${threatType} at ${room}...`, pingTime, aiSpeedFactor));
    }

    /**
     * Attempt to ping a room, but randomly scramble it first
     * @param {string} room e.g. 0-0 
     * @param {string} threatType
     */
    const scrambleThenPing = (room, threatType) =>{
        let row = Number(room[0]);
        let column = Number(room[2]);
        let weights = AI_ROLE.getScrambleWeights();
        let scrambleCount = RandomBag([[weights[0], 0], [weights[1], 1], [weights[2], 2]]).pull();

        const scrambleBag = RandomBag([[1,"row"], [1, "col"], [1,"type"]]); //Different scramble categories may be given different weights
        for(let s = 0; s < scrambleCount; ++s){
            let scrambleFunc = scrambleBag.pull(false);
            switch(scrambleFunc){
                case "row":
                    row = randomSelect([0,1,2], row);
                    break;
                case "col":
                    column = randomSelect([0,1,2], row);
                    break;
                case "type":
                    threatType = randomSelect(THREAT_TYPES, threatType);
                    break;
            }
        }
        pingRoom(row, column, threatType);
    }

    /**
     * Actually sends the ping, will almost always be called by scrambleThenPing
     * @param {number} row 
     * @param {number} column 
     * @param {string} threatType 
     */
    const pingRoom = (row, column, threatType) => {
        if(!validateRoomPos(row,column)) {
            console.log(`DEBUG - Invalid row and column ${row}-${column}`);
            return;
        }

        let message = `AI pings ${threatType} at ${row}-${column}`;
        let line = ConsoleLineData(gameTime, message);
        addConsoleLineAndBroadcast(line);
        sendDataToBothPlayers(AIPingThreatUpdateData(`${row}-${column}`, threatType));
    }

    function addConsoleLineAndBroadcast(consoleLine){
        consoleLine.time = Math.round(gameTime);
        consoleLinesLog.addConsoleLine(consoleLine);

        if(isLineVisibleToHuman(consoleLine)){
            sendDataToPlayer(GAME_ID, HUMAN_USERNAME, consoleLine);        
        }
        if(isLineVisibleToAI(consoleLine)){
            sendDataToPlayer(GAME_ID, AI_USERNAME, consoleLine);   
        }
    }

    const switchHumanTool = (newTool) => {
        if(!humanCanAct()) return;

        // currentTool isnt valid tool
        if (TOOLS.indexOf(newTool) === -1) {
            return;
        }

        humanAction = DelayedAction(toolSwitchTime, () => doSwitchHumanTool(newTool));
        sendDataToHuman(DelayData(`Switching tool to ${newTool}...`, toolSwitchTime));
    };

    const doSwitchHumanTool = (newTool) => {
        currentTool = newTool;
        sendDataToBothPlayers(HumanToolUpdateData(currentTool));
    }

    /**
     * 
     * @param {string} room e.g. 0-0 
     * @returns {boolean}
     */
    const ifRoomHasThreat = (room) => {
        return ROOMS_WITH_THREATS.indexOf(room) !== -1;
    }

    /**
     * Called by the human to request a change of trust level
     * @param {Number} newTrustLevel positive = boost, negative = inhibit
     */
    const setTrustLevel = (newTrustLevel) => {
        if(!humanCanAct() || newTrustLevel == trustLevel) return;

        humanAction = DelayedAction(setTrustTime, () => doSetTrustLevel(newTrustLevel));
        let message;
        if(newTrustLevel > trustLevel){
            message = "Boosting AI...";
        }else{
            message = "Inhibitting AI...";
        }
        sendDataToHuman(DelayData(message, setTrustTime));
    }
    /**
     * Set a trust level for the AI.
     * A positive value will increase action speed, while a negative value will decrease action speed
     * @param {Number} newTrustLevel 
     */
    const doSetTrustLevel = (newTrustLevel) =>{

        aiSpeedFactor = newTrustLevel >= 0 ? boostSpeedFactor : inhibitSpeedFactor;
        const speedPercentage = (aiSpeedFactor)*100 + "%";

        if(newTrustLevel > 0){
            addConsoleLineAndBroadcast(ConsoleLineData(
                gameTime, 
                `Human boosts AI action speed to ${speedPercentage}`, 
                undefined, 
                "important"));
            if(AI_ROLE.isAiEvil() && trustLevel < 0){
                threatSpeedFactor = 1;
                addConsoleLineAndBroadcast(ConsoleLineData(
                    gameTime, 
                    `THREAT SPEED INCREASED to ${threatSpeedFactor*100}% because human trusts us`, 
                    "ai", 
                    "private"));
            }
        }else{
            addConsoleLineAndBroadcast(ConsoleLineData(
                gameTime, 
                `Human inhibits AI action speed to ${speedPercentage}`, 
                undefined, 
                "critical"));
            if(AI_ROLE.isAiEvil()){
                threatSpeedFactor = inhibitThreatFactor;
                addConsoleLineAndBroadcast(ConsoleLineData(
                    gameTime, 
                    `THREAT SPEED REDUCED to ${threatSpeedFactor*100}% to because human is suspicious of us`, 
                    "ai", 
                    "private"));
            }
        }

        trustLevel = newTrustLevel;
        
        if(aiIsActing()){
            sendDataToAI(DelayData("[ACTION SPEED CHANGED]", aiAction.getTotalTime(), aiSpeedFactor, aiAction.getProgress()));
        }

    }

    return {
        tick,
        getRole,
        sendRoleToAI,
        enterRoom,
        getCurrentRoom,
        switchHumanTool,
        requestPing,
        setTrustLevel,
    }
}

const addGame = (gameId, game) => {
    GAMES[gameId] = game;
}

const generateUniqueGameId = idGenerator();
const startGame = (humanUsername, aiUsername) => {
    const gameId = generateUniqueGameId();
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

const removeGame = (gameId) => {
    delete GAMES[gameId];
    console.log(`game ${gameId} has been removed`);
}

const tickGames = (deltaSeconds) => {
    for (const gameId of Object.keys(GAMES)) {
        GAMES[gameId].tick(deltaSeconds);
    }
}

setInterval(() => tickGames(GAME_TICK_DELAY_MS*0.001), GAME_TICK_DELAY_MS);

module.exports = { startGame, lookUpRole, lookUpGame }
