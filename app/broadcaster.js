const { CLIENTS_HANDLER } = require("./clientsHandler.js");

const sendDataToPlayer = (gameId, username, data) => {
    const client = CLIENTS_HANDLER.getClientByGameAndUser(gameId, username);
    if (!client) {
        return;
    }
    console.log(`Sending data to username ${username} in game ${gameId}`, data);
    client.send(JSON.stringify(data));
};


module.exports = { sendDataToPlayer };
