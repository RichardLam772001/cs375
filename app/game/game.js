const { ROLES } = require("../constants");
const { ConsoleLinesLog } = require("../consoleLinesLog.js");
const { ConsoleLineData } = require("../dataObjects.js");
const { randomChoice } = require("../utils.js");

const GAMES = {
    
};

const GAME = (humanUsername, aiUsername) => {
    const matchLength = 4*60;
    const secondsPerTick = 0.1;
    let tickInterval = setInterval(() => tick(secondsPerTick), secondsPerTick/1000);
    let timeRemaining = matchLength;

    let HUMAN_USERNAME = humanUsername;
    let AI_USERNAME = aiUsername;
    let room = "0-0";

    let consoleLinesLog = ConsoleLinesLog();


    const tick = (deltaSeconds) => {
        timeRemaining -= deltaSeconds;
        if(timeRemaining <= 0){
            return onTimeUp();
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
    const enterRoom = (newRoom) => {
        room = newRoom;
    }
    const getCurrentRoom = () => {
        return room;
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
        clearInterval(tickInterval);
    }

    function testPings(){
        for(let i = 0; i < 20; ++i){
            tryPingRoom(0,0,"");
        }
    }
    testPings();

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
