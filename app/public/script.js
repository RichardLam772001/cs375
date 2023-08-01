const webSocket = new WebSocket(`ws://localhost:${WEBSOCKET_PORT}/`);
webSocket.onmessage = (event) => {
  console.log(event.data);
};
webSocket.addEventListener("open", () => {
  console.log("We are connected");
});
const sendMessage = () => {
  // Sends message to websocket server
  webSocket.send("Hi from client");
}
document.getElementById('send').addEventListener('click', sendMessage);
