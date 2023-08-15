const { idGenerator } = require("./utils.js");

const generateUniqueClientId = idGenerator();

const CLIENTS_HANDLER = (() => {

    // Client objects in general
    const CLIENTS = {};
    // Registered client ids
    const REGISTERED_CLIENTS = new Set();
    // Registered client ids indexed by game and username
    const REGISTERED_CLIENTS_BY_GAME = {};

    /**
     * 
     * @param {string} clientId 
     * @param {string} username 
     * @param {string} gameId
     * This method registers a clientId to a specific game
     */
    const registerClient = (clientId, username, gameId) => {
        REGISTERED_CLIENTS.add(clientId);
        if (REGISTERED_CLIENTS_BY_GAME[gameId]) {
            REGISTERED_CLIENTS_BY_GAME[gameId][username] = clientId;            
        }
        else {
            REGISTERED_CLIENTS_BY_GAME[gameId] = {[username] : clientId};
        }
        console.log(`Registering Client ${clientId} to username ${username} and game ${gameId}`);
    }
    
    /**
     * 
     * @param {ws} wsClient websocket client
     * This method adds a new client to be managed by the clients handler
     * @returns the generated client ID for the client
     */
    const addClient = (wsClient) => {
        const clientId = generateUniqueClientId();
        CLIENTS[clientId] = wsClient;
        return clientId;
    }
    /**
     * @param {string} gameId Game id the client is in
     * @param {string} username Username the client is associated with
     * @returns the websocket client
     */
    const getClientByGameAndUser = (gameId, username) => {
        const clientId = REGISTERED_CLIENTS_BY_GAME[gameId][username];
        return CLIENTS[clientId];
    }
    /**
     * @param {string} clientId the clientId to check
     * @returns boolean whether client is registered to a game or not
     */
    const isRegisteredClient = (clientId) => {
        return REGISTERED_CLIENTS.has(clientId);
    }

    const doesGameHaveRegisteredClients = (gameId) => {
        if (!REGISTERED_CLIENTS_BY_GAME[gameId]) {
            return false;
        }
        return Object.keys(REGISTERED_CLIENTS_BY_GAME[gameId]).length === 2;
    }

    return {
        CLIENTS,
        REGISTERED_CLIENTS,
        isRegisteredClient,
        addClient,
        getClientByGameAndUser,
        registerClient,
        doesGameHaveRegisteredClients,
    }
})();

module.exports = { CLIENTS_HANDLER }
