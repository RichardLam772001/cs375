// Require statements
const { WebSocketServer } = require('ws');
const { HumanRoomUpdateData } = require("./dataObjects.js");
const { lookUpRole, lookUpGame } = require("./game/game");
const { CLIENTS_HANDLER } = require("./clientsHandler");
const { HUMAN_ACTIONS, ROLES, AI_ACTIONS } = require("./constants.js");
const { WEBSOCKET_PORT, PROD_HOSTNAME, LOCAL_HOSTNAME, PROD_PORT, LOCAL_PORT, IS_PROD } = require("../env.json");
const https = require('https');
const fs = require('fs');
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.static("public"));
app.use(cookieParser());

app.use(express.static("public"));
app.use(express.json());

let webSockServer = null;
let httpsServer = null;

if (IS_PROD) {
	// Setup SSL Certificates
	const privateKey = fs.readFileSync('private.key');
	const certificate = fs.readFileSync('certificate.crt');
	const options = {
			key: privateKey,
			cert: certificate,
	};

	// Create HTTPS server
	httpsServer = https.createServer(options, app);

	// Create WebSocket Server to run on HTTPS server
	webSockServer = new WebSocketServer({server : httpsServer});
}
else {
	// Create WebSocket Server to run on separate port
	webSockServer = new WebSocketServer({ port: WEBSOCKET_PORT });
}

console.log("WebSocketServer initialized");

const onConnectionClose = (clientId) => {
    console.log("client disconnected!");
    CLIENTS_HANDLER.removeClient(clientId);
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

const onReceiveDataFromClient = (clientId, byteData) => {
    let data = JSON.parse(byteData.toString());
    let action = data.action;
    let username = data.username;
    let gameId = data.gameId;
    let currentRoom;
    let token = data.token;

    console.log("WSS Receive :", data);

    const isValid = validateData(username, gameId, action.name);
    console.log("isValid request?", isValid);
    if (!isValid) {
        return;
    }

    if (!CLIENTS_HANDLER.isRegisteredClient(clientId)) {
        CLIENTS_HANDLER.registerClient(clientId, username, gameId, token);
    }

    const game = lookUpGame(gameId);

    switch(action.name) {
        case HUMAN_ACTIONS.enterRoom:
            game.enterRoom(action.args.room);
            break;
        case HUMAN_ACTIONS.getCurrentRoom:
            currentRoom = game.getCurrentRoom();
            sendToAllClients(HumanRoomUpdateData(currentRoom));
            break;
        case HUMAN_ACTIONS.switchHumanTool:
            const newTool = action.args.tool;
            game.switchHumanTool(newTool);
            break;
        case HUMAN_ACTIONS.setTrust:
            const newTrustLevel = action.args.trust;
            if(Number.isInteger(newTrustLevel)) game.setTrustLevel(action.args.trust);
            break;
        case AI_ACTIONS.getAiRole:
            game.sendRoleToAI();
            break;
        case AI_ACTIONS.pingRoom:
            const aiPingRoom = action.args.room;
            const aiPingThreatType = action.args.threatType;
            game.requestPing(aiPingRoom, aiPingThreatType);
            break;
        case AI_ACTIONS.assist:
            game.assist();
            break;
        case AI_ACTIONS.sabotage:
            game.sabotage();
            break;
        default:
            break;
    }
}
webSockServer.on('connection', ws => {
    // This is what runs when a client makes a connection to our websocket server
    console.log('New client connected!');
    const clientId = CLIENTS_HANDLER.addClient(ws);
    ws.on('close', () => onConnectionClose(clientId));
    ws.on('message', (byteData) => onReceiveDataFromClient(clientId, byteData));
    ws.onerror = onError;
});

const hostname = IS_PROD ? PROD_HOSTNAME : LOCAL_HOSTNAME;
const port = IS_PROD ? PROD_PORT : LOCAL_PORT;
if (IS_PROD) {
	httpsServer.listen(port, () => {
        console.log(`App running on http://${hostname}:${port}`);
});
}
else {
	app.listen(port, () => {
		console.log(`App running on http://${hostname}:${port}`);
	});
}

module.exports = { sendToAllClients, app };

