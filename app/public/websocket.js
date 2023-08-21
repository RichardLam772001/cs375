const WS = (() => {
    
    const WEBSOCKET_ORIGIN = IS_PROD ? ELASTIC_IP_ADDRESS : "localhost";
    const webSocket = new WebSocket(`ws://${WEBSOCKET_ORIGIN}:${WEBSOCKET_PORT}/`);

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
