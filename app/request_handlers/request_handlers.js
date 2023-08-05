const { lobbyJoin } = require("./handlers/lobby.js");
const { startGameAnon } = require("./handlers/startgame.js");

const setRequestHandlers = (app) => {

    app.post("/startgame/anon", startGameAnon);

    // TO DO: Remove once full lobby system is made
    // lobby join system for anonymous users
    // logged in users will be handled differently
    app.post("/lobby/join", lobbyJoin);
};

module.exports = { setRequestHandlers }
