const lobbyTbl = document.getElementsByClassName("lobby-tbl-body")[0];
const createBtn = document.getElementById("create"); // not really createbtn anymore but
const joinedDiv = document.getElementById("joined");

const secretBtn = document.getElementsByClassName("header-btn")[0]; // for testing


const username = Math.floor(Math.random()*10000);

let joinedLobbyId = -1;

// leaving table as a parameter for now
// values: [lobbyId, hostname, playerNum, timeCreated]
const addRowToTopOfTable = (table, values) => {
	let gameRow = document.createElement("tr");
	gameRow.id = values[0]; // id = lobbyId for now
	for (let i=0; i<values.length; i++) {
		let cell = document.createElement("td");
		cell.innerText = values[i];
		gameRow.append(cell);
	}
	gameRow.addEventListener("click", () => {
		post(
			"/lobby/join",
			{"lobbyId" : values[0], "username" : username}
		).then((resp) => {
			if (resp.status !== 200) {
				// TO DO: Handle errors in joining lobby when lobby system is done
				console.log("ERROR - Something went wrong");
			}
			resp.json().then((data) => {
				if (data.lobbyId !== undefined) {
					joinedLobbyId = data.lobbyId;
					showJoinedLobbyUI();
				}
			}).catch((e) => {
				console.log(e);
			});
		}).catch((e) => {
			console.log(e);
		});
		
	});
	lobbyTbl.prepend(gameRow);
}

WS.onConnect(() => {
	fetch(
		"/lobby/list"
	).then((resp) => {
		if (resp.status !== 200) {
			console.log("ERROR - Something went wrong");
		}
		// update table according to list
		resp.json().then((lobbyList) => {
			console.log(lobbyList);
			refreshLobbies(lobbyList);
			
			post(
				"/lobby/joinstatus",
				{"username" : username}
			).then((resp) => {
				if (resp.status !== 200) {
					console.log("ERROR - Something went wrong");
				}
				// update page according to data
				resp.json().then((data) => {
					// if refresh while in lobby, user goes back to lobby
					console.log(data);
					if (data.lobbyId !== undefined) {
						joinedLobbyId = data.lobbyId;
						showJoinedLobbyUI();
					}
				}).catch((e) => {
					console.log(e);
				});
			}).catch((e) => {
				console.log(e);
			});
		}).catch((e) => {
			console.log(e);
		});
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
};

const makeLobby = () => {
	post(
		"/lobby/make",
		{"username" : username}
	).then((resp) => {
		if (resp.status !== 200) {
			// TO DO: Handle errors in joining lobby when lobby system is done
			console.log("ERROR - Something went wrong");
		}
		// table should update shortly
		resp.json().then((data) => {
			console.log(data.lobbyId);
			joinedLobbyId = data.lobbyId;
			showJoinedLobbyUI();
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
		{"lobbyId" : joinedLobbyId, "username" : username}
	).then((resp) => {
		if (resp.status !== 200) {
			// TO DO: Handle errors in joining lobby when lobby system is done
			console.log("ERROR - Something went wrong");
		}
		// table should update shortly
		hideJoinedLobbyUI();
	}).catch((e) => {
		console.log(e);
	});
};

const highlightJoined = () => {
	let joinedRow = document.getElementById(joinedLobbyId);
	if (joinedRow !== null) {
		joinedRow.style.backgroundColor = "#e6e6e6";
	}
}

const showJoinedLobbyUI = () => {
	let leaveBtn = document.getElementById("create");
	if (leaveBtn === null) {
		leaveBtn = document.getElementById("leave");
	}
	leaveBtn.id = "leave";
	leaveBtn.innerText = "Leave Lobby";
	leaveBtn.removeEventListener("click", makeLobby);
	leaveBtn.addEventListener("click", leaveLobby);
	joinedDiv.innerText = "Waiting in Lobby " + joinedLobbyId + "...";
	highlightJoined();
};

const hideJoinedLobbyUI = () => {
	let createBtn = document.getElementById("leave");
	if (createBtn === null) {
		createBtn = document.getElementById("create");
	}
	createBtn.id = "create";
	createBtn.innerText = "Create Lobby";
	createBtn.removeEventListener("click", leaveLobby);
	createBtn.addEventListener("click", makeLobby);
	joinedDiv.innerText = "";
};


createBtn.addEventListener("click", makeLobby);

// secret button for testing current lobbyid logic
secretBtn.addEventListener("click", hideJoinedLobbyUI);