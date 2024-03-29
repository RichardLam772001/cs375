const { lobbyJoin, lobbyJoinGame, lobbyLeave, lobbiesGet, lobbyIsJoined, lobbyStats, getLeaderboard } = require("./handlers/lobby.js");
const { createAccount, login } = require("./handlers/login.js");

const setRequestHandlers = (app) => {

    app.post("/lobby/join-game", lobbyJoinGame);

    // TO DO: Remove once full lobby system is made
    // lobby join system for anonymous users
    // logged in users will be handled differently
	
    app.post("/lobby/make", lobbyJoin);
    app.post("/lobby/join", lobbyJoin);
	app.post("/lobby/leave", lobbyLeave);
    app.get("/lobby/list", lobbiesGet);
	app.post("/lobby/isjoined", lobbyIsJoined);
    app.get("/lobby/stats", lobbyStats);
    app.get("/lobby/leaderboard", getLeaderboard);

    app.post("/login/create", createAccount);
    app.post("/login/login", login)
};

module.exports = { setRequestHandlers }
