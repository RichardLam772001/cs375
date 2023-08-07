
const HumanState = ((roomSize) => {

    let room = "0-0";

    function enterRoom(newRoom){
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