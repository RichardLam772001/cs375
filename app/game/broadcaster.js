//This class abstracts the sending process during a match, directing data towards one or both of the clients depending on their roles

const Broadcaster = ((webSockServer, humanClient, aiClient) => {
    function sendHuman(data){
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        humanClient.send(data);
    }
    function sendAi(data){
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        aiClient.send(data);
    }
    function sendBoth(data){
        //sendHuman(data);
        //sendAi(data);
        sendToAllClients(data);
    }
    const sendToAllClients = (data) => { //This function is temporary until we can distinguish client roles
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        webSockServer.clients.forEach(client => {
            client.send(data);
        });
    }
    return {
        sendHuman,
        sendAi,
        sendBoth
    };
});

module.exports = { Broadcaster };