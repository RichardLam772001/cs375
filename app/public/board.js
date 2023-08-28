

const BOARD = ((rowCount, columnCount) => {

    const ROOMS = [];

    const TABLE_PARENT = document.getElementById("main-container");
    const messageContainer = document.getElementById("message-container");
    const messageText = document.getElementById("message-text");
    const routeToLobbyLink = document.getElementById("route-to-lobby-link");
    routeToLobbyLink.addEventListener("click", () => ROUTER.route("/lobby"));
    const TABLE_ELEMENT = createTableElem();
    const ROOMS_WITH_THREATS = [];
    
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
                const newRoom = RoomElement(rowElem, `${i}-${j}`);
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
    /**
     * @param {string} roomString e.g. 0-0 
     * @returns RoomElement 
     */
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
    /**
     * 
     * @param {RoomElement} room  
     * @returns {boolean} whether room contains a threat or not
     */
    function roomHasThreat(room){
        if(room == undefined) return false;
        return roomStringHasThreat(room.ROOM_STRING);
    }
    /**
     * 
     * @param {string} room 
     * @returns {boolean}
     */
    function roomStringHasThreat(room){
        return ROOMS_WITH_THREATS.indexOf(room) !== -1;

    }
    /**
     * @param {string} threatType e.g. "fire", "invader", "breach"
     * @param {string} room e.g. "0-0"
     */
    const spawnThreat = (threatType, room) => {
        if(roomStringHasThreat(room)) return;

        ROOMS_WITH_THREATS.push(room);
        const roomElement = parseMoveableRoom(room);
        roomElement.setThreat(threatType);
    }

    /**
     * @param {string} room e.g. "0-0"
     */
    const removeThreat = (room) => {
        if(!roomStringHasThreat(room)) return;

        ROOMS_WITH_THREATS.splice(ROOMS_WITH_THREATS.indexOf(room), 1);
        const roomElement = parseMoveableRoom(room);
        roomElement.setThreat("");

        // If a threat resolves while human is not in room (human enters w/ correct tool then leaves), then set visibility to false
        // May not be common case once we add minigames to be displayed upon entering room
        // Note we only once this logic to apply for human player
        if (HUMAN_STATE.getCurrentRoom() !== room && document.URL.endsWith("human/")) {
            roomElement.setVisible(false);
        }
    }

    /**
     * 
     * @param {string} room e.g. 0-0
     * @param {string} threatType e.g. fire
     */
    const pingRoom = (room, threatType) => {
        const roomElement = parseMoveableRoom(room);
        roomElement.setPing(threatType);
    }

    function showGameEndMessage(result) {      
        if (result === "win") {
          messageText.textContent = "You Win!";
        } else if (result === "lose") {
          messageText.textContent = "You Lost!";
        }
      
        // Show the message container
        messageContainer.style.display = "block";
    }
    const destroyRoom = (room) =>{
        const roomElement = parseMoveableRoom(room);
        removeThreat(room);
        roomElement.setDestroyed();

    }
    
    return {
        setAllToHidden,
        parseMoveableRoom,
        getRoom,
        getRoomFromString,
        getSize,
        roomHasThreat,
        spawnThreat,
        removeThreat,
        showGameEndMessage,
        destroyRoom,
        pingRoom,
    };;
})(3,3);

const HUMAN_ELEM = HumanElem(BOARD.getRoom(0,0));
