document
  .getElementById("loginAccount")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    loginUser(username, password);
  });

document
  .getElementById("createAccount")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    createAccount();
  });

async function sendRequest(endpoint, data) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Incorrect username or password, please try again");
    }
    return await response.json();
  } catch (error) {
    document.getElementById("error-message").textContent = error.message;
    console.error("There was an error logging in");
  }
}

async function loginUser(username, password) {
  try {
    const response = await sendRequest("/login", {
      username: username,
      password: password,
    });
    console.log(response);
  } catch (error) {
    document.getElementById("error-message").textContent = error.message;
    console.error("There was an error logging in");
  }
}

async function createAccount() {
  try {
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;

    if (!isPasswordValid(password)) {
      document.getElementById("error-message").textContent =
        "Password does not meet the requirements";
      return;
    }

    const result = await sendRequest("/createAccount", { username, password });
    // Handle successful account creation if necessary
    // For example: navigate to a confirmation page or update UI
  } catch (error) {
    document.getElementById("error-message").textContent =
      "There was an error creating the account";
  }
}

// function loginUser(username, password) {
//   fetch("/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username: username,
//       password: password,
//     }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Incorrect username or password, please try again");
//       }
//       return response.status(200).json();
//       // console.log("");
//     })
//     .catch((error) => {
//       document.getElementById("error-message").textContent = error.message;
//       console("There was an error logging in");
//     });
// }

// // function createAccount()
// function createAccount() {
//   fetch("/createAccount", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username: document.getElementById("newUsername").value,
//         password: document.getElementById("newPassword").value,
//       }),
//     })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Incorrect username or password, please try again");
//       }
//       return response.status(200).json();
//       // console.log("");
//     })
//     .catch((error) => {
//       document.getElementById("error-message").textContent = error.message;
//       console("There was an error logging in");
//     });
// }

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

function confirmNewPassword() {
  const newPass = document.getElementById("newPassword").value;
  const confirmPass = document.getElementById("newPasswordConfirm").value;
  if (confirmPass.length === 0) {
    document.getElementById("matchNewPassword").style.color = "gray";
  } else {
    document.getElementById("matchNewPassword").style.color =
      newPass === confirmPass ? "green" : "red";
  }
}

function isPasswordValid(password) {
  if (password.length <= 6 || password.length >= 10 || password.match(/\s/)) {
    return false;
  }
  return true;
}
