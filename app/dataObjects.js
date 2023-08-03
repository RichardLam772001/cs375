/**
 * This file will contain objects for different types of data we will send to the human/AI during the game
 */
const HumanRoomUpdateData = (room) => ({
    name : "humanRoomUpdate",
    room
});

module.exports = { HumanRoomUpdateData }

