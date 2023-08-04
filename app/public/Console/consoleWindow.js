const CONSOLE = (() => {

    const consoleWindowElement = document.getElementById("consoleWindow");
    const lineHolderElement = document.createElement("div");
    lineHolderElement.className = "lineHolder";
    consoleWindowElement.appendChild(lineHolderElement);

    const scrollElement = consoleWindowElement;

    const snapToBottomTolerance = 50; //When within this many pixels from the bottom of the console, new messages will cause the scroll to snap to the bottom
    let modes = ["public", "private", "important", "critical"];
    let seconds = 60*4; //for testing

    function AddConsoleLine(consoleLineData){
        let {time, message, style} = consoleLineData;

        let stringMessage = "";

        if(time !== undefined){
            const timeString = `${time.minutes}:${String(time.seconds).padStart(2,"0")}`;
            stringMessage += `${timeString} `;
        }

        stringMessage += "> "+message;
        const newElem = AddConsoleLineString(stringMessage);
        newElem.className = style;
    }
    function SecondsToTimeObj(seconds){
        return {minutes: Math.floor(seconds / 60), seconds: seconds % 60 };
    }

    //Makes and returns a line element as a child of the lines parent element, setting its text content
    function AddConsoleLineString(lineString){
        let scrolledToBottom = IsScrolledToBottom();
        let lineElement = document.createElement("div");
        lineElement.textContent = lineString;
        lineHolderElement.appendChild(lineElement);

        if(scrolledToBottom){
            setTimeout(ScrollToBottom, 0); //delay allows the font time to adjust
        }
        return lineElement;
    }

    function RemoveChildrenOfElement(element){
        element.innerText = "";
    }

    function SetConsoleLines(linesArray){
        RemoveChildrenOfElement(lineHolderElement);
        for(const line of linesArray){
            AddConsoleLine(line);
        }
    }
    //for testing
    function AddRandomLines(numberOfLines){
        for(let i = 0; i < numberOfLines; ++i){
            AddRandomLine();
        }
    }

    function AddRandomLine(){
        const classString = RandomListElem(modes);
        const lineObj = {
            time: SecondsToTimeObj(seconds), 
            message: `${classString} message`, 
            style: classString};
        AddConsoleLine(lineObj);
        seconds--;
    }
    function RandomListElem(L){
        var index = Math.floor(Math.random() * modes.length);
        return L[index];
    }

    function ScrollToBottom(){
        lineHolderElement.scrollIntoView(false);
    }
    function IsScrolledToBottom(){
        return Math.abs(scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight) < snapToBottomTolerance;
    }


    return{
        AddConsoleLine,
        SetConsoleLines,
        SecondsToTimeObj,

        //TESTING
        AddRandomLines
    }
})();


let testLines = [
    {message:"HOSTILE ALIEN PRESENCE DETECTED", style: "critical"},
    {message:"ATTACK IMMINENT", style: "critical"},
    {message:"Distress beacon activated", style: "public"},
    {message:"Scanning AI companion system...", style: "public"},
    {message:"Scan result: 50% chance that AI system has been hacked by hostile forces", style: "critical"},
    {time: CONSOLE.SecondsToTimeObj(60*4), message:"Rescue arrives in 4 minutes", style: "important"}
]
CONSOLE.SetConsoleLines(testLines);

setInterval(() => CONSOLE.AddRandomLines(1),1000);