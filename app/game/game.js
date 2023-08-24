const { ROLES, GAME_TICK_DELAY_MS } = require("../constants");
const { Threat, THREAT_COOLDOWN_SECONDS, THREAT_TTL } = require("./threat");
const { randomInt } = require("../utils.js");
const { sendDataToPlayer } = require("../broadcaster.js");
const {
  ThreatSpawnedData,
  HumanToolUpdateData,
  AIPingThreatUpdateData,
} = require("../dataObjects");
const { CLIENTS_HANDLER } = require("../clientsHandler");

const GAMES = {};

const selectThreatRoom = (avilableRooms, roomsWithThreats) => {
  const rooms = avilableRooms.filter(
    (room) => roomsWithThreats.indexOf(room) === -1
  );
  return rooms[randomInt(0, rooms.length - 1)];
};

const GAME = (humanUsername, aiUsername, gameId) => {
  const GAME_ID = gameId;

  let gameTime = 4 * 60;
  let HUMAN_USERNAME = humanUsername;
  let AI_USERNAME = aiUsername;
  let room = "0-0";
  let threatCooldown = THREAT_COOLDOWN_SECONDS;
  let pingedRoom = "";
  let pingedThreatType = "";

  const THREATS_INDEXED_BY_ROOM = {};
  const AVAILABLE_ROOMS = [
    "0-0",
    "0-1",
    "0-2",
    "1-0",
    "1-1",
    "1-2",
    "2-0",
    "2-1",
    "2-2",
  ]; // Richard: Yes I know it's hardcoded, we can make a dynamic room generator later TO DO
  const ROOMS_WITH_THREATS = [];
  const ROOMS_WITH_PINGED_THREATS = [];
  const THREAT_TYPES = ["fire", "breach", "invader"];
  const MAX_ACTIVE_THREATS = 3;

  const getRole = (username) => {
    if (username == HUMAN_USERNAME) {
      return ROLES.HUMAN;
    }
    if (username == AI_USERNAME) {
      return ROLES.AI;
    }
    return null;
  };
  const enterRoom = (newRoom) => {
    // If room not available (cause destroyed), cant enter
    if (AVAILABLE_ROOMS.indexOf(newRoom) === -1) {
      console.log(`GAME - Cannot enter room ${newRoom}`);
    } else {
      room = newRoom;
      if (ifRoomHasThreat(room)) {
        alertHumanPlayerOfThreat(room);
      }
    }
  };
  const getCurrentRoom = () => {
    return room;
  };

  const pingRoom = (newRoom, threatType) => {
    pingedRoom = newRoom;
    pingedThreatType = threatType;
    ROOMS_WITH_PINGED_THREATS.push(pingedRoom);
    console.log(
      `4. game.pingRoom:pinged room ${pingedRoom} threat is ${pingedThreatType}, sendDataToPlayer`
    );
    sendDataToPlayer(
      GAME_ID,
      HUMAN_USERNAME,
      AIPingThreatUpdateData(pingedRoom, pingedThreatType)
    );

    // set pinged room to AI user window
    // send pinged room to human user
    // sendDataToPlayer();
  };
  const getPingRoom = () => {
    return pingedRoom;
  };

  // function will send back current tool to human client.
  const switchUserCurrentTool = (currentTool, username) => {
    console.log(
      `4. game id is ${GAME_ID}, username is ${username}, switch current tool is ${currentTool} `
    );
    sendDataToPlayer(GAME_ID, username, HumanToolUpdateData(currentTool));
  };

  // This is called once every second
  const tick = () => {
    // Pause game if clients in game aren't registered (client hasn't connected yet, or one of them logged out)
    if (!CLIENTS_HANDLER.doesGameHaveRegisteredClients(gameId)) {
      console.log(
        `Game paused. There are not 2 clients connected to the gameId ${gameId}`
      );
      return;
    }

    gameTime -= 1;

    // Threats
    if (threatCooldown <= 0 && ROOMS_WITH_THREATS.length < MAX_ACTIVE_THREATS) {
      spawnThreat();
    } else {
      threatCooldown -= 1;
    }
  };

  const spawnThreat = () => {
    const threatRoom = selectThreatRoom(AVAILABLE_ROOMS, ROOMS_WITH_THREATS);
    const threat = Threat(randomlySelectThreat(), () =>
      onThreatUnresolved(threatRoom)
    );
    THREATS_INDEXED_BY_ROOM[threatRoom] = threat;
    ROOMS_WITH_THREATS.push(threatRoom);
    console.log(`Threat spawned in room ${threatRoom}`);

    threatCooldown = THREAT_COOLDOWN_SECONDS;
    alertAIPlayerOfThreat(threatRoom);
  };

  const randomlySelectThreat = () => {
    return THREAT_TYPES[randomInt(0, THREAT_TYPES.length - 1)];
  };

  /**
   * Used by both alertAIPlayerOfThreat and alertHumanPlayerOfThreat
   */
  const alertPlayerOfThreat = (threat, username, room) => {
    console.log(threat, room);
    console.log(
      "alert Player Of Threat THREATS_INDEXED_BY_ROOM ",
      THREATS_INDEXED_BY_ROOM
    );
    sendDataToPlayer(
      GAME_ID,
      username,
      ThreatSpawnedData(room, threat.THREAT_TYPE, THREAT_TTL, false)
    );
  };
  /**
   * @param {string} room e.g. 0-0 to index with
   */
  const alertAIPlayerOfThreat = (room) => {
    alertPlayerOfThreat(THREATS_INDEXED_BY_ROOM[room], AI_USERNAME, room);
  };
  /**
   * @param {string} room e.g. 0-0 to index with
   */
  const alertHumanPlayerOfThreat = (room) => {
    alertPlayerOfThreat(THREATS_INDEXED_BY_ROOM[room], HUMAN_USERNAME, room);
  };

  const onThreatUnresolved = (room) => {
    delete THREATS[THREATS_INDEXED_BY_ROOM]; // Remove threat from THREATS object
    AVAILABLE_ROOMS.splice(AVAILABLE_ROOMS.indexOf(room), 1);
    console.log(`Threat was unresolved room ${room} is no longer available`);
  };

  const switchHumanTool = (tool) => {
    console.log("3. game switch human tool ", tool);
    switchUserCurrentTool(tool, HUMAN_USERNAME);
  };

  /**
   *
   * @param {string} room e.g. 0-0
   * @returns {boolean}
   */
  const ifRoomHasThreat = (room) => {
    return ROOMS_WITH_THREATS.indexOf(room) !== -1;
  };

  return {
    tick,
    getRole,
    enterRoom,
    getCurrentRoom,
    switchHumanTool,
    pingRoom,
    getPingRoom,
  };
};

const addGame = (gameId, game) => {
  GAMES[gameId] = game;
};

const startGame = (humanUsername, aiUsername) => {
  // Temp: TO DO - Replace with idGenerator when we want to test multiple games running at once
  // For now priority is getting 1 game working beginning to end
  const gameId = 1;
  addGame(gameId, GAME(humanUsername, aiUsername, gameId));
  return gameId;
};

const lookUpRole = (gameId, username) => {
  const game = GAMES[gameId];
  if (!game) {
    return null;
  }
  return game.getRole(username);
};
const lookUpGame = (gameId) => GAMES[gameId];

const tickGames = () => {
  for (const gameId of Object.keys(GAMES)) {
    GAMES[gameId].tick();
  }
};

setInterval(tickGames, GAME_TICK_DELAY_MS);

module.exports = { startGame, lookUpRole, lookUpGame };
