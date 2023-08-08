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

var is_visible = false;
function see() {
  let input = document.getElementById("newPassword");
  let see = document.getElementById("see");
  if (is_visible) {
    input.type = "password";
    is_visible = false;
    see.style.color = "gray";
  } else {
    input.type = "text";
    is_visible = true;
    see.style.color = "black";
  }
}

function checkPassword() {
  // count the number of characters in the password
  let input = document.getElementById("newPassword").value;
  document.getElementById("newPassword").value = input;
  document.getElementById("count").textContent = "Length: " + input.length;

  document.getElementById("lengthGreatThanEight").style.color =
    input.length > 8 ? "green" : "red";
  document.getElementById("containsNumber").style.color = input.match(/[0-9]/)
    ? "green"
    : "red";
  document.getElementById("containsSpecialCharacter").style.color = input.match(
    /[/[!@#$%^&*(),.?":{}|]/
  )
    ? "green"
    : "red";
  document.getElementById("containUppercaseLetter").style.color = input.match(
    /[A-Z]/
  )
    ? "green"
    : "red";
  document.getElementById("containLowercaseLetter").style.color = input.match(
    /[a-z]/
  )
    ? "green"
    : "red";
  document.getElementById("notContainSpace").style.color = input.match(/\s/)
    ? "red"
    : "green";
}

function cofirmNewPassword() {
  const newPass = document.getElementById("newPassword").value;
  const confirmPass = document.getElementById("newPasswordConfirm").value;
  if (confirmPass.length === 0) {
    document.getElementById("matchNewPassword").style.color = "gray";
  } else {
    document.getElementById("matchNewPassword").style.color =
      newPass === confirmPass ? "green" : "red";
  }
}

//https://www.youtube.com/watch?v=cAUb9Iarg8I&t=638s
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
// https://github.com/kaizhelam/password-validation/blob/main/index.html
