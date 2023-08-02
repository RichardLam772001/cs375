const BOARD = (() => {

    const ROOMS = [];
    for (let i=0; i < 3; i++) {
        let row = [];
        for (let j=0; j < 3; j++) {
            row.push(document.getElementById(`room-${i}-${j}`));
        }
        ROOMS.push(row);
    }

    /**
     * @param {string} func function that takes an arg "room" (will be run for each room)
     */
    const applyToAllRooms = (func) => {
        ROOMS.forEach((row) => row.forEach(func));
    }
    const setAllToHidden = () => {
        applyToAllRooms((room) => {room.classList.remove("selected")});
    }

    const parseRoomToIndexes = (room) => room.split("-").map(n => Number(n));

    /**
     * @param {string} room two numbers separated by a dash ranging from 0-0 to 2-2
     */
    const setCurrentRoom = (room) => {
        let [i, j] = parseRoomToIndexes(room);
        setAllToHidden();
        ROOMS[i][j].classList.add("selected");
    }
    
    return {
        setCurrentRoom
    };;
})();
