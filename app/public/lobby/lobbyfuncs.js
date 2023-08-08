const lobbyTbl = document.getElementsByClassName("lobby-tbl-body")[0];
const createBtn = document.getElementById("create");
const refreshBtn = document.getElementById("refresh");

const secretBtn = document.getElementsByClassName("header-btn")[0]; // for testing

// will get this working with server and actual requirements later, just playing around for now
let gameHostName = 1;
let gameList = [];

// leaving table as a parameter for now
const addRowToTopOfTable = (table, values) => {
	let gameRow = document.createElement("tr");
	gameRow.id = values[0]; // just use host name for now
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
			// add row to TOP of lobby list
		}).catch((e) => {
			console.log(e);
		});
	});
	lobbyTbl.prepend(gameRow);
}

createBtn.addEventListener("click", () => {
	/*
	post(
		"/lobby/make",
		{}
	).then((resp) => {
		if (resp.status !== 200) {
			// TO DO: Handle errors in joining lobby when lobby system is done
			console.log("ERROR - Something went wrong");
		}
		// add row to TOP of lobby list
	}).catch((e) => {
		console.log(e);
	});
	*/
	
	let gameInfo = [gameHostName, "1/2", "just now"];
	gameList.push(gameInfo);
	addRowToTopOfTable(lobbyTbl, gameInfo);
	gameHostName++;
	
});

// if we want lobby list to automatically update with new games, might not need this
refreshBtn.addEventListener("click", () => {
	/*
	fetch(
		"/lobby/list"
	).then((resp) => {
		if (resp.status !== 200) {
			// TO DO: Handle errors in joining lobby when lobby system is done
			console.log("ERROR - Something went wrong");
		}
		// update table according to list
	}).catch((e) => {
		console.log(e);
	});
	*/
		
	lobbyTbl.innerText = "";
	for (let game of gameList) {
		addRowToTopOfTable(lobbyTbl, game);
	}
	
});

secretBtn.addEventListener("click", () => {
	let gameInfo = [gameHostName, "1/2", "just now"];
	gameList.push(gameInfo);
	gameHostName++;
	
});