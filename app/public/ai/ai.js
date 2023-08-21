const AI = (() => {

    function pingRoom(row, column){
        CONSOLE.addConsoleLine({message:`ping room ${row}-${column}`, style: "private"});
    }

    return {
        pingRoom
    }
})();

window.onload = () => {
    if (USERNAME_COOKIE) {
        const size = BOARD.getSize();
        for (let i=0; i < size.rows; i++) {
            for (let j=0; j < size.columns; j++) {
                BOARD.getRoom(i,j).rootElem.addEventListener('click', () => AI.pingRoom(i,j));
            }
        }
        
    }
};
