const AI = (() => {

    function pingRoom(row, column){
        CONSOLE.addConsoleLine({message:`ping room ${row}-${column}`, style: "private"});
    }

    return {
        pingRoom
    }
})();


for (let i=0; i < 3; i++) {
    for (let j=0; j < 3; j++) {
        BOARD.getRoom(i,j).addEventListener('click', () => AI.pingRoom(i,j));
    }
}