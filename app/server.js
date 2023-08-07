// Require statements
const { HumanRoomUpdateData } = require("./dataObjects.js");
const { Match } = require("./game/match.js");

const { WEBSOCKET_PORT, HOSTNAME, PORT } = require("../env.json");
let express = require("express");
const { WebSocketServer } = require('ws');

let app = express();
app.use(express.static("public"));

const webSockServer = new WebSocketServer({ port: WEBSOCKET_PORT });

app.use(express.static("public"));
app.use(express.json());

app.listen(PORT, HOSTNAME, () => {
	console.log(`App running on http://${HOSTNAME}:${PORT}`);
});

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

const match = Match(webSockServer);

const onReceiveDataFromClient = (byteData) => {
	let data = JSON.parse(byteData.toString());
    console.log(`receive: ${byteData.toString()}`);
	let action = data.action;

    match.handleAction(undefined, action);
}

webSockServer.on('connection', ws => {
	// This is what runs when a client makes a connection to our websocket server
	console.log('New client connected!');

	ws.on('close', onConnectionClose);
	ws.on('message', onReceiveDataFromClient);
	ws.onerror = onError;
});


