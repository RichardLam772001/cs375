const e = require("express");

const webSocket = new WebSocket(`ws://localhost:${WEBSOCKET_PORT}/`);
webSocket.onmessage = (event) => {
  console.log(event.data);
};
webSocket.addEventListener("open", () => {
  console.log("We are connected");
  sendMessage("Hi from client");
});

const sendMessage = (message) => {
  // Sends message to websocket server
  // "Hi from client"
  webSocket.send(message);
};

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    loginUser(username, password);
  });

function loginUser(username, password) {
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400) {
        document.getElementById("error-message").innerText =
          "Incorrect username or password, please try again";
        throw new Error("Incorrect username or password");
      }
    })
    .catch((error) => {
      console("There was an error logging in" + error);
    });
}
