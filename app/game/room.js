const Room = (x, y) =>{

    function Name(){
        return roomName(x, y);
    }

    return {"x": x, "y":y, "name": Name()};
}

function roomName(x, y){
    return `${String.fromCharCode(65 + x)}${y}`;
}

module.exports = {Room, roomName};