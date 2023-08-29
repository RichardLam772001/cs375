const loginButton = document.getElementById("login-button");
const lobbyButton = document.getElementById("lobby-button");

const routeToLoginPage = () => {
    ROUTER.route("/login");
}
const routeToLobbyPage = () => {
    ROUTER.route("/lobby");
}

// add event listeners
lobbyButton.onclick = routeToLobbyPage;
loginButton.onclick = routeToLoginPage;
