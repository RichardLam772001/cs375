const { WEBSOCKET_PORT } = require("../env.json");
const { WebSocketServer } = require("ws");
const {
  HumanRoomUpdateData,
  AIPingThreatUpdateData,
} = require("./dataObjects.js");
const { lookUpRole, lookUpGame } = require("./game/game");
const { CLIENTS_HANDLER } = require("./clientsHandler");
const { HUMAN_ACTIONS, ROLES, AI_ACTIONS } = require("./constants.js");
const { sendDataToPlayer } = require("./broadcaster");

const webSockServer = new WebSocketServer({ port: WEBSOCKET_PORT });

const onConnectionClose = (clientId) => {
  console.log("client disconnected!");
  CLIENTS_HANDLER.removeClient(clientId);
};
const onError = () => {
  console.log("websocket error");
};
const sendToAllClients = (data) => {
  if (typeof data === "object") {
    data = JSON.stringify(data);
  }
  webSockServer.clients.forEach((client) => {
    console.log("Sending data to client", data);
    client.send(data);
  });
};

const validateData = (username, gameId, actionName) => {
  // TO DO: Currently just checks username is in gameId & if they have the role to do the action, we should also check the validation-cookie
  const playerRole = lookUpRole(gameId, username);
  if (playerRole === null) {
    return false;
  }
  return (
    (playerRole === ROLES.HUMAN && actionName in HUMAN_ACTIONS) ||
    (playerRole === ROLES.AI && actionName in AI_ACTIONS)
  );
};

const onReceiveDataFromClient = (clientId, byteData) => {
  let data = JSON.parse(byteData.toString());
  console.log("WSS Receive :", data);
  let action = data.action;
  let username = data.username;
  let gameId = data.gameId;
  let currentRoom;
  let currentTool;
  let aiPingRoom;
  console.log("Action is ", action);
  console.log("WSS Receive :", data);

  const isValid = validateData(username, gameId, action.name);
  console.log("isValid request?", isValid);
  if (!isValid) {
    return;
  }

  if (!CLIENTS_HANDLER.isRegisteredClient(clientId)) {
    CLIENTS_HANDLER.registerClient(clientId, username, gameId);
  }

  const game = lookUpGame(gameId);

  switch (action.name) {
    case HUMAN_ACTIONS.enterRoom:
      game.enterRoom(action.args.room);
      currentRoom = game.getCurrentRoom();
      sendToAllClients(HumanRoomUpdateData(currentRoom));
      console.log("current room is ", currentRoom);
      break;
    case HUMAN_ACTIONS.getCurrentRoom:
      currentRoom = game.getCurrentRoom();
      sendToAllClients(HumanRoomUpdateData(currentRoom));
      break;
    case HUMAN_ACTIONS.switchHumanTool:
      currentTool = game.switchHumanTool(action.args.tool);
      console.log("2. wss human action switch human tool ", currentTool);
      break;
    case AI_ACTIONS.pingRoom:
      aiPingRoom = game.pingRoom(action.args.room);
      aiPingRoom = game.getPingRoom();
      console.log("AI action, wss pingRoom", aiPingRoom);
      break;
    default:
      break;
  }
};
webSockServer.on("connection", (ws) => {
  // This is what runs when a client makes a connection to our websocket server
  console.log("New client connected!");

  const clientId = CLIENTS_HANDLER.addClient(ws);

  ws.on("close", () => onConnectionClose(clientId));
  ws.on("message", (byteData) => onReceiveDataFromClient(clientId, byteData));
  ws.onerror = onError;
});

module.exports = { sendToAllClients };
