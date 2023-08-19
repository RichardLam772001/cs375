const { lobbyJoin, lobbyJoinGame } = require("./handlers/lobby.js");
const { createAccount, login } = require("./handlers/login.js");

const setRequestHandlers = (app) => {

    app.post("/lobby/join-game", lobbyJoinGame);

    // TO DO: Remove once full lobby system is made
    // lobby join system for anonymous users
    // logged in users will be handled differently
    app.post("/lobby/join", lobbyJoin);
    app.post("/login/create", createAccount);
    app.post("/login/login", login)
};

module.exports = { setRequestHandlers }
