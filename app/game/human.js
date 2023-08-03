let humanState = {
    room: "0-0"
}

const enterRoom = (room) => {
    humanState.room = room;
}
const getCurrentRoom = () => {
    return humanState.room;
}

module.exports = { enterRoom, getCurrentRoom };
