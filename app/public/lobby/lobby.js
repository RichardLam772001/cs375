// temp: lobby id won't be hard coded to 1 all the time, it will be
// dynamically assigned once full lobby system is ready
const LOBBY_ID = 1;

// TO DO: This username wont be randomly generated each time
// ideally, we use a cookie to keep track of the user rather than a hard coded username to persist between refreshes
// in the backend, a cookie already gets sent to the client when we hit /lobby/join to set the username
// we just need to hook up logic to use that
// also it'd be nice to have this implemented as a on/off toggle development purposes so we could open two tabs to simulate two different players
// or toggle it off and use the cookie to simulate one player logging out then rejoining the game
const username = Math.floor(Math.random()*10000);

post(
    "/lobby/join",
    {"lobbyId" : LOBBY_ID, "username" : username}
).then((resp) => {
    if (resp.status !== 200) {
        // TO DO: Handle errors in joining lobby when lobby system is done
        console.log("ERROR - Something went wrong");
    }
}).catch((e) => {
    console.log(e);
});

WS.onReceive((data) => {
    console.log("WSS Received data", data);
    if (isMessageType(data, DATA_TYPES.GAME_READY) && LOBBY_ID === data.lobbyId) {
        joinGame(data.gameId);
    }
});

const joinGame = (gameId) => {
    post(
        "/lobby/join-game",
        {"gameId" : gameId, "username" : username}
    ).then((resp) => {
        resp.json().then((body) => {
            if (body.role === ROLES.HUMAN) {
                ROUTER.route("/human");
            }
            else {
                ROUTER.route("/ai");
            }
        }).catch((e) => {
            console.log(e);
        });
    }).catch((e) => {
        console.log(e);
    });
}
