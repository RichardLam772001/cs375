// Require statements
const { Match } = require("./game/match.js");
const { setRequestHandlers } = require("./request_handlers/request_handlers.js");
const { HOSTNAME, PORT } = require("../env.json");
const { webSockServer } = require("./wss.js");

const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.static("public"));
app.use(cookieParser());

app.use(express.static("public"));
app.use(express.json());

app.listen(PORT, HOSTNAME, () => {
	console.log(`App running on http://${HOSTNAME}:${PORT}`);
});


const MATCHES = {};
MATCHES[0] = Match(webSockServer);

webSockServer.on('connection', ws => {
	// This is what runs when a client makes a connection to our websocket server
	console.log('New client connected!');

	ws.on('close', onConnectionClose);
	ws.on('message', onReceiveDataFromClient);
	ws.onerror = onError;
});


setRequestHandlers(app);
