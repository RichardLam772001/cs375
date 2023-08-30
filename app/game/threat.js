const THREAT_TTL = 30;
const THREAT_COOLDOWN_SECONDS = 5;

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

    return {
        THREAT_TYPE,
        tick,
        correctTool,
        startResolving,
        finishResolve,
    }
}

module.exports = { Threat, THREAT_COOLDOWN_SECONDS, THREAT_TTL }
