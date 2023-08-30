const CONSOLE = (() => {

    const consoleWindowElement = document.getElementById("console-window");
    const lineHolderElement = document.createElement("div");
    lineHolderElement.className = "lineHolder";
    consoleWindowElement.appendChild(lineHolderElement);

    const scrollElement = consoleWindowElement;

    const SNAP_TO_BOTTOM_TOLERANCE = 50; //When within this many pixels from the bottom of the console, new messages will cause the scroll to snap to the bottom
    let modes = ["public", "private", "important", "critical"];
    let seconds = 60*4; //for testing

    function addConsoleLine(consoleLineData){
        let {time, message, style} = consoleLineData;

        let stringMessage = "";

        if(time !== undefined){
            const timeObj = secondsToTimeObj(time);
            const timeString = `${timeObj.minutes}:${String(timeObj.seconds).padStart(2,"0")}`;
            stringMessage += `${timeString} `;
        }

        stringMessage += message;
        const newElem = addConsoleLineString(stringMessage);
        newElem.className = style;
    }
    function secondsToTimeObj(seconds){
        return {minutes: Math.floor(seconds / 60), seconds: seconds % 60 };
    }

    //Makes and returns a line element as a child of the lines parent element, setting its text content
    function addConsoleLineString(lineString){
        let scrolledToBottom = isScrolledToBottom();
        let lineElement = document.createElement("div");
        lineElement.textContent = lineString;
        lineHolderElement.appendChild(lineElement);

        if(scrolledToBottom){
            setTimeout(scrollToBottom, 0); //delay allows the font time to adjust
        }
        return lineElement;
    }

    function removeChildrenOfElement(element){
        element.innerText = "";
    }

    function setConsoleLines(linesArray){
        removeChildrenOfElement(lineHolderElement);
        for(const line of linesArray){
            addConsoleLine(line);
        }
    }
    //for testing
    function addRandomLines(numberOfLines){
        for(let i = 0; i < numberOfLines; ++i){
            addRandomLine();
        }
    }

    function addRandomLine(){
        const classString = randomListElem(modes);
        const lineObj = {
            time: seconds, 
            message: `${classString} message`, 
            style: classString};
        addConsoleLine(lineObj);
        seconds--;
    }
    function randomListElem(L){
        var index = Math.floor(Math.random() * modes.length);
        return L[index];
    }

    function scrollToBottom(){
        lineHolderElement.scrollIntoView(false);
    }
    function isScrolledToBottom(){
        return Math.abs(scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight) < SNAP_TO_BOTTOM_TOLERANCE;
    }


    return{
        addConsoleLine,
        setConsoleLines,
        secondsToTimeObj,

        //TESTING
        //addRandomLines
    }
})();


let testLines = [
    {message:"HOSTILE ALIEN PRESENCE DETECTED", style: "critical"},
    {message:"ATTACK IMMINENT", style: "critical"},
    {message:"Scanning AI companion system...", style: "public"},
    {message:"Scan result: 50% chance that AI system has been hacked by hostile forces", style: "critical"},
    {time: 60*2, message:"Rescue arrives in 2 minutes", style: "important"},
    {message:"private message", style: "private"},
];
CONSOLE.setConsoleLines(testLines);

//setInterval(() => CONSOLE.addRandomLines(1),1000);
