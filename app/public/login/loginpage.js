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
      if (!response.ok) {
        throw new Error("Incorrect username or password, please try again");
      }
      return response.status(200).json();
      // console.log("");
    })
    .catch((error) => {
      document.getElementById("error-message").textContent = error.message;
      console("There was an error logging in");
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

  document.getElementById("lengthMoreThanSix").style.color =
    input.length > 6 ? "green" : "red";
  document.getElementById("lengthLessThanSixteen").style.color =
    input.length < 16 ? "green" : "red";
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
