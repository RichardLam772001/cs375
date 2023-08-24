const lobbyTbl = document.getElementsByClassName("lobby-tbl-body")[0];
const createBtn = document.getElementById("create");
const refreshBtn = document.getElementById("refresh");

const secretBtn = document.getElementsByClassName("header-btn")[0]; // for testing

// move this stuff to backend later
let lobbyId = 1;
let joinedLobbyId = 0;

// leaving table as a parameter for now
// values: [lobbyId, hostname, playerNum, timeCreated]
const addRowToTopOfTable = (table, values) => {
	let gameRow = document.createElement("tr");
	gameRow.id = values[0]; // id = lobbyId for now
	for (let i=1; i<values.length; i++) {
		let cell = document.createElement("td");
		cell.innerText = values[i];
		gameRow.append(cell);
	}
	gameRow.addEventListener("click", () => {
		joinedLobbyId = values[0];
		post(
			"/lobby/join",
			{"lobbyId" : joinedLobbyId, "username" : USERNAME_COOKIE}
		).then((resp) => {
			if (resp.status !== 200) {
				// TO DO: Handle errors in joining lobby when lobby system is done
				console.log("ERROR - Something went wrong");
			}
		}).catch((e) => {
			console.log(e);
		});
		
	});
	lobbyTbl.prepend(gameRow);
}

createBtn.addEventListener("click", () => {
	if (joinedLobbyId === 0) {
		getValidId();
		post(
			"/lobby/make",
			{"lobbyId" : lobbyId, "username" : USERNAME_COOKIE}
		).then((resp) => {
			if (resp.status !== 200) {
				// TO DO: Handle errors in joining lobby when lobby system is done
				console.log("ERROR - Something went wrong");
			}
			else {
				joinedLobbyId = lobbyId;
				lobbyId++;
			}
			// table should update shortly
		}).catch((e) => {
			console.log(e);
		});
	}
	else {
		console.log("stop spamming!");
		// to avoid weird effects when one client makes a bunch of lobbies
		// temporary
	}
	
});

// lobby refreshes automatically, so this is only needed if a lobby is removed
// any other buttons we should have?
refreshBtn.addEventListener("click", () => {
	fetch(
		"/lobby/list"
	).then((resp) => {
		if (resp.status !== 200) {
			// TO DO: Handle errors in joining lobby when lobby system is done
			console.log("ERROR - Something went wrong");
		}
		// update table according to list
		fetchRefresh();
		
	}).catch((e) => {
		console.log(e);
	});
	
});


WS.onConnect(() => {
	fetch(
		"/lobby/list"
	).then((resp) => {
		if (resp.status !== 200) {
			// TO DO: Handle errors in joining lobby when lobby system is done
			console.log("ERROR - Something went wrong");
		}
		// update table according to list
		fetchRefresh();
		
	}).catch((e) => {
		console.log(e);
	});
});

WS.onReceive((data) => {
    console.log("WSS Received data", data);
    if (isMessageType(data, DATA_TYPES.GAME_READY) && joinedLobbyId.toString() === data.lobbyId) {
        joinGame(data.gameId);
    }
	else if (isMessageType(data, DATA_TYPES.LOBBY_LIST)) {
		refreshLobbies(data.lobbies);
	}
});

const joinGame = (gameId) => {
    post(
        "/lobby/join-game",
        {"gameId" : gameId, "username" : USERNAME_COOKIE}
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

const fetchRefresh = () => {
	resp.json().then((lobbyList) => {
		console.log(lobbyList);
		refreshLobbies(lobbyList);
	}).catch((e) => {
		// leave table as is
	});
}

const refreshLobbies = (lobbies) => {
	if (Object.keys(lobbies).length === 0) {
		lobbyTbl.innerText = "none.";
	}
	else {
		lobbyTbl.innerText = "";
		for (let id in lobbies) {
			addRowToTopOfTable(lobbyTbl, lobbies[id]);
		}
	}
}


// not needed after lobbyid generation is moved to server
const getValidId = () => {
	while (document.getElementById(lobbyId) !== null) {
		lobbyId++;
	}
}

// secret button for testing current lobbyid logic
secretBtn.addEventListener("click", () => {
	console.log("creating:", lobbyId);
	console.log("joining:", joinedLobbyId);
	
});