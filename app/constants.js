const PLAYERS_PER_GAME = 2;
const ROLES = {
  HUMAN: "Human",
  AI: "Ai",
};
const ANONY_COOKIE_DURATION_MS = 5 * 60 * 1000; // 5 mins

const HUMAN_ACTIONS = {
  enterRoom: "enterRoom",
  getCurrentRoom: "getCurrentRoom",
};
const AI_ACTIONS = {
  getCurrentRoom: "getCurrentRoom",
};

module.exports = {
  PLAYERS_PER_GAME,
  ROLES,
  ANONY_COOKIE_DURATION_MS,
  HUMAN_ACTIONS,
  AI_ACTIONS,
};
