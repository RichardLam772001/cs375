const { idGenerator } = require("./utils.js");

const generateUniqueClientId = idGenerator();

const CLIENTS_HANDLER = (() => {

    // Client objects in general
    const CLIENTS = {};
    // Registered client ids
    const REGISTERED_CLIENTS = {};
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
        REGISTERED_CLIENTS[clientId] = {
            gameId,
            username
        };
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
    const removeClient = (clientId) => {
        delete CLIENTS[clientId];
        if (isRegisteredClient(clientId)) {
            const { gameId, username } = REGISTERED_CLIENTS[clientId];
            delete REGISTERED_CLIENTS_BY_GAME[gameId][username];
            delete REGISTERED_CLIENTS[clientId];
        }
    };

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
        return clientId in REGISTERED_CLIENTS;
    }

    const doesGameHaveRegisteredClients = (gameId) => {
        if (!REGISTERED_CLIENTS_BY_GAME[gameId]) {
            return false;
        }
        return Object.keys(REGISTERED_CLIENTS_BY_GAME[gameId]).length === 2;
    }

    

    const updatePlayerStats = async (gameId, username, result) => {
        // Import your database connection module here
        const db = require('./your-database-connection-module'); // Replace with your actual database connection module
    
        try {
            const client = await db.connect();
    
            if (result === 'win') {
                // Increment wins for the player
                await client.query('UPDATE userdata SET wins = wins + 1 WHERE username = $1', [username]);
            } else if (result === 'loss') {
                // Increment losses for the player
                await client.query('UPDATE userdata SET losses = losses + 1 WHERE username = $1', [username]);
            }
    
            client.release();
        } catch (error) {
            console.error('Error updating player stats:', error);
        }
    };
    
    
    const areBothPlayersLoggedIn = (gameId) => {
        const registeredClients = REGISTERED_CLIENTS_BY_GAME[gameId];
        return (
            registeredClients &&
            Object.values(registeredClients).every(clientId => REGISTERED_CLIENTS[clientId]?.loggedIn)
        );
    }

    return {
        CLIENTS,
        removeClient,
        isRegisteredClient,
        addClient,
        getClientByGameAndUser,
        registerClient,
        doesGameHaveRegisteredClients,
        updatePlayerStats,
        areBothPlayersLoggedIn
    }
})();

module.exports = { CLIENTS_HANDLER }
