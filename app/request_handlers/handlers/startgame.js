const { lookUpRole } = require("../../lobby/lobby.js");

const startGameAnon = (req, res) => {
    const body = req.body;
    const lobbyId = body.lobbyId;
    const username = body.username;

    const role = lookUpRole(lobbyId, username);
    return res.send({ role });
}

module.exports = { startGameAnon }
