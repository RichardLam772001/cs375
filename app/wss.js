const { WEBSOCKET_PORT } = require("../env.json");
const { WebSocketServer } = require('ws');
const { HumanRoomUpdateData } = require("./dataObjects.js");
const { lookUpRole, lookUpGame } = require("./game/game");
const { HUMAN_ACTIONS, ROLES, AI_ACTIONS } = require("./constants.js");

const webSockServer = new WebSocketServer({ port: WEBSOCKET_PORT });

const onConnectionClose = () => {
    console.log("client disconnected!");
};
const onError = () => {
    console.log("websocket error");
}
const sendToAllClients = (data) => {
    if (typeof data === "object") {
        data = JSON.stringify(data);
    }
    webSockServer.clients.forEach(client => {
        console.log("Sending data to client", data);
        client.send(data);
    });
}

const validateData = (username, gameId, actionName) => {
    // TO DO: Currently just checks username is in gameId & if they have the role to do the action, we should also check the validation-cookie
    const playerRole = lookUpRole(gameId, username);
    if (playerRole === null) {
        return false;
    }
    return (playerRole === ROLES.HUMAN && actionName in HUMAN_ACTIONS) || (playerRole === ROLES.AI && actionName in AI_ACTIONS)
}

const onReceiveDataFromClient = (byteData) => {
    let data = JSON.parse(byteData.toString());
    let action = data.action;
    let username = data.username;
    let gameId = data.gameId;
    let currentRoom;

    console.log("WSS Receive :", data);

    const isValid = validateData(username, gameId, action.name);
    console.log("isValid request?", isValid);
    if (!isValid) {
        return;
    }
    const game = lookUpGame(gameId);

    switch(action.name) {
        case HUMAN_ACTIONS.enterRoom:
            game.enterRoom(action.args.room);
            currentRoom = game.getCurrentRoom();
            sendToAllClients(HumanRoomUpdateData(currentRoom));
            break;
        case HUMAN_ACTIONS.getCurrentRoom:
            currentRoom = game.getCurrentRoom();
            sendToAllClients(HumanRoomUpdateData(currentRoom));
            break;
        default:
            break;
    }
}
webSockServer.on('connection', ws => {
    // This is what runs when a client makes a connection to our websocket server
    console.log('New client connected!');

    ws.on('close', onConnectionClose);
    ws.on('message', onReceiveDataFromClient);
    ws.onerror = onError;
});

module.exports = { sendToAllClients }
