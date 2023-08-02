/**
 * This file will contain objects for different types of data we will send to the player/AI during the game
 */
const PlayerRoomUpdateData = (room) => ({
    name : "playerRoomUpdate",
    room
});

module.exports = { PlayerRoomUpdateData }

