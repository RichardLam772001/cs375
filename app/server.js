// Require statements
const { GAME_DELAY_MS } = require("./constants.js");
const { WEBSOCKET_PORT, HOSTNAME, PORT } = require("../env.json");
let express = require("express");
const { WebSocketServer } = require('ws')
let axios = require("axios"); // Currently unused, not sure if we'll need axios for anything

let app = express();
app.use(express.static("public"));

const webSockServer = new WebSocketServer({ port: WEBSOCKET_PORT })

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
const onReceiveDataFromClient = (byteData) => {
	// Data will be in buffer form so we have to call toString first
	let data = byteData.toString();
	// This is where data will come in from the client
	// We can do whatever we want with the data or send stuff back
	console.log(data);
}
// Richard: This will be the main function that will run for the game
const mainLoop = () => {
	// This sends a message to each client using a for loop, we can filter which client to send stuff to by modifying the code here
	webSockServer.clients.forEach(client => {
		client.send("sent to all clients by iterating clients sockserver.field");
	});
}

webSockServer.on('connection', ws => {
	// This is what runs when a client makes a connection to our websocket server
	console.log('New client connected!');

	ws.on('close', onConnectionClose);
	ws.on('message', onReceiveDataFromClient);
	ws.onerror = onError;
});

setInterval(mainLoop, GAME_DELAY_MS);
