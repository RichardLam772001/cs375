const THREAT_TTL = 30;
const THREAT_TICK_SPEED = 1000;
const THREAT_COOLDOWN_SECONDS = 5;

const Threat = (threatType, onThreatUnresolved) => {
    let currentAge = THREAT_TTL;
    const THREAT_TYPE = threatType;

    const tick = () => {
        currentAge -= 1;
        if (currentAge <= 0) {
            onThreatUnresolved();
        }
        else {
            setTimeout(tick, THREAT_TICK_SPEED);
        }
    };
    setTimeout(tick, THREAT_TICK_SPEED);

    return {
        THREAT_TYPE
    }
}

module.exports = { Threat, THREAT_COOLDOWN_SECONDS, THREAT_TTL }
