// initialize websockets:
const ws_uri = "ws://localhost:3000";
const websocket = new WebSocket(ws_uri);


// on websocket open:
websocket.onopen = function() {
    MessageAdd('<div class="message green">You have entered the chat room.</div>');
};


// on websocket close:
websocket.onclose = function() {
    MessageAdd('<div class="message blue">You have been disconnected.</div>');
};


// on websocket error:
websocket.onerror = function() {
    MessageAdd('<div class="message red">Connection to chat failed.</div>');
};


// on websocket message received:
websocket.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type == "message") {
        MessageAdd('<div class="message">' + data.username + ': ' + data.message + '</div>');
    }
};


// on chat form submit:
document.getElementById("chat-form").addEventListener("submit", function(event) {
    event.preventDefault();

    var message_element = document.getElementsByTagName("input")[0];
    var message = message_element.value;

    if (message.toString().length) {
        let username = localStorage.getItem("username");

        var data = {
            "type": "message",
            "username": username,
            "message": message
        };

        console.log(username);
        websocket.send(JSON.stringify(data));
        message_element.value = "";
    }
}, false);


// add message to chat:
function MessageAdd(message) {
    var chat_messages = document.getElementById("chat-messages");

    chat_messages.insertAdjacentHTML("beforeend", message);
    chat_messages.scrollTop = chat_messages.scrollHeight;
}

function newUsername() {
    let username = window.prompt("Enter your username:", "");

    if (username.toString().length > 0) {
        localStorage.setItem("username", username);
    }
    else {
        alert("Username cannot be empty.");
        newUsername();
    }
}

newUsername();