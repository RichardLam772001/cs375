const { WEBSOCKET_PORT } = require("../env.json");
const { WebSocketServer } = require('ws');
const { getCurrentRoom, enterRoom } = require("./game/human.js");
const { HumanRoomUpdateData } = require("./dataObjects.js");


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
        client.send(data);
    });
}
const onReceiveDataFromClient = (byteData) => {
    let data = JSON.parse(byteData.toString());
    let action = data.action;
    let currentRoom;
    switch(action.name) {
        case "enterRoom":
            enterRoom(action.args.room);
            currentRoom = getCurrentRoom();
            sendToAllClients(HumanRoomUpdateData(currentRoom));
            break;
        case "getCurrentRoom":
            currentRoom = getCurrentRoom();
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

module.exports = { sendToAllClients, webSockServer }
