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
            const data=JSON.parse(event.data)
            //Modified to handle the situation when game ends   --xmy
            if (data.messageType === 'gameEnd') {
                const result = data.result;
                const gameResultElement = document.getElementById('game-result');
                gameResultElement.textContent = result === 'win' ? 'You win!' : 'You lost.';
                gameResultElement.style.zIndex = '9999';  
            } else {
                func(JSON.parse(event.data));
            }
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
