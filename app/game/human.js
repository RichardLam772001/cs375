
const HumanState = ((roomSize) => {

    let room = "0-0";

    function enterRoom(newRoom){
        console.log(`server human entering ${newRoom}`);
        room = newRoom;
    }
    function getCurrentRoom(){
        return room;
    }

    return {
        enterRoom,
        getCurrentRoom
    };
});

module.exports = { HumanState };

// let humanState = {
//     room: "0-0"
// }

// const enterRoom = (room) => {
//     humanState.room = room;
// }
// const getCurrentRoom = () => {
//     return humanState.room;
// }

// module.exports = { enterRoom, getCurrentRoom };
