const { HumanState } = require("./human.js");
const { HumanRoomUpdateData, ConsoleLineData} = require("../dataObjects.js");
const { ConsoleLinesLog } = require("./consoleLinesLog.js");
const { Broadcaster } = require("./broadcaster.js");

// This object is in charge of a Match (an instance of the game between two players)

const Match = ((webSocketServer, humanID, aiID) => {

    const matchLength = 4*60;
    const secondsPerTick = 0.1;
    let tickInterval = setInterval(() => tick(secondsPerTick), secondsPerTick/1000);
    let timeRemaining = matchLength;

    const broadcaster = Broadcaster(webSocketServer, webSocketServer.clients[0], webSocketServer.clients[1]);

    //Match state
    const humanState = HumanState([3,3]);
    const consoleLinesLog = ConsoleLinesLog();

    
    function tick(deltaSeconds){
        timeRemaining -= deltaSeconds;
        if(timeRemaining <= 0){
            return onTimeUp();
        }
    }

    function clientIsHuman(clientID){
        return clientID == humanID;
    }
    function clientIsAi(clientID){
        return clientID == aiID;
    }

    function clientIsInMatch(clientID){
        return true; //always accept input for now
        //return clientIsHuman(clientID) || clientIsAi(clientID); //TODO
    }

    function handleAction(senderID, action){ //TODO: Input validation
        if(!clientIsInMatch(senderID) || action === undefined){
            return;
        }

        if(handleMutualAction(senderID, action) === true) return;
        
        if(clientIsHuman(senderID) || true){ //TODO: We're always assuming a human action for now
            handleHumanAction(action);
        }else{ //client is AI
            handleAIAction(action);
        }
    }

    //Handle any action that may be performed by either player.
    //Returns true if an action was performed.
    function handleMutualAction(senderID, action){
        switch(action.name){
            case "getCurrentRoom":
                let currentRoom = humanState.getCurrentRoom();
                broadcaster.sendBoth(HumanRoomUpdateData(currentRoom));
                return true;
            default:
                break;
        }
        return false;
    }
    
    function handleHumanAction(action){
        switch(action.name){
            case "enterRoom":
                humanState.enterRoom(action.args.room);
                let currentRoom = humanState.getCurrentRoom();
                broadcaster.sendBoth(HumanRoomUpdateData(currentRoom));
                addConsoleLineAndBroadcast({time: timeRemaining, message: `HUMAN moves to ${currentRoom}`});
                return true;
            default:
                break;
        }
        return false;
    }
    function handleAIAction(action){
        return false;
    }

    function addConsoleLineAndBroadcast(consoleLine){
        consoleLinesLog.addConsoleLine(consoleLine);
        broadcaster.sendBoth(ConsoleLineData(consoleLine.time, consoleLine.message, consoleLine.style));
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

    return {
        handleAction
    };
});

module.exports = { Match };