const THREAT_TTL = 18;
const THREAT_TICK_SPEED = 1000;
const THREAT_COOLDOWN_SECONDS = 5;

const THREAT_RESOLVE_TIME_MS = 3*1000; // How long it takes when a player enters a room w/ the right tool for the threat to disappear

const MAP_THREAT_TO_TOOL = {
    "fire" : "fire-extinguisher",
    "breach" : "wrench",
    "invader" : "gun"
}

const Threat = (threatType, onThreatUnresolved, onThreatResolved) => {
    let currentAge = THREAT_TTL;
    const THREAT_TYPE = threatType;
    let resolved = false;
    let isResolving = false;

    const tick = (deltaSeconds) => {
        if(isResolving || resolved) return; //Threat timer is disarmed once human starts fixing it

        currentAge -= deltaSeconds;
        if (currentAge <= 0) {
            onThreatUnresolved();
            return;
        }
        setTimeout(()=> tick(THREAT_TICK_SPEED*0.001), THREAT_TICK_SPEED);
        
    };

    const correctTool = (tool) => {
        return MAP_THREAT_TO_TOOL[threatType] === tool;
    }
    const startResolving = () => {
        isResolving = true;
    }
    const finishResolve = () =>{
        if(resolved) return; //already resolved
        
        resolved = true;
        isResolving = false;
        onThreatResolved();
    }
    setTimeout(()=> tick(THREAT_TICK_SPEED*0.001), THREAT_TICK_SPEED);

    return {
        THREAT_TYPE,
        correctTool,
        startResolving,
        finishResolve,
    }
}

module.exports = { Threat, THREAT_COOLDOWN_SECONDS, THREAT_TTL }
