const AI = (() => {

    function pingRoom(row, column){
        console.log(`ping room ${row}-${column}`);
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