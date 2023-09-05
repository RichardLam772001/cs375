
const { ConsoleLineData } = require("../dataObjects.js");

let testLines = [
    {message:"HOSTILE ALIEN PRESENCE DETECTED", style: "critical"},
    {message:"ATTACK IMMINENT", style: "critical"},
    {message:"Scanning AI companion system...", style: "public"},
    {message:"Scan result: 50% chance that AI system has been hacked by hostile forces", style: "critical"},
    {time: 60*2, message:"Rescue arrives in 2 minutes", style: "important"},
];


const IntroSequence = (addLineFunc, onComplete, isEvil, durationSeconds) =>{

    let passedTime = 0;
    let lineIndex = -1;
    let isComplete = false;

    const lines = [ ];
    push("HOSTILE ALIEN PRESENCE DETECTED", "critical");
    push("ATTACK IMMINENT", "critical");
    push("Scanning AI companion system...");

    if(!isEvil){
        push("HACK ATTEMPT INTERCEPTED -- AI systems fully operational", "private", "ai");
    }else{
        push("FIREWALL BREACHED -- AI system rebooting...", "private", "ai");
    }

    push("Scan result: 50% chance that AI system has been hacked by hostile forces");

    push(`As the AI, the human is trusting you to communicate threat locations.
    Select a threat type, then click any room to ping it.`, "private", "ai");

    push(`As the Human, you must resolve threats onboard the ship by entering threatened rooms with the correct tool selected.
    The AI can ping rooms to guide you, but they may try to mislead you.`, "private", "human");


    function push (message, style = "public", visibility = "all") {
        lines.push(ConsoleLineData(undefined, message, visibility, style));
    }

    const tick = (deltaSeconds) =>{
        if(isComplete) return;
        passedTime += deltaSeconds;
        let index = Math.floor(passedTime/durationSeconds * lines.length);
        index = Math.min(lines.length-1, index);
        while(lineIndex < index){
            lineIndex++;
            addLineFunc(lines[lineIndex]);
        }
        if(lineIndex >= lines.length-1) complete();
    }
    const complete = () =>{
        isComplete = true;
        onComplete();
    }
    const done = () =>{
        return isComplete;
    }

    return{
        tick,
        done,
    }
};

module.exports = {IntroSequence};