const PLAYERS_PER_GAME = 2;
const ROLES = {
    HUMAN : "Human",
    AI: "Ai"
};
const ANONY_COOKIE_DURATION_MS = 5*60*1000; // 5 mins
const KNOWN_USER_COOKIE_DURATION_MS = 12*60*60*1000 // 12 hrs 

const GAME_TICK_DELAY_MS = 1000;

const HUMAN_ACTIONS = {
    enterRoom : "enterRoom",
    getCurrentRoom : "getCurrentRoom",
    switchHumanTool: "switchHumanTool",
    setTrust: "setTrust",
    finishMinigame: "finishMinigame",
};
const AI_ACTIONS = {
    getAiRole: "getAiRole",
    getCurrentRoom : "getCurrentRoom",
    getPingRoom: "getPingRoom",
    pingRoom: "pingRoom",
    assist: "assist",
    sabotage: "sabotage",
};

module.exports = {
    PLAYERS_PER_GAME,
    ROLES,
    ANONY_COOKIE_DURATION_MS,
    HUMAN_ACTIONS,
    AI_ACTIONS,
    GAME_TICK_DELAY_MS,
    KNOWN_USER_COOKIE_DURATION_MS
};
