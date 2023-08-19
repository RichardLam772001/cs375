document
  .getElementById("loginForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    loginUser(username, password);
  });

document
  .getElementById("createAccountForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    let username = document.getElementById("newUsername").value;
    let password = document.getElementById("newPassword").value;
    createUser(username, password);
  });

const loginMessage = document.getElementById("login-message");
const setLoginMessage = (message, color) => {
  loginMessage.textContent = message;
  loginMessage.style.color = color;
}

const createAccountMessage = document.getElementById("create-account-message");
const setCreateAccountMessage = (message, color) => {
  createAccountMessage.textContent = message;
  createAccountMessage.style.color = color;
}

async function loginUser(username, password) {
  try {
    const response = await fetch("/login/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json(); 
      throw new Error("" + errorData.error);
    }

    setLoginMessage("Login successful!", "green");
    ROUTER.route("/lobby");
  } catch (error) {
    setLoginMessage(error.message, "red");
    console.log("There was an error logging in");
  }
};

  async function createUser(username, password) {
    if (!isValidPassword(password)) {
      setCreateAccountMessage("Invalid password. Please use a password that matches the criteria above", "red");
      return;
    }
    try {
      const response = await fetch("/login/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error("" + errorData.error);
      }

      setCreateAccountMessage("Account created successfully", "green");
    } catch (error) {
      setCreateAccountMessage(error.message, "red");
    }
  }

const is_visible = false;
function see() {
  const input = document.getElementById("newPassword");
  const see = document.getElementById("see");
  if (is_visible) {
    input.type = "password";
    is_visible = false;
    see.style.color = "gray";
  } else {
    input.type = "text";
    is_visible = true;
    see.style.color = "black";
  }
};

const lengthGreaterThanSix = (password) => {
  return password.length > 6;
}
const lengthLessThanSixteen = (password) => {
  return password.length < 16;
}
const passwordDoesntContainSpaces = (password) => {
  return password.indexOf(" ") === -1;
};

const isValidPassword = (password) => {
  return lengthGreaterThanSix(password) && lengthLessThanSixteen(password) && passwordDoesntContainSpaces(password);
};

function checkPassword() {
  // count the number of characters in the password
  let input = document.getElementById("newPassword").value;
  document.getElementById("newPassword").value = input;
  document.getElementById("count").textContent = "Length: " + input.length;

  document.getElementById("lengthMoreThanSix").style.color =
    lengthGreaterThanSix(input) ? "green" : "red";
  document.getElementById("lengthLessThanSixteen").style.color =
    lengthLessThanSixteen(input) ? "green" : "red";
  document.getElementById("notContainSpace").style.color =
    passwordDoesntContainSpaces(input)
    ? "green"
    : "red";
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

//https://www.youtube.com/watch?v=cAUb9Iarg8I&t=638s
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
//https://github.com/kaizhelam/password-validation/blob/main/index.html
