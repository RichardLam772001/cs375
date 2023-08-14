

const BOARD = ((rowCount, columnCount) => {

    const ROOMS = [];

    const TABLE_PARENT = document.getElementById("main-container");
    const TABLE_ELEMENT = createTableElem();
    
    function getSize(){
        return {rows: rowCount, columns: columnCount};
    }
    
    function createTableElem(){
        const tableElem = createElemUnderParent("div", TABLE_PARENT);
        tableElem.id = "game-board";

        for (let i=0; i < rowCount; i++) {
            let row = [];
            let rowElem = createElemUnderParent("div", tableElem);
            rowElem.className = "row";

            for (let j=0; j < columnCount; j++) {
                const newRoom = RoomElement(rowElem);
                row.push(newRoom);
            }
            ROOMS.push(row);
        }
        return tableElem;
    }
    function createElemUnderParent(elemType, parentElem){
        const newElem = document.createElement(elemType);
        parentElem.appendChild(newElem);
        return newElem;
    }

    /**
     * @param {string} func function that takes an arg "room" (will be run for each room)
     */
    const applyToAllRooms = (func) => {
        ROOMS.forEach((row) => row.forEach(func));
    }
    const setAllRoomsVisibility = (visible) =>{
        console.log(`set all rooms to ${visible}`);
        applyToAllRooms((room) => {room.setVisible(visible)});
    }
    const setAllToHidden = () => {
        setAllRoomsVisibility(false);
    }

    const parseRoomToIndexes = (room) => room.split("-").map(n => Number(n));

    function roomExists(coordinate){
        return coordinate[0] < rowCount && coordinate[1] < columnCount;
    }
    const parseMoveableRoom = (roomString) =>{
        let [i, j] = parseRoomToIndexes(roomString);
        if(!roomExists([i,j])){
            console.log(`Room ${i}-${j} does not exist`);
            return false;
        }
        return ROOMS[i][j];
    }

    function getRoomFromString(roomString){
        const indicies = parseRoomToIndexes(roomString); //TODO: validation
        return getRoom(indicies[0], indicies[1]);
    }

    function getRoom(row, column){
        return ROOMS[row][column];
    }
    function roomHasThreat(room){
        return false; //TODO
    }
    
    return {
        setAllToHidden,
        parseMoveableRoom,
        getRoom,
        getRoomFromString,
        getSize,
        roomHasThreat
    };;
})(3,3);

const HUMAN_ELEM = HumanElem(BOARD.getRoom(0,0));