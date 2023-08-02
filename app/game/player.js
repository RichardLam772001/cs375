let playerState = {
    room: "0-0"
}

const enterRoom = (room) => {
    playerState.room = room;
}
const getCurrentRoom = () => {
    return playerState.room;
}

module.exports = { enterRoom, getCurrentRoom };
