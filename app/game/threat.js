const THREAT_TTL = 30;
const THREAT_COOLDOWN_SECONDS = 5;
const THREAT_ASSIST_SECONDS = 1; // how many seconds gained from an assist
const THREAT_SABOTAGE_SECONDS = 1; // how many seconds lost from a sabotage

const MAP_THREAT_TO_TOOL = {
    "fire" : "fire-extinguisher",
    "breach" : "wrench",
    "invader" : "gun"
}

const Threat = (threatType, onThreatUnresolved, onThreatResolved) => {
    let timeLeft = THREAT_TTL;
    const THREAT_TYPE = threatType;
    let resolved = false;
    let isResolving = false;

    const tick = (deltaSeconds) => {
        if(isResolving || resolved) return; //Threat timer is disarmed once human starts fixing it

        timeLeft -= deltaSeconds;
        if (timeLeft <= 0) {
            onThreatUnresolved();
            return;
        }
        
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
    const assist = () => {
        timeLeft += THREAT_ASSIST_SECONDS;
    }
    const sabotage = () => {
        tick(THREAT_SABOTAGE_SECONDS);
    }

    return {
        THREAT_TYPE,
        tick,
        correctTool,
        startResolving,
        finishResolve,
        assist,
        sabotage,
    }
}

module.exports = { Threat, THREAT_COOLDOWN_SECONDS, THREAT_TTL }
