// @ts-ignore
const lobbyTbl = document.getElementsByClassName("lobby-tbl-body")[0];
const createBtn = document.getElementById("create"); // not really createbtn anymore but
const joinedDiv = document.getElementById("joined");

// This is the lobbyId that the client is currently in (-1 for not in a lobby)
let JOINED_LOBBY_ID = -1;

// Set username to be cookie
const username = USERNAME_COOKIE;

const joinLobby = (lobbyId) =>{
	post(
		"/lobby/join",
		{"lobbyId" : lobbyId, "username" : username}
	).then((resp) => {
		// If response fails, usually due to invalid request like user is already in lobby
		// We can just return here.
		if (resp.status !== 200) {
			return;
		}
		resp.json().then((data) => {
			JOINED_LOBBY_ID = data.lobbyId;
			setRocketShipAsJoined(JOINED_LOBBY_ID);
		}).catch((e) => {
			console.log(e);
		});
	}).catch((e) => {
		console.log(e);
	});
}

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
};

const leaveLobby = () => {
	post(
		"/lobby/leave",
		{"lobbyId" : JOINED_LOBBY_ID, "username" : username}
	).then((resp) => {
		if (resp.status === 200) {
			JOINED_LOBBY_ID = -1;
			setRocketShipAsJoined(-1);
		}
	})
};

const getLobbyData = async () => {
	const resp = await get("/lobby/list");
	if (resp.status === 200) {
		const lobbyListData = await resp.json();
		updateLobbyData(lobbyListData.lobbies);
	}
	else {
		console.log("ERROR - Something went wrong");
	}
}

/**
 * Will show the leave lobby button and do necessary UI changes if user is in lobby
 * Usually run once on page load
 */
const checkIfUserIsInLobby = async () => {
	const resp = await post("/lobby/isJoined", {username: USERNAME_COOKIE});
	if (resp.status === 200) {
		const isJoinedData = await resp.json();
		JOINED_LOBBY_ID = isJoinedData.lobbyId;
		setRocketShipAsJoined(JOINED_LOBBY_ID);
	}
	else {
		// User not in lobby
		if (resp.status === 400) {
			return;
		}
		console.log("ERROR - Something went wrong");
	}
}

// Richard - I think the making lobby logic is fun and may be useful in future if lots of players join.
// But since it's week 9/10, I don't think it'll be worth continuing this logic. It may be simpler to just
// have prepopulated lobbies and just prevent the user from creating lobbies for now and only being able to join lobbies.
// const makeLobby = () => {
// 	post(
// 		"/lobby/make",
// 		{"username" : username}
// 	).then((resp) => {
// 		if (resp.status !== 200) {
// 			// TO DO: Handle errors in joining lobby when lobby system is done
// 			console.log("ERROR - Something went wrong");
// 		}
// 		// table should update shortly
// 		resp.json().then((data) => {
// 			console.log(data.lobbyId);
// 			joinedLobbyId = data.lobbyId;
// 			showJoinedLobbyUI();
// 		}).catch((e) => {
// 			console.log(e);
// 		});
// 	}).catch((e) => {
// 		console.log(e);
// 	});
// };
