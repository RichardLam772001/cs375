/**
 * This file will contain objects for different types of data we will send to the human/AI during the game
 */
const HumanRoomUpdateData = (room) => ({
    name : "humanRoomUpdate",
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

