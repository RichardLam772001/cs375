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

        let timeString = new Date(time * 1000).toISOString().substring(14, 19);
        stringMessage += `${timeString} `;
    }

    stringMessage += "> "+message;
    const newElem = AddConsoleLineString(stringMessage);
    newElem.className = style;
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
    while(element.firstChild){
        element.removeChild(element.lastChild);
    }
}

function SetConsoleLines(linesArray){
    RemoveChildrenOfElement(lineHolderElement);
    for(line of linesArray){
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
        time: seconds, 
        message: `${classString} message`, 
        classString: classString};
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

let testLines = [
    {message:"HOSTILE ALIEN PRESENCE DETECTED", classString: "critical"},
    {message:"ATTACK IMMINENT", classString: "critical"},
    {message:"Distress beacon activated", classString: "public"},
    {message:"Scanning AI companion system...", classString: "public"},
    {message:"Scan result: 50% chance that AI system has been hacked by hostile forces", classString: "critical"},
    {time: seconds, message:"Rescue arrives in 4 minutes", classString: "important"}
]
SetConsoleLines(testLines);
setInterval(AddRandomLine,1000);