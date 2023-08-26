/**
 * THIS FILE CONTAINS ALL FUNCTIONS AND LOGIC RELATED TO THE UI FOR THE LOBBY
 */

let LOBBIES = [];

/**
 * Updates the list of lobbies
 * @param {object[]} updateLobbyData
 */
const updateLobbyData = (updateLobbyData) => {
    LOBBIES = updateLobbyData;
    clearLobbies();
    createLobbies(LOBBIES);
}

const lobbies = document.getElementById("lobbies");
const leaveLobbyButton = document.getElementById("leave-lobby-button");

/**.
 * @param {string[]} classes e.g. ["class1", "class2"]
 */
const Div = (classes) => {
	const div = document.createElement("div");
	div.classList.add(...classes);
	return div;
}

const addEventListenersToRocketShip = (rocketShip, lobbyId) => {
	rocketShip.addEventListener("click", () => joinLobby(lobbyId));
	return rocketShip;
}

/**
 * Makes <div class="lobby"><div class="lobby-title">Lobby 1</div><div class="spaceship"></div></div>
 */
const RocketShip = (id, playerCount) => {
	let lobbyDiv = Div(["lobby"]);
	// The lobby-id class is actually used for lookup
	lobbyDiv.id = `lobby-${id}`;
    lobbyDiv = addEventListenersToRocketShip(lobbyDiv, id);

    const spaceShipDiv = Div(["spaceship"]);

    const lobbyTitle = Div(["lobby-title"]);
	lobbyTitle.innerText = `Lobby ${id} (${playerCount}/2)`;

    lobbyDiv.appendChild(lobbyTitle);
	lobbyDiv.appendChild(spaceShipDiv);

	return lobbyDiv;
}

const showLeaveLobbyButton = () => {
	leaveLobbyButton.style.display = "block";
}
const hideLeaveLobbyButton = () => {
	leaveLobbyButton.style.display = "none";
}
leaveLobbyButton.addEventListener('click', leaveLobby);

const setRocketShipAsJoined = (id) => {
	// set all lobbies as unselected first
	const rocketShips = document.querySelectorAll(".lobby");
	rocketShips.forEach((elem) => {elem.classList.remove("joined-rocket")})

	const joinedRocketShip = document.querySelector(`#lobby-${id}`);
	if (joinedRocketShip) {
		showLeaveLobbyButton();
		joinedRocketShip.classList.add("joined-rocket");
	}
	else {
		hideLeaveLobbyButton();
	}
}

/**
 * @param {array} lobbiesList e.g. [{lobbyId: 0, playerCount: 1}]
 */
const createLobbies = (lobbiesList) => {
	for (const lobby of lobbiesList) {
		lobbies.appendChild(RocketShip(lobby.lobbyId, lobby.playerCount));
	}
	// Set one as selected if user is in lobby
	if (JOINED_LOBBY_ID !== -1) {
		setRocketShipAsJoined(JOINED_LOBBY_ID)
	}
}
const clearLobbies = () => {
    lobbies.innerText = "";
}

const init = () => {
	getLobbyData();
	checkIfUserIsInLobby();
}
init();