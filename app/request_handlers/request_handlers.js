const { lobbyJoin, lobbyJoinGame, lobbiesGet } = require("./handlers/lobby.js");

const setRequestHandlers = (app) => {

    app.post("/lobby/join-game", lobbyJoinGame);

    // TO DO: Remove once full lobby system is made
    // lobby join system for anonymous users
    // logged in users will be handled differently
    app.post("/lobby/join", lobbyJoin);
	
	app.post("/lobby/make", lobbyJoin); // currently client provides lobbyId so same as lobbyjoin, change later
	app.get("/lobby/list", lobbiesGet);
};

module.exports = { setRequestHandlers }
