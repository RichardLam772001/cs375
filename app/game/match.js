const { HumanState } = require("./human.js");
const { HumanRoomUpdateData } = require("../dataObjects.js");

const Broadcaster = ((webSockServer, humanClient, aiClient) => {
    function sendHuman(data){
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        humanClient.send(data);
    }
    function sendAi(data){
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        aiClient.send(data);
    }
    function sendBoth(data){
        //sendHuman(data);
        //sendAi(data);
        sendToAllClients(data);
    }
    const sendToAllClients = (data) => {
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        webSockServer.clients.forEach(client => {
            client.send(data);
        });
    }
    return {
        sendHuman,
        sendAi,
        sendBoth
    };
});

// This object is in charge of a Match (an instance of the game between two players)

const Match = ((webSocketServer, humanID, aiID) => {

    const matchLength = 4*60;
    const secondsPerTick = 0.1;
    let timeRemaining;

    const broadcaster = Broadcaster(webSocketServer, webSocketServer.clients[0], webSocketServer.clients[1]);
    const humanState = HumanState([3,3]);

    let tickInterval;

    const start = (() => {
        timeRemaining = matchLength;
        
        tickInterval = setInterval(() => tick(secondsPerTick), secondsPerTick/1000);
    })();
    
    function tick(deltaSeconds){
        timeRemaining -= deltaSeconds;
        if(timeRemaining <= 0){
            return onTimeUp();
        }
    }

    function handleAction(senderID, action){
        if(action === undefined){
            console.log("action is undefined");
            return;
        }
        let actionName = action.name;
        switch(actionName){
            case "getCurrentRoom":
                let currentRoom = humanState.getCurrentRoom();
                broadcaster.sendBoth(HumanRoomUpdateData(currentRoom));
                return;
            default:
                break;
        }

        if(senderID === humanID || true){
            switch(action.name){
                case "enterRoom":
                    humanState.enterRoom(action.args.room);
                    let currentRoom = humanState.getCurrentRoom();
                    broadcaster.sendBoth(HumanRoomUpdateData(currentRoom));
                    return;
                default:
                    break;
            }
        }else if(senderID === aiID || true){

        }else{
            //Error: sender is not in this match
        }
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