const WS = (() => {
    
    const WEBSOCKET_URL = IS_PROD ? `wss://${DOMAIN_NAME}` : "ws://localhost:80";
    const webSocket = new WebSocket(WEBSOCKET_URL);

    const send = (data) => {
        webSocket.send(JSON.stringify(data));
    }
    const onConnect = (func) => {
        webSocket.addEventListener("open", func);
    }
    const onDisconnect = (func) => {
        webSocket.addEventListener("close", func);
    }
    const onReceive = (func) => {
        webSocket.onmessage = (event) => {
            func(JSON.parse(event.data));
        };
    }

    return {
        webSocket,
        send,
        onConnect,
        onDisconnect,
        onReceive
    }
})();
