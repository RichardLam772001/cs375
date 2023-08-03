/**
 * This file will contain objects for different types of data we will send to the player/AI during the game
 */
const PlayerRoomUpdateData = (room) => ({
    name : "playerRoomUpdate",
    room
});

const ConsoleLineData = (time, message, style) => ({
    name : "consoleLine",
    time,
    message,
    visibility,
    style
});

module.exports = { PlayerRoomUpdateData, ConsoleLineData};