const WS = (() => {
    
    const webSocket = new WebSocket(`ws://localhost:${WEBSOCKET_PORT}/`);
    
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
        send,
        onConnect,
        onDisconnect,
        onReceive
    }
})();
