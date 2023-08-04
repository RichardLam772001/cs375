const HUMAN = (() => {

    const enterRoom = (room) => {
        WS.send({
            action: {
                name: "enterRoom",
                args: {
                    room: room
                }
            }
        });
    };

    return {
        enterRoom
    }
})();

const size = BOARD.getSize();
for (let i=0; i < size.rows; i++) {
    for (let j=0; j < size.columns; j++) {
        BOARD.getRoom(i,j).addEventListener('click', () => HUMAN.enterRoom(`${i}-${j}`));
    }
}

